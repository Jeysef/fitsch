import { action } from '@solidjs/router';
import { ObjectTyped } from 'object-typed';
import { StudyApi } from '~/server/scraper/api';
import { LanguageProvider } from '~/server/scraper/languageProvider';
import { DEGREE, LANGUAGE, SEMESTER, type StudyCourses, type StudyOverviewConfig, type StudyProgram, type StudyProgramBase, type StudySpecialization } from './types';


Object.values(SEMESTER),
  class Program {
    private readonly name: string;
    private readonly url: string;
    private readonly isEnglish: boolean | undefined;
    private readonly specializations: StudySpecialization[];
    private readonly attendanceType: string;
    private courses: StudyCourses | undefined;
    constructor(private readonly program: StudyProgram) {
      this.name = program.name;
      this.url = program.url;
      this.isEnglish = program.isEnglish;
      this.specializations = program.specializations;
      this.attendanceType = program.attendanceType;

    }

    addCourses(courses: StudyCourses) {
      this.courses = courses;
    }

    getData() {
      return {
        name: this.name,
        url: this.url,
        isEnglish: this.isEnglish,
        specializations: this.specializations,
        attendanceType: this.attendanceType,
        courses: this.courses
      }
    }
  }



export class DataProvider {
  readonly studyApi: StudyApi;
  constructor(private readonly languageProvider: LanguageProvider) {
    this.studyApi = new StudyApi(languageProvider)
  }

  async getStudyOverview(config: StudyOverviewConfig | null) {
    const { programs, years, currentYear } = await this.studyApi.getStudyPrograms(config)
    const defaultValues = {
      year: currentYear,
      semester: SEMESTER.WINTER,
      degree: DEGREE.BACHELOR,
      grade: programs[DEGREE.BACHELOR][0].name
    }
    const semesters = Object.values(SEMESTER)
    const degrees = Object.values(DEGREE)
    const grades: Record<DEGREE, StudyProgramBase[]> = ObjectTyped.fromEntries(ObjectTyped.entries(programs).map(([degree, programs]) => {
      return [degree, programs.flatMap(program => program.specializations.length ? program.specializations : program)];
    }));
    const courses = ObjectTyped.fromEntries(ObjectTyped.entries(programs).map(([degree, programs]) => {
      return [degree, programs.flatMap(program => program.specializations.length ? program.specializations : program)];
    }));
    // const grades = ObjectTyped.fromEntries(programs[defaultValues.degree].map(p => {
    //   if (p.specializations.length) {
    //     return [p.name, p.specializations.map(s => s)]
    //   }
    //   return [p, p]
    // }))

    // const overview: StudyOverview = {
    //   values: defaultValues,
    //   data: {
    //     years,
    //     semesters: Object.values(SEMESTER),
    //     degrees: Object.values(DEGREE),
    //     grades: programs[defaultValues.degree].map(program => program.name),
    //     // courses: ObjectTyped.fromEntries(programs[defaultValues.degree].map(program => program.name).map((name) => [name, []]))
    //   }
    // }
  }
};
// const programsWithCourses = await Promise.all(ObjectTyped.values(programs).map(async programs => await Promise.all(programs.map(async program => {
//   if (program.specializations.length) {
//     return {
//       ...program, specializations: await Promise.all(program.specializations.map(async specialization => {
//         return { ...specialization, courses: await this.studyApi.getStudyProgramCourses(specialization.url) }
//       }))
//     }
//   }
//   return { ...program, courses: await this.studyApi.getStudyProgramCourses(program.url) }
// }))))


async function example() {

  const language = LANGUAGE.CZECH;

  const languageProvider = new LanguageProvider(language);
  const dataProvider = new DataProvider(languageProvider);
  // dataProvider.studyApi.getTimeSchedule()

  // dataProvider.getCoursesDetails(["281068", "281030"])

}

export const getScheduleDataAction = action(async (data: string) => console.log("action Data", data));


