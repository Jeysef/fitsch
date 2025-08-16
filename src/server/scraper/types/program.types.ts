import type { SEMESTER } from "~/server/scraper/enums";
import type { CourseOverview } from "~/server/scraper/types/course.types";
import type { GradeKey } from "~/server/scraper/types/grade.types";
import type { url } from "~/server/scraper/types/types";

export interface ProgramOverviewBase {
  name: string;
  abbreviation: string;
  url: url; // @unique
}
export interface ProgramOverview extends ProgramOverviewBase {
  isEnglish: boolean;
  specializations: ProgramSpecializationOverview[];
}
export interface ProgramSpecializationOverview extends ProgramOverviewBase {}

export type ProgramCourses = Record<GradeKey, Record<SEMESTER, CourseOverview[]>>;

// either program without specialization or specialization
export interface Program {
  detail: ProgramOverviewBase;
  data: ProgramCourses;
}
