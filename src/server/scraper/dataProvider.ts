import type { fromURL } from 'cheerio';
import deepEqual from 'deep-equal';
import { ObjectTyped } from 'object-typed';
import { getWeekOfMonth } from '~/lib/date';
import { StudyApi } from '~/server/scraper/api';
import { LanguageProvider } from '~/server/scraper/languageProvider';
import { conjunctConjunctableRooms, constructGradeLabel, getWeekFromSemesterStart, uniq_fast } from '~/server/scraper/utils';
import { DEGREE, LANGUAGE, SEMESTER, WEEK_PARITY } from "./enums";
import { type APICourseLecture, type CourseDetail, type CourseLecture, type DataProviderTypes, type StudyOverview, type StudyOverviewCourse, type StudyOverviewGrade, type StudyProgram, type StudyPrograms } from './types';



export class DataProvider {
  readonly studyApi: StudyApi;
  constructor(private readonly languageProvider: LanguageProvider, private readonly fetcher: typeof fromURL) {
    this.studyApi = new StudyApi(languageProvider, fetcher)
  }

  public async getStudyOverview(config?: DataProviderTypes.getStudyOverviewConfig): Promise<DataProviderTypes.getStudyOverviewReturn> {
    const { programs: studyPrograms, years, currentYear } = await this.studyApi.getStudyPrograms(config)
    const isEnglish = this.languageProvider.language === LANGUAGE.ENGLISH
    const values: StudyOverview["values"] = {
      year: config ? years.find(year => year.value === config.year) ?? currentYear : currentYear,
      degree: (config?.degree) ?? DEGREE.BACHELOR,
    }

    let degreePrograms = studyPrograms[values.degree]
    // filter language
    const filterLanguage = (program: StudyPrograms[DEGREE]) => ObjectTyped.fromEntries(Object.entries(program).filter(([pid, studyProgram]) => studyProgram.isEnglish === isEnglish).map(([id, program]) => ([id, program] as const)))

    degreePrograms = filterLanguage(degreePrograms)
    // selected program
    values["program"] = config?.program ? Object.values(degreePrograms).flatMap(program => [program, ...program.specializations]).find(programOrSpecialization => programOrSpecialization.id === config.program) : Object.values(degreePrograms).length === 1 ? Object.values(degreePrograms)[0] : undefined
    // all programs foe each degree
    const programs: Record<DEGREE, StudyProgram[]> = ObjectTyped.fromEntries(ObjectTyped.entries(studyPrograms).map(([degree, programs]) => ([degree, Object.values(filterLanguage(programs))] as const)))

    // let degreeProgram: StudyProgram | undefined = undefined
    // degreeProgram = degreePrograms[values.degree]
    // if (!degreeProgram) degreeProgram = Object.values(degreePrograms)[0]
    // console.log("🚀 ~ file: index.ts:35 ~ DataProvider ~ getStudyOverview ~ degreeProgram:", degreeProgram)

    const programData = values.program ? await this.studyApi.getStudyProgramCourses({ programUrl: values.program.url }) : {}

    const grades = Object.entries(programData).map(([grade, data]) => ({ key: grade, label: constructGradeLabel(grade, data.abbreviation) } as StudyOverviewGrade))
    const degrees = Object.values(DEGREE);
    const semesters = Object.values(SEMESTER);

    const courses: DataProviderTypes.getStudyOverviewReturn["data"]["courses"] = ObjectTyped.fromEntries(ObjectTyped.entries(programData).map(([grade, gradeData]) => ([
      grade,
      ObjectTyped.fromEntries(semesters.map(semester => ([
        semester,
        gradeData![semester].reduce((acc, course) => {
          const { name, abbreviation, id, url } = course;
          return {
            ...acc,
            [course.obligation ? 'compulsory' : 'optional']: [...acc[course.obligation ? 'compulsory' : 'optional'], { name, abbreviation, id, url } satisfies StudyOverviewCourse]
          }
        }, { compulsory: [], optional: [] } satisfies Record<"compulsory" | "optional", StudyOverviewCourse[]>)
      ] as const
      )))
    ] satisfies [string, Record<SEMESTER, Record<"compulsory" | "optional", StudyOverviewCourse[]>>]
    )))



    return {
      values,
      data: {
        years,
        semesters,
        degrees,
        grades,
        programs,
        courses
      }
    } satisfies StudyOverview;
  }

  async getSemesterWeeks(semester: SEMESTER, year: string) {
    const { start, end } = (await this.studyApi.getTimeSchedule({ year }))[semester]
    return getWeekFromSemesterStart(end, start)
  }

