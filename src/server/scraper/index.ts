import { ObjectTyped } from 'object-typed';
import { StudyApi } from '~/server/scraper/api';
import { LanguageProvider } from '~/server/scraper/languageProvider';
import { constructGradeLabel } from '~/server/scraper/utils';
import { DEGREE, SEMESTER, type DataProviderTypes, type StudyOverview, type StudyOverviewCourse, type StudyOverviewGrade, type StudyProgram, type StudyPrograms, type StudyProgramWithUrl } from './types';


export class DataProvider {
  readonly studyApi: StudyApi;
  constructor(private readonly languageProvider: LanguageProvider) {
    this.studyApi = new StudyApi(languageProvider)
  }

  async getStudyOverview(config?: DataProviderTypes.getStudyOverviewConfig): Promise<StudyOverview> {
    const { programs: studyPrograms, years, currentYear } = await this.studyApi.getStudyPrograms(config)
    const values: StudyOverview["values"] = {
      year: config ? years.find(year => year.value === config.year) ?? currentYear : currentYear,
      degree: (config && config.degree) ?? DEGREE.BACHELOR,
    }
    let degreePrograms = studyPrograms[values.degree]
    // filter language
    const filterLanguage = (program: StudyPrograms[DEGREE]) => ObjectTyped.fromEntries(Object.entries(program).filter(([pid, studyProgram]) => studyProgram.isEnglish === config?.isEnglish ?? false).map(([id, program]) => ([id, program] as const)))

    degreePrograms = filterLanguage(degreePrograms)
    values["program"] = config?.programId ? Object.values(degreePrograms).flatMap(program => [program, ...program.specializations]).find(programOrSpecialization => programOrSpecialization.id === config.programId) : Object.values(degreePrograms).length === 1 ? Object.values(degreePrograms)[0] : undefined
    const programs: Record<DEGREE, StudyProgramWithUrl[]> = ObjectTyped.fromEntries(ObjectTyped.entries(studyPrograms).map(([degree, programs]) => ([degree, Object.values(filterLanguage(programs)).flatMap(program => [program, ...program.specializations])] as const)))

    let degreeProgram: StudyProgram | undefined = undefined
    degreeProgram = degreePrograms[values.degree]
    if (!degreeProgram) degreeProgram = Object.values(degreePrograms)[0]

    const programData = await this.studyApi.getStudyProgramCourses({ programUrl: degreeProgram.url });

    const grades = Object.entries(programData).map(([grade, data]) => ({ key: grade, label: constructGradeLabel(grade, data.abbreviation) } as StudyOverviewGrade))
    const degrees = Object.values(DEGREE);
    const semesters = Object.values(SEMESTER);

    const courses = ObjectTyped.fromEntries(ObjectTyped.entries(programData).map(([grade, gradeData]) => ([
      grade,
      ObjectTyped.fromEntries(semesters.map(semester => ([
        semester,
        gradeData![semester].reduce((acc, course) => {
          const { name, abbreviation, id } = course;
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
};

