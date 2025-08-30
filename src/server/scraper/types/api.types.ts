import type { DEGREE, SEMESTER } from "~/enums/enums";
import type { Program } from "~/server/scraper/types/program.types";
import type { SemestersTimeSchedule, SemesterTimeSchedule } from "~/server/scraper/types/timeSchedule.types";
import type { Course, OverviewPrograms, year } from "~/server/scraper/types/types";
import type { OverviewYear } from "~/server/scraper/types/year.types";

export namespace StudyApiTypes {
  export interface getStudyProgramsConfig {
    year?: year | undefined;
    degree?: DEGREE | undefined;
  }
  export interface getStudyProgramsReturn {
    programs: OverviewPrograms;
    years: OverviewYear[];
    currentYear: OverviewYear;
  }

  export interface getStudyCourseDetailsConfig {
    courseId: string;
    semesterTimeSchedule: SemesterTimeSchedule;
  }
  export interface getStudyCourseDetailsReturn extends Course {}

  export interface getStudyCoursesDetailsConfig {
    courseIds: string[];
    year: year;
    semester: SEMESTER;
  }
  export interface getStudyCoursesDetailsReturn {
    semesterTimeSchedule: SemesterTimeSchedule;
    data: getStudyCourseDetailsReturn[];
  }

  export interface getStudyTimeScheduleConfig {
    year: string | null;
  }
  export type getStudyTimeScheduleReturn = SemestersTimeSchedule;

  export interface getStudyProgramCoursesConfig {
    programUrl: string;
  }
  export type getStudyProgramCoursesReturn = Program;
}
