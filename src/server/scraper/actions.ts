import { action, json } from "@solidjs/router";
import { getStudyCoursesDetails } from "~/server/scraper/functions";
import type { GetStudyCoursesDetailsFunctionConfig } from "~/server/scraper/types";

export const getStudyCoursesDetailsAction = action(async (config: GetStudyCoursesDetailsFunctionConfig) => {
  "use server";
  try {
    const serializedData = JSON.parse(JSON.stringify(await getStudyCoursesDetails(config)));
    return json(serializedData);
  } catch (error) {
    // Return a serializable error object
    console.error("Error in getStudyCoursesDetails:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
  }
}, "getStudyCoursesDetailsAction");
