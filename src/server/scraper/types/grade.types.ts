import type { gradeAll } from "~/server/scraper/constants";

export type GradeKey = string | typeof gradeAll;

export interface GradeOverview {
  key: GradeKey;
  label: string;
}
