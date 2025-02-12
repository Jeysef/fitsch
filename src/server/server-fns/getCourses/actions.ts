import { action, json } from "@solidjs/router";
import type { Jsonify } from "type-fest";
import type { StudyCoursesDetailsActionReturn } from "~/server/scraper/actionTypes";
import type { GetStudyCoursesDetailsFunctionConfig } from "~/server/scraper/types";
import getCourses from "~/server/server-fns/getCourses";

export const getStudyCoursesDetailsAction = action(async (config: GetStudyCoursesDetailsFunctionConfig) => {
  "use server";
  const data = await getCourses(config);
  const serializedData: StudyCoursesDetailsActionReturn = JSON.parse(JSON.stringify(data)) as Jsonify<typeof data>;
  return json(serializedData);
}, "getStudyCoursesDetailsAction");
