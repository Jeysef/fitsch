import type { fromURL } from 'cheerio';
import { ObjectTyped } from 'object-typed';
import { StudyApi } from '~/server/scraper/api';
import { LanguageProvider } from '~/server/scraper/languageProvider';
import { constructGradeLabel } from '~/server/scraper/utils';
import { DEGREE, LANGUAGE, SEMESTER } from "./enums";
import { type CourseLecture, type DataProviderTypes, type StudyOverview, type StudyOverviewCourse, type StudyOverviewGrade, type StudyProgram, type StudyPrograms } from './types';


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

    console.log("values.degree", values.degree)
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

  public async getStudyCourseDetails(config: DataProviderTypes.getStudyCourseDetailsConfig): Promise<DataProviderTypes.getStudyCourseDetailsReturn> {
    const { courseId } = config
    const data = await this.studyApi.getStudyCourseDetails({ courseId })
    return data

  }

  public async getStudyCoursesDetails(config: DataProviderTypes.getStudyCoursesDetailsConfig): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
    const { courses } = config
    return Promise.all(courses.map(course => this.studyApi.getStudyCourseDetails({ courseId: course.courseId })))
  }
};

function coonjunctLectures(lectures: CourseLecture[]): CourseLecture[] {
  // go through all lectures.
  // check the next (right) lecture, if same day and time, merge them
  // if not, end search from current lecture, move to next
  // merge means, add the room and teacher to the current lecture, remove the next (similar) lecture
  // repeat until no more lectures
  // lectures are sorted by day and time

  lectures.forEach((lecture, i) => {
    const lectureRooms = lecture.room.split(' ')
    // check next lectures one by one
    for (let j = i + 1; j < lectures.length; j++) {
      const nextLecture = lectures[j]
      // if same day and time
      if (nextLecture.day === lecture.day && nextLecture.start === lecture.start && nextLecture.end === lecture.end) {
        if (nextLecture.weeks === lecture.weeks || nextLecture.lectureGroup === lecture.lectureGroup || nextLecture.weeks.length === 1) {

          // merge them
          lecture.room = `${lecture.room}, ${nextLecture.room}`
          lecture.info = `${lecture.info}, ${nextLecture.info}`
          // remove next lecture
          lectures.splice(j, 1)
          // repeat
          j--
        }
        // else {
        //   // no more lectures to merge
        //   break
        // }
      } else {
        // no more lectures to merge
        break
      }
    }
  })
  return lectures
}