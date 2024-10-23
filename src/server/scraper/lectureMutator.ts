// this will have a class as builder pattern to mutate the lecture object
// constructor(lectureData: StudyApiTypes.getStudyCourseDetailsReturn, studyApi: StudyApi) {

import deepEqual from "deep-equal";
import { ObjectTyped } from "object-typed";
import { getWeekOfMonth } from "~/lib/date";
import type { StudyApi } from "~/server/scraper/api";
import { WEEK_PARITY, type SEMESTER } from "~/server/scraper/enums";
import type { APICourseLecture, CourseDetail, CourseLecture, DataProviderTypes, StudyOverviewYear } from "~/server/scraper/types";
import { conjunctConjunctableRooms, getWeekFromSemesterStart, uniq_fast } from "~/server/scraper/utils";

export class LectureMutator {
  studyApi: StudyApi;
  public readonly courses;
  private readonly semester: SEMESTER
  private readonly year: StudyOverviewYear["value"]
  private _semesterWeeks: number | null = null;
  private _semesterSchedule: { start: Date; end: Date; } | null = null;
  constructor({ semester, year }: { semester: SEMESTER, year: StudyOverviewYear["value"] }, courses: DataProviderTypes.getStudyCourseDetailsReturn[], studyApi: StudyApi) {
    this.courses = courses;
    this.semester = semester;
    this.year = year;
    this.studyApi = studyApi;
  }

  filterLectures(predicate: (lecture: APICourseLecture) => boolean) {
    this.courses.forEach(course => {
      course.data = course.data.filter(predicate)
    })
    return this;
  }

  private async getSemesterWeeks(semester: SEMESTER, year: string) {
    if (this._semesterWeeks === null || this._semesterSchedule === null) {
      const { start, end } = (await this.studyApi.getTimeSchedule({ year }))[semester]
      this._semesterSchedule = { start, end }
      this._semesterWeeks = getWeekFromSemesterStart(end, start)
      return { weeks: this._semesterWeeks, start, end }
    }
    return { weeks: this._semesterWeeks, start: this._semesterSchedule.start, end: this._semesterSchedule.end }
  }

