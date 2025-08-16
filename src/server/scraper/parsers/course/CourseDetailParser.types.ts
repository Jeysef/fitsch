import type { CheerioAPI } from "cheerio";
import type { StudyApiTypes } from "~/server/scraper/types/api.types";
import type { SemesterTimeSchedule } from "~/server/scraper/types/timeSchedule.types";

export interface CourseDetailParserOptions {
  courseUrl: string;
  // TODO: remove
  semesterTimeSchedule: SemesterTimeSchedule;
  // TODO: remove
  courseId: string;
}

export interface CourseDetailParser {
  parse: ($: CheerioAPI, options: CourseDetailParserOptions) => StudyApiTypes.getStudyCourseDetailsReturn;
}
