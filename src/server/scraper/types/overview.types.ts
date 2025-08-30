import type { FACULTY, LANGUAGE } from "~/enums";
import type { DEGREE, SEMESTER } from "~/enums/enums";
import type { GradeOverview } from "~/server/scraper/types/grade.types";
import type { ProgramCourses, ProgramOverview } from "~/server/scraper/types/program.types";
import type { url } from "~/server/scraper/types/types";
import type { OverviewYear } from "~/server/scraper/types/year.types";

export type OverviewPrograms = Record<DEGREE, ProgramOverview[]>;

export interface Overview {
  current: OverviewCurrent;
  data: OverviewData;
}

export interface OverviewData {
  years: OverviewYear[];
  degrees: DEGREE[];
  programs: OverviewPrograms;
  grades: GradeOverview[] | null;
  semesters: SEMESTER[];
  /**
   * Courses for selected program (if any)
   * grade > semester > courses
   * because pages are structured like this
   */
  courses: ProgramCourses | null;
}

export interface OverviewCurrent {
  year: OverviewYear;
  language: LANGUAGE;
  faculty: FACULTY;
  degree?: DEGREE | undefined;
  program?: url | undefined;
}
export interface OverviewPayload {
  year: string;
  language: LANGUAGE;
  faculty: FACULTY;
  degree?: DEGREE | undefined;
  program?: url | undefined;
}
