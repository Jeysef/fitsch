import { action } from "@solidjs/router";
import { getStudyCoursesDetails } from "~/server/scraper/functions";
import type { DataProviderTypes } from "~/server/scraper/types";

export const getStudyCoursesDetailsAction = action(async (config: DataProviderTypes.getStudyCoursesDetailsConfig) => {
  "use server";
  return getStudyCoursesDetails(config)
})