  private getLectureLectures(lecture: Pick<CourseLecture, "type" | "start" | "end">, detail: CourseDetail) {
    const lectureTimeSpan = detail.timeSpan[lecture.type]
    if (lectureTimeSpan === undefined) return false;
    const start = lecture.start.split(':').map(Number)
    const end = lecture.end.split(':').map(Number)
    const duration = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1])
    // round up to nearest hour, 7:00 - 7:50 => 50 minutes => 1 hour

    // ---- when assuming lecture duration is in atleast 60 minute intervals
    // const lectureDuration = Math.ceil(duration / 60)
    // const lectureLectures = lectureTimeSpan / lectureDuration

    const lectureLectures = Math.floor(lectureTimeSpan * 60 / duration)
    return lectureLectures
  }

  async fillLectureWeeks() {
    const { weeks: semesterWeeks, start: semesterStart } = await this.getSemesterWeeks(this.semester, this.year)


    this.courses.forEach((course) =>
      course.data.forEach(lecture => {
        if (!Array.isArray(lecture.weeks.weeks)) {
          const lectureLectures = this.getLectureLectures(lecture, course.detail)
          if (!lectureLectures) return console.warn('Lecture type not found in detail', lecture)
          const maxParityLectures = Math.floor(semesterWeeks / 2)
          if (lectureLectures < maxParityLectures) return console.log("Cannot safely determine lecture weeks", lecture)
          const semesterStartWeekOffset = getWeekOfMonth(semesterStart) % 2
          switch (lecture.weeks.parity) {
            case WEEK_PARITY.EVEN:
              lecture.weeks.weeks = Array.from({ length: lectureLectures }, (_, i) => semesterStartWeekOffset + 2 * (i + 1) + 1)
              lecture.weeks.calculated = true
              break;
            case WEEK_PARITY.ODD:
              lecture.weeks.weeks = Array.from({ length: lectureLectures }, (_, i) => semesterStartWeekOffset + 2 * (i + 1))
              lecture.weeks.calculated = true
              break;
          }
        }
      })
    )
  }

  conjunctLectures() {
    const conjunctableRooms = [
      { main: "D105", streamed: ["D0206", "D0207"] },
      { main: "E112", streamed: ["E104", "E105"] },
      ["N103", "N104", "N105"]
    ]
    const anyConjunctable: string[][] = conjunctableRooms.map(room => Array.isArray(room) ? room : [room.main, ...room.streamed])
    const isAnyConjunctable = (rooms: string[]) => rooms.some(room => anyConjunctable.some(conjunctable => conjunctable.includes(room)))
    const isSameConjunctable = (rooms1: string[], rooms2: string[]) => rooms1.some(room => anyConjunctable.some(conjunctable => conjunctable.includes(room) && rooms2.some(lectureRoom => conjunctable.includes(lectureRoom))))

    this.courses.forEach(course => {
      course.data.forEach((lecture, i) => {
        if (i === course.data.length - 1) return // no more lectures to merge with

        const lectureRooms = lecture.room

        // if (isAnyConjunctable(lectureRooms)) {
        const preConjunctedLectures = { [i]: lecture }

        // check next lectures one by one
        course.data.slice(i + 1).some((nextLecture, j) => {
          const nextLectureRooms = nextLecture.room
          if (!this.isSameTimeLecture(lecture, nextLecture)) return true; // no more lectures to merge with
          if (!(isSameConjunctable(lectureRooms, nextLectureRooms) || deepEqual(lectureRooms, nextLectureRooms))) return;
          if (lecture.groups !== nextLecture.groups) return;
          if (!deepEqual(lecture.lectureGroup, nextLecture.lectureGroup)) return; // console.warn('Different groups from lecture groups', lecture, nextLecture)
          if (typeof (lecture.weeks.weeks) === "string" || typeof (nextLecture.weeks.weeks) === "string") return
          const lectureLectures = this.getLectureLectures(lecture, course.detail)
          const lengthOfCombinedLectures = uniq_fast([...lecture.weeks.weeks, ...nextLecture.weeks.weeks]).length
          // TODO: rewiew this
          if (lectureLectures && lectureLectures <= 6 && lengthOfCombinedLectures > lectureLectures) return;
          preConjunctedLectures[i + j + 1] = nextLecture
        })
        const preConjunctedLecturesValues = Object.values(preConjunctedLectures)
        // check if main lecture is present
        const hasEveryLectureSameRoom = preConjunctedLecturesValues.every(lecture => deepEqual(lecture.room, lectureRooms))
        const main: APICourseLecture | undefined = hasEveryLectureSameRoom ? lecture : preConjunctedLecturesValues.find(lecture => lecture.room.some(room => conjunctableRooms.some(conjunctable => Array.isArray(conjunctable) ? conjunctable.includes(room) : conjunctable.main === room)))
        // console.log("🚀 ~ file: dataProvider.ts:182 ~ DataProvider ~ lectures.forEach ~ main:", main)
        if (preConjunctedLecturesValues.length > 1 && main) {
          // conjunct
          // remove next lectures
          // add room
          // add info
          // add note
          // add weeks
          // add capacity
          (lecture as unknown as CourseLecture).room = conjunctConjunctableRooms(uniq_fast(preConjunctedLecturesValues.flatMap(lecture => lecture.room)))
          lecture.info = preConjunctedLecturesValues.map(lecture => lecture.info).join(', ')
          lecture.note = preConjunctedLecturesValues.map(lecture => lecture.note).filter(Boolean).join(', ')
          // // weeks are combined 1. 3., 2. => 1. 2. 3.
          const conjunctedWeeks = uniq_fast(preConjunctedLecturesValues.flatMap(lecture => lecture.weeks.weeks as number[]).sort((a, b) => a - b))
          lecture.weeks = {
            parity: preConjunctedLecturesValues.find(lecture => lecture.weeks.parity)?.weeks.parity ?? null,
            weeks: conjunctedWeeks
          }
          // // if capacity is same, keep it, if not, join them
          lecture.capacity = preConjunctedLecturesValues.every(lecture => lecture.capacity === main.capacity) ? main.capacity : preConjunctedLecturesValues.map(lecture => lecture.capacity).join(', ')

          // remove next lectures
          ObjectTyped.keys(preConjunctedLectures).slice(1).reverse().forEach((i) => course.data.splice(Number(i), 1))



        }

        // }
      })
    })
  }

  private isSameTimeLecture(lecture1: APICourseLecture, lecture2: APICourseLecture) {
    return lecture1.day === lecture2.day && lecture1.start === lecture2.start && lecture1.end === lecture2.end
  }

  // linkLectures() {
  //   // link lectures to lecture with same type and group that completes the lecture weeks
  //   this.courses.forEach(course => {
  //     course.data.forEach(lecture => {

  //     })
  //   })
  // }
}