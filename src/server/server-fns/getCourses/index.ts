import { isServer } from "solid-js/web";
import { getStudyCoursesDetails } from "~/server/server-fns/getCourses/functions";

const getCourses: typeof getStudyCoursesDetails = async (...config) => {
  "use server";
  console.log("getCourses", isServer);
  return getStudyCoursesDetails(...config);
};

export default getCourses;
