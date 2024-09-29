import { action } from '@solidjs/router';
import { ObjectTyped } from 'object-typed';
import { StudyApi } from '~/server/scraper/api';
import { LanguageProvider } from '~/server/scraper/languageProvider';
import { DEGREE, LANGUAGE, SEMESTER, type StudyCourses, type StudyOverview, type StudyOverviewConfig, type StudyOverviewCourse, type StudyOverviewGrade, type StudyProgram, type StudySpecialization } from './types';


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

  // async getStudyOverview(config: StudyOverviewConfig | null): StudyOverview {
  //   const { programs, years, currentYear } = await this.studyApi.getStudyPrograms(config)
  //   const defaultValues = {
  //     year: currentYear,
  //     semester: SEMESTER.WINTER,
  //     degree: DEGREE.BACHELOR,
  //     grade: programs[DEGREE.BACHELOR][0].name
  //   }
  //   const semesters = Object.values(SEMESTER)
  //   const degrees = Object.values(DEGREE)
  //   const grades: Record<DEGREE, StudyProgramBase[]> = ObjectTyped.fromEntries(ObjectTyped.entries(programs).map(([degree, programs]) => {
  //     return [degree, programs.flatMap(program => program.specializations.length ? program.specializations : program)];
  //   }));
  //   const courses = ObjectTyped.fromEntries(ObjectTyped.entries(programs).map(([degree, programs]) => {
  //     return [degree, programs.flatMap(program => program.specializations.length ? program.specializations : program)];
  //   }));
  //   // const grades = ObjectTyped.fromEntries(programs[defaultValues.degree].map(p => {
  //   //   if (p.specializations.length) {
  //   //     return [p.name, p.specializations.map(s => s)]
  //   //   }
  //   //   return [p, p]
  //   // }))

  //   // const overview: StudyOverview = {
  //   //   values: defaultValues,
  //   //   data: {
  //   //     years,
  //   //     semesters: Object.values(SEMESTER),
  //   //     degrees: Object.values(DEGREE),
  //   //     grades: programs[defaultValues.degree].map(program => program.name),
  //   //     // courses: ObjectTyped.fromEntries(programs[defaultValues.degree].map(program => program.name).map((name) => [name, []]))
  //   //   }
  //   // }
  // }

  async getStudyOverview(config: StudyOverviewConfig | null): Promise<StudyOverview> {
    const { programs: studyPrograms, years, currentYear } = await this.studyApi.getStudyPrograms(config)
    const defaultValues = {
      year: currentYear,
      semester: SEMESTER.WINTER,
      degree: DEGREE.BACHELOR,
      grade: studyPrograms[DEGREE.BACHELOR][0].name
    }
    const defaultProgram = studyPrograms[defaultValues.degree][0]
    const programData = await this.studyApi.getStudyProgramCourses(defaultProgram.url);

    const grades: StudyOverviewGrade[] = ObjectTyped.entries(programData).map(([grade, data]) => ({ label: grade, name: data!.name } as StudyOverviewGrade))
    const degrees = Object.values(DEGREE);
    const semesters = Object.values(SEMESTER);

    const courses = ObjectTyped.fromEntries(ObjectTyped.entries(programData).map(([grade, gradeData]) => ([
      grade,
      ObjectTyped.fromEntries(semesters.map(semester => ([
        semester,
        // ObjectTyped.fromEntries(gradeData![semester].map(course => {
        //   const { title: name, abbreviation, id } = course;
        //   return [course.obligation ? 'compulsory' : 'optional', { name, abbreviation, id } as StudyOverviewCourse]
        // }))
        // {
        //   compulsory: gradeData![semester].filter(course => course.obligation).map(course => ({ name: course.title, abbreviation: course.abbreviation, id: course.id } as StudyOverviewCourse)),
        //   optional: gradeData![semester].filter(course => !course.obligation).map(course => ({ name: course.title, abbreviation: course.abbreviation, id: course.id } as StudyOverviewCourse))
        // }
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



    // const grades: Grade[] = ['ALL', ...degrees.flatMap(degree =>
    //   Array.from({ length: degree === DEGREE.DOCTORAL ? 4 : 3 }, (_, i) => `${i + 1}${degree.charAt(0)}` as GradeWithoutAll)
    // )];

    // const courses: StudyOverview['data']['courses'] = {};

    // degrees.forEach(degree => {
    //   studyPrograms[degree].forEach(program => {
    //     const gradeNumber = degree === DEGREE.DOCTORAL ? 4 : 3;
    //     for (let i = 1; i <= gradeNumber; i++) {
    //       const grade = `${i}${degree.charAt(0)}` as GradeWithoutAll;
    //       if (!courses[grade]) {
    //         courses[grade] = {
    //           [SEMESTER.WINTER]: { compulsory: [], optional: [] },
    //           [SEMESTER.SUMMER]: { compulsory: [], optional: [] }
    //         };
    //       }

    //       semesters.forEach(semester => {
    //         const course: StudyOverviewCourse = {
    //           name: program.name,
    //           abbreviation: program.abbreviation,
    //           id: `${program.abbreviation}_${grade}_${semester}`
    //         };
    //         courses[grade][semester].compulsory.push(course);
    //       });
    //     }
    //   });
    // });

    // // Add ALL grade
    // courses.ALL = {
    //   [SEMESTER.WINTER]: { compulsory: [], optional: [] },
    //   [SEMESTER.SUMMER]: { compulsory: [], optional: [] }
    // };

    // Object.values(courses).forEach(gradeCourses => {
    //   semesters.forEach(semester => {
    //     courses.ALL![semester].compulsory.push(...gradeCourses[semester].compulsory);
    //     courses.ALL![semester].optional.push(...gradeCourses[semester].optional);
    //   });
    // });

    return {
      values: {
        year: currentYear,
        semester: SEMESTER.WINTER,
        degree: DEGREE.BACHELOR,
        grade: '1BIT'
      },
      data: {
        years,
        semesters,
        degrees,
        grades,
        courses
      }
    };
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