  filterLectures(lectures: APICourseLecture[]) {
    // filter out lectures that do not have a week
    return lectures.filter(lecture => lecture.weeks.weeks)
  }
  private async getStudyCoursesDetails(config: DataProviderTypes.getStudyCoursesDetailsConfig): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
    const { courses, semester, year } = config
    return Promise.all(courses.map(course => this.getStudyCourseDetails({ courseId: course.courseId, semester, year })))
  }

  public async getStudyCourseDetails(config: DataProviderTypes.getStudyCourseDetailsConfig): Promise<DataProviderTypes.getStudyCourseDetailsReturn> {
    const { semester, year } = config
    const semesterWeeks = await this.getSemesterWeeks(semester, year)
    const semesterStart = (await this.studyApi.getTimeSchedule({ year }))[semester].start
    const data = await this.studyApi.getStudyCourseDetails(config)
    return { ...data, data: this.conjunctLectures(this.fillTextLecture(this.filterLectures(data.data), semesterWeeks, semesterStart, data.detail), data.detail) }
  }

  getLectureLectures(lecture: APICourseLecture, detail: CourseDetail) {
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

  fillTextLecture(lectures: APICourseLecture[], semesterWeeks: number, semesterStart: Date, detail: CourseDetail): APICourseLecture[] {
    lectures.forEach(lecture => {
      if (!Array.isArray(lecture.weeks.weeks)) {
        const lectureLectures = this.getLectureLectures(lecture, detail)
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
    interface cl extends APICourseLecture {
      weeks: {
        weeks: number[];
        parity: WEEK_PARITY | null;
      }
    };

    return lectures as cl[]
  }

  conjunctLectures(lectures: APICourseLecture[], detail: CourseDetail): CourseLecture[] {
    const conjunctableRooms = [
      { main: "D105", streamed: ["D0206", "D0207"] },
      { main: "E112", streamed: ["E104", "E105"] },
      ["N103", "N104", "N105"]
    ]
    const anyConjunctable: string[][] = conjunctableRooms.map(room => Array.isArray(room) ? room : [room.main, ...room.streamed])
    const isAnyConjunctable = (rooms: string[]) => rooms.some(room => anyConjunctable.some(conjunctable => conjunctable.includes(room)))
    const isSameConjunctable = (rooms1: string[], rooms2: string[]) => rooms1.some(room => anyConjunctable.some(conjunctable => conjunctable.includes(room) && rooms2.some(lectureRoom => conjunctable.includes(lectureRoom))))

    lectures.forEach((lecture, i) => {
      if (i === lectures.length - 1) return // no more lectures to merge with

      const lectureRooms = lecture.room

      // if (isAnyConjunctable(lectureRooms)) {
      const preConjunctedLectures = { [i]: lecture }

      // check next lectures one by one
      lectures.slice(i + 1).some((nextLecture, j) => {
        const nextLectureRooms = nextLecture.room
        if (!isSameTimeLecture(lecture, nextLecture)) return true; // no more lectures to merge with
        if (!(isSameConjunctable(lectureRooms, nextLectureRooms) || deepEqual(lectureRooms, nextLectureRooms))) return;
        if (lecture.groups !== nextLecture.groups) return;
        if (!deepEqual(lecture.lectureGroup, nextLecture.lectureGroup)) return; // console.warn('Different groups from lecture groups', lecture, nextLecture)
        if (typeof (lecture.weeks.weeks) === "string" || typeof (nextLecture.weeks.weeks) === "string") return
        const lectureLectures = this.getLectureLectures(lecture, detail)
        if (lectureLectures && uniq_fast([...lecture.weeks.weeks, ...nextLecture.weeks.weeks]).length > lectureLectures) return;
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
        // lecture.note = preConjunctedLecturesValues.map(lecture => lecture.note).join(', ')
        // // weeks are combined 1. 3., 2. => 1. 2. 3.
        const conjunctedWeeks = uniq_fast(preConjunctedLecturesValues.flatMap(lecture => lecture.weeks.weeks as number[]).sort((a, b) => a - b))
        lecture.weeks = {
          parity: preConjunctedLecturesValues.find(lecture => lecture.weeks.parity)?.weeks.parity ?? null,
          weeks: conjunctedWeeks
        }
        // // if capacity is same, keep it, if not, join them
        lecture.capacity = preConjunctedLecturesValues.every(lecture => lecture.capacity === main.capacity) ? main.capacity : preConjunctedLecturesValues.map(lecture => lecture.capacity).join(', ')

        // remove next lectures
        ObjectTyped.keys(preConjunctedLectures).slice(1).reverse().forEach((i) => lectures.splice(Number(i), 1))



      }

      // }
    })
    return lectures as unknown as CourseLecture[]
  }

};

function isSameTimeLecture(lecture1: APICourseLecture, lecture2: APICourseLecture) {
  return lecture1.day === lecture2.day && lecture1.start === lecture2.start && lecture1.end === lecture2.end
}


// export function conjunctLectures(lectures: APICourseLecture[], detail: CourseDetail): CourseLecture[] {
//   // go through all lectures.
//   // check the next (right) lecture, if same day and time, merge them
//   // if not, end search from current lecture, move to next
//   // merge means, add the room and teacher to the current lecture, remove the next (similar) lecture
//   // repeat until no more lectures
//   // lectures are sorted by day and time


//   const conjunctableRooms = [
//     { main: "D105", streamed: ["D0206", "D0207"] },
//     { main: "E112", streamed: ["E104", "E105"] },
//     ["N103", "N104", "N105"]
//   ]

//   // const anyConjunctable: string[] = conjunctableRooms.flatMap(room => Array.isArray(room) ? room : [room.main, ...room.streamed])
//   const anyConjunctable: string[][] = conjunctableRooms.map(room => Array.isArray(room) ? room : [room.main, ...room.streamed])

//   lectures.forEach((lecture, i) => {
//     if (i === lectures.length - 1) return // no more lectures to merge
//     const lectureRooms = lecture.room
//     // check if lecture is conjunctable
//     if (lectureRooms.some(room => anyConjunctable.some(conjunctable => conjunctable.includes(room)))) {
//       const savedLectures = [lecture]
//       // check next lectures one by one
//       for (let j = i + 1; j < lectures.length; j++) {
//         const nextLecture = lectures[j]
//         const nextLectureRooms = nextLecture.room
//         // if same day and time
//         if (nextLecture.day === lecture.day && nextLecture.start === lecture.start && nextLecture.end === lecture.end) {
//           // if lect.group is same but group is different aler me
//           // array1.length === array2.length && array1.every((value, index) => value === array2[index])
//           const compareArrays = (array1: any[], array2: any[]) => array1.length === array2.length && array1.every((value, index) => value === array2[index])
//           if ((compareArrays(lecture.lectureGroup, nextLecture.lectureGroup)) !== (lecture.groups == nextLecture.groups)) {
//             console.warn('Different groups from lecture groups', lecture, nextLecture)
//           }
//           // weeks dont have to be same, ex: 1. 2. 4. and 1. 2. 3. 4. => 1. 2. 3. 4. and there will probably be 3. lonely lecture with different teacher
//           const areWeeksSame = !!nextLecture.weeks.weeks && typeof lecture.weeks.weeks && typeof nextLecture.weeks.weeks === typeof lecture.weeks.weeks && (typeof nextLecture.weeks.weeks === "string" ? nextLecture.weeks.weeks === lecture.weeks.weeks : compareArrays(nextLecture.weeks.weeks, lecture.weeks.weeks as number[]))
//           if (areWeeksSame || nextLecture.weeks.parity === lecture.weeks.parity) {
//             // check if is next lecture is conjunctable and also at the same list as the current lecture
//             if (nextLectureRooms.some(room => anyConjunctable.some(conjunctable => conjunctable.includes(room) && lectureRooms.some(lectureRoom => conjunctable.includes(lectureRoom))))) {
//               // add lecture
//               console.log("pushing new lecture", i + j + 1)
//               savedLectures.push(nextLecture)
//               // remove next lecture
//               lectures.splice(j, 1)
//               // repeat
//               j--
//             }
//           }
//         } else {
//           // no more lectures to merge
//           break
//         }
//       }
//       // conjunct savedLectures
//       (lecture as unknown as CourseLecture).room = conjunctConjunctableRooms(savedLectures.flatMap(lecture => lecture.room))
//       lecture.info = savedLectures.map(lecture => lecture.info).join(', ')
//       lecture.note = savedLectures.map(lecture => lecture.note).join(', ')
//       // weeks are combined 1. 3., 2. => 1. 2. 3.
//       const conjunctedWeeks = savedLectures.every(lecture => typeof lecture.weeks.weeks === "string") ? savedLectures[0].weeks.weeks : uniq_fast(savedLectures.flatMap(lecture => lecture.weeks.weeks as number[]).sort((a, b) => a - b))
//       lecture.weeks = {
//         parity: lecture.weeks.parity,
//         weeks: conjunctedWeeks!
//       }
//       // if capacity is same, keep it, if not, join them
//       lecture.capacity = savedLectures.every(lecture => lecture.capacity === savedLectures[0].capacity) ? savedLectures[0].capacity : savedLectures.map(lecture => lecture.capacity).join(', ')
//     }
//   })
//   return lectures as unknown as CourseLecture[]
// }


{
  {
    uniq_fast([...[3, 9, 11, 13], ...[5, 7]]).length
  }
}