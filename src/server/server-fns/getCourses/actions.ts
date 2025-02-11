import { action, json } from "@solidjs/router";
import type { Jsonify } from "type-fest";
import type { StudyCoursesDetailsActionReturn } from "~/server/scraper/actionTypes";
import type { GetStudyCoursesDetailsFunctionConfig } from "~/server/scraper/types";
import { getStudyCoursesDetails } from "~/server/server-fns/getCourses/functions";

export const getStudyCoursesDetailsAction = action(async (config: GetStudyCoursesDetailsFunctionConfig) => {
  "use server";
  try {
    const data = await getStudyCoursesDetails(config);
    const serializedData: StudyCoursesDetailsActionReturn = JSON.parse(JSON.stringify(data)) as Jsonify<typeof data>;
    return json(serializedData);
  } catch (error) {
    // Return a serializable error object
    console.error("Error in getStudyCoursesDetails:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
  }
}, "getStudyCoursesDetailsAction");
