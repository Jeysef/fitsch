import deepEqual from "deep-equal";
import { ObjectTyped } from "object-typed";
import { v4 as uuidv4 } from 'uuid';
import { getWeekOfMonth } from "~/lib/date";
import type { StudyApi } from "~/server/scraper/api";
import { WEEK_PARITY, type DAY, type SEMESTER } from "~/server/scraper/enums";
import type { APICourseLecture, CourseDetail, CourseLecture, DataProviderTypes, StudyOverviewYear, Time } from "~/server/scraper/types";
import { conjunctConjunctableRooms, getWeekFromSemesterStart, uniq_fast } from "~/server/scraper/utils";

export interface LinkedLectureData {
  id: string;
  day: DAY;
}
export interface MCourseLecture extends CourseLecture {
  id: string;
  strongLinked: LinkedLectureData[];
  linked: LinkedLectureData[];
  /** required number of lectures througout the semester */
  lecturesCount: number | false;
}

export interface MgetStudyCourseDetailsReturn {
  detail: CourseDetail;
  data: MCourseLecture[];
}

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

  filterPredicate(lecture: APICourseLecture) {
    return !!lecture.weeks.weeks
  }

  public async getData() {
    const { weeks: semesterWeeks, start: semesterStart } = await this.getSemesterWeeks(this.semester, this.year)
    const conjunctableRooms = [
      { main: "D105", streamed: ["D0206", "D0207"] },
      { main: "E112", streamed: ["E104", "E105"] },
      ["N103", "N104", "N105"]
    ]
    const anyConjunctable: string[][] = conjunctableRooms.map(room => Array.isArray(room) ? room : [room.main, ...room.streamed])
    const isAnyConjunctable = (rooms: string[]) => rooms.some(room => anyConjunctable.some(conjunctable => conjunctable.includes(room)))
    const isSameConjunctable = (rooms1: string[], rooms2: string[]) => rooms1.some(room => anyConjunctable.some(conjunctable => conjunctable.includes(room) && rooms2.some(lectureRoom => conjunctable.includes(lectureRoom))))
    const isStrongLinkedLecture = (lecture: MCourseLecture, otherLecture: MCourseLecture, course: DataProviderTypes.getStudyCourseDetailsReturn) => {
      if (lecture.type !== otherLecture.type) return false;
      if (typeof (lecture.weeks.weeks) === "string" || typeof (otherLecture.weeks.weeks) === "string") return false
      if (!lecture.lecturesCount || !otherLecture.lecturesCount) return false;
      const combinedLecturesCount = (lecture.lecturesCount * otherLecture.lecturesCount) / (lecture.lecturesCount + otherLecture.lecturesCount)
      return Math.round(combinedLecturesCount) == semesterWeeks
    }
    const getLinkedData = (lectures: MCourseLecture[]) => {
      return lectures.map(lecture => ({ id: lecture.id, day: lecture.day }));
    }
    const linkThrough = (lecture: MCourseLecture, linked: MCourseLecture[]) => {
      const linkedIds = getLinkedData(linked);
      lecture.linked = lecture.linked ?? [];
      linkedIds.forEach(linkedId => {
        if (!lecture.linked.some(linked => linked.id === linkedId.id)) {
          lecture.linked.push(linkedId)
        }
      })
      linked.forEach((linkedLecture) => {
        linkedLecture.linked = [{ id: lecture.id, day: lecture.day }]
        linkedLecture.linked.push(...getLinkedData(linked.filter(linkedId => linkedId.id !== linkedLecture.id)))
      })
    }
    const strongLinkThrough = (lecture: MCourseLecture, linked: MCourseLecture[]) => {
      const linkedIds = getLinkedData(linked);
      lecture.strongLinked = lecture.strongLinked ?? [];
      lecture.strongLinked = lecture.strongLinked ?? [];
      linkedIds.forEach(linkedId => {
        if (!lecture.strongLinked.some(strongLinked => strongLinked.id === linkedId.id)) {
          lecture.strongLinked.push(linkedId)
        }
      })
      linked.forEach((linkedLecture) => {
        linkedLecture.strongLinked = [{ id: lecture.id, day: lecture.day }]
        linkedLecture.strongLinked.push(...getLinkedData(linked.filter(linkedId => linkedId.id !== linkedLecture.id)))
      })
    }
    const convertToMCourseLecture = (lecture: APICourseLecture): MCourseLecture => {
      // @ts-expect-error the rooms will be changed elsewhere
      return Object.assign(lecture, { strongLinked: [], linked: [] })
    }
    const convertLectureTime = (time: string): { hour: number, minute: number } => {
      const [hour, minute] = time.split(':').map(Number)
      return { hour, minute }
    }
    type FilledLecture = APICourseLecture & { id: string; lecturesCount: number | false; }

    this.courses.forEach((course) => {
      // ID LECTURE
      course.data.forEach((lecture) => Object.assign(lecture, {
        id: this.idLecture(lecture),
        lecturesCount: this.getLectureLectures(lecture, course.detail),
      }))
      // FILTER
      course.data = (course.data as FilledLecture[]).filter(this.filterPredicate);
      // FILL WEEKS
      (course.data as FilledLecture[]).forEach((lecture, i) => {
        if (!Array.isArray(lecture.weeks.weeks)) {
          if (!lecture.lecturesCount) return console.warn('Lecture type not found in detail', lecture)
          const maxParityLectures = Math.floor(semesterWeeks / 2)
          if (lecture.lecturesCount < maxParityLectures) return console.warn("Cannot safely determine lecture weeks", lecture)
          const semesterStartWeekOffset = getWeekOfMonth(semesterStart) % 2
          switch (lecture.weeks.parity) {
            case WEEK_PARITY.EVEN:
              lecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => semesterStartWeekOffset + 2 * (i + 1) + 1)
              lecture.weeks.calculated = true
              break;
            case WEEK_PARITY.ODD:
              lecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => semesterStartWeekOffset + 2 * (i + 1))
              lecture.weeks.calculated = true
              break;
            default:
              // does not have parity nor weeks
              if (lecture.lecturesCount === semesterWeeks) {
                lecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => semesterStartWeekOffset + i + 1)
                lecture.weeks.calculated = true
              }
          }
        }
        // CONJUNCT
        if (i === course.data.length - 1) return // no more lectures to merge with

        const lectureRooms = lecture.room

        const preConjunctedLectures = { [i]: lecture };

        // check next lectures one by one
        (course.data as FilledLecture[]).slice(i + 1).some((nextLecture, j) => {
          const nextLectureRooms = nextLecture.room
          if (lecture.type !== nextLecture.type) return true;
          if (!this.isSameTimeLecture(lecture, nextLecture)) return true; // no more lectures to merge with
          if (!(isSameConjunctable(lectureRooms as string[], nextLectureRooms) || deepEqual(lectureRooms, nextLectureRooms))) return;
          if (lecture.groups !== nextLecture.groups) return;
          if (!deepEqual(lecture.lectureGroup, nextLecture.lectureGroup)) return; // console.warn('Different groups from lecture groups', lecture, nextLecture)
          if (typeof (lecture.weeks.weeks) === "string" || typeof (nextLecture.weeks.weeks) === "string") return
          if (lecture.weeks.parity && nextLecture.weeks.parity && lecture.weeks.weeks.length > 3 && nextLecture.weeks.weeks.length > 3 && lecture.weeks.parity !== nextLecture.weeks.parity) return;
          // const lengthOfCombinedLectures = uniq_fast([...lecture.weeks.weeks, ...nextLecture.weeks.weeks]).length
          // TODO: rewiew this
          // if (lectureLectures && lectureLectures <= 7 && lengthOfCombinedLectures > lectureLectures) return;
          // if (lecture.lectureCount && lecture.weeks.parity === nextLecture.weeks.parity ) return;
          preConjunctedLectures[i + j + 1] = nextLecture
        })
        const preConjunctedLecturesValues = Object.values(preConjunctedLectures)
        // check if main lecture is present
        const hasEveryLectureSameRoom = preConjunctedLecturesValues.every(lecture => deepEqual(lecture.room, lectureRooms))
        const main: APICourseLecture | undefined = hasEveryLectureSameRoom ? lecture : preConjunctedLecturesValues.find(lecture => lecture.room.some(room => conjunctableRooms.some(conjunctable => Array.isArray(conjunctable) ? conjunctable.includes(room) : conjunctable.main === room)))
        if (preConjunctedLecturesValues.length > 1 && main) {
          // conjunct
          // remove next lectures
          // add room
          // add info
          // add note
          // add weeks
          // add capacity
          const lect = lecture as unknown as MCourseLecture
          lect.room = conjunctConjunctableRooms(uniq_fast(preConjunctedLecturesValues.flatMap(lect => lect.room)))
          lect.info = preConjunctedLecturesValues.map(lect => lect.info).join(', ')
          lect.note = preConjunctedLecturesValues.map(lect => lect.note).filter(Boolean).join(', ')
          const conjunctedWeeks = uniq_fast(preConjunctedLecturesValues.flatMap(lect => lect.weeks.weeks as number[]).sort((a, b) => a - b))
          lect.weeks = {
            parity: preConjunctedLecturesValues.every(lect => lect.weeks.parity === main.weeks.parity) ? main.weeks.parity : null,
            weeks: conjunctedWeeks
          }
          // // if capacity is same, keep it, if not, join them
          lect.capacity = preConjunctedLecturesValues.every(lect => lect.capacity === main.capacity) ? main.capacity : preConjunctedLecturesValues.map(lect => lect.capacity).join(', ')

          // remove next lectures
          ObjectTyped.keys(preConjunctedLectures).slice(1).reverse().forEach((i) => course.data.splice(i, 1))
        }
      });
      // LINK
      (course.data as FilledLecture[]).forEach((lecture, i) => {
        // go through all other lectures and find the one that completes the lecture weeks and has the same type and group
        const lect = convertToMCourseLecture(lecture)
        if (!/\d/.test(lecture.groups)) return;
        const strongLinkedLectures: MCourseLecture[] = []
        const linkedLectures = (course.data as unknown as MCourseLecture[]).filter(otherLecture => {
          if (this.isSameTimeLecture(lect, otherLecture)) return false;
          if (otherLecture.groups !== lect.groups) return false;
          if (!deepEqual(otherLecture.lectureGroup, lect.lectureGroup)) return false;

          if (isStrongLinkedLecture(lect, otherLecture, course)) {
            strongLinkedLectures.push(otherLecture)
          }
          return true;
        });
        linkThrough(lect, linkedLectures)
        strongLinkThrough(lect, strongLinkedLectures)
      })
    }
    )
    return this.courses as unknown as MgetStudyCourseDetailsReturn[]
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

  /**
   * This function calculates the number of lectures that should be in the semester based on the length of given lecture
   * Problem n.1: In a week there may be more lectures with different lengths -> solved by concatenating the lectures elsewhere
   * Problem n.2: the calculation doesn't have to reflect what's written in the detail. Viz README.md
   */
  private getLectureLectures(lecture: Pick<CourseLecture, "type" | "start" | "end">, detail: CourseDetail) {
    const lectureTimeSpan = detail.timeSpan[lecture.type]
    if (lectureTimeSpan === undefined) return false;
    const { start, end } = lecture
    const duration = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute)
    // round up to nearest hour, 7:00 - 7:50 => 50 minutes => 1 hour

    // ---- when assuming lecture duration is in atleast 60 minute intervals
    const lectureDuration = Math.ceil(duration / 60)
    const lectureLectures = Math.round(lectureTimeSpan / lectureDuration)

    // ---- when assuming lecture duration in minutes -- WRONG
    // const lectureLectures = Math.floor(lectureTimeSpan * 60 / duration)
    return lectureLectures
  }

  private isSameTimeLecture(lecture1: { day: DAY, start: Time, end: Time }, lecture2: { day: DAY, start: Time, end: Time }) {
    const isSameTime = (time1: Time, time2: Time) => time1.hour === time2.hour && time1.minute === time2.minute
    return lecture1.day === lecture2.day && isSameTime(lecture1.start, lecture2.start) && isSameTime(lecture1.end, lecture2.end)
  }

  private idLecture(lecture: APICourseLecture) {
    // // unique id for lecture
    // const hashString = `${lecture.day}-${lecture.type}-${lecture.start}-${lecture.end}-${lecture.room.toString()}-${lecture.groups}`;
    // let hash = 0;
    // for (let i = 0; i < hashString.length; i++) {
    //   const char = hashString.charCodeAt(i);
    //   hash = (hash << 5) - hash + char;
    //   hash |= 0; // Convert to 32bit integer
    // }
    // return hash;
    return uuidv4()
  }

}