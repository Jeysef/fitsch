import type { FACULTY, LANGUAGE } from "~/enums";
import type { DataProviderTypes } from "~/server/scraper/types/data.types";

export interface GetStudyCoursesDetailsFunctionConfig extends DataProviderTypes.getStudyCoursesDetailsConfig {
  language: LANGUAGE;
  faculty: FACULTY;
}
