import { ObjectTyped } from 'object-typed';
import { StudyApi } from '~/server/scraper/api';
import { LanguageProvider } from '~/server/scraper/languageProvider';
import { constructGradeLabel } from '~/server/scraper/utils';
import { DEGREE, LANGUAGE, SEMESTER } from "./enums";
import { type DataProviderTypes, type StudyOverview, type StudyOverviewCourse, type StudyOverviewGrade, type StudyProgram, type StudyPrograms } from './types';


export class DataProvider {
  readonly studyApi: StudyApi;
  constructor(private readonly languageProvider: LanguageProvider) {
    this.studyApi = new StudyApi(languageProvider)
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

    const courses = ObjectTyped.fromEntries(ObjectTyped.entries(programData).map(([grade, gradeData]) => ([
      grade,
      ObjectTyped.fromEntries(semesters.map(semester => ([
        semester,
        gradeData![semester].reduce((acc, course) => {
          const { name, abbreviation, id, url } = course;
          return {
            ...acc,
            [course.obligation ? 'compulsory' : 'optional']: [...acc[course.obligation ? 'compulsory' : 'optional'], { name, abbreviation, id } as StudyOverviewCourse]
          }
        }, { compulsory: [], optional: [] } as Record<"compulsory" | "optional", StudyOverviewCourse[]>)
      ] as const
      )))
    ] as [string, Record<SEMESTER, Record<"compulsory" | "optional", StudyOverviewCourse[]>>]
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

