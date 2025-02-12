import { isServer } from "solid-js/web";
import { getStudyCoursesDetails } from "~/server/server-fns/getCourses/functions";
import withErrorHandeler from "~/server/server-fns/utils/errorHandeler";

const getCourses = async (...config: Parameters<typeof getStudyCoursesDetails>) => {
  "use server";
  console.log("getCourses", isServer);
  return withErrorHandeler(getStudyCoursesDetails(...config));
};

export default getCourses;
