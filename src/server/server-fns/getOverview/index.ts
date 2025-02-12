import { getStudyOverview } from "~/server/server-fns/getOverview/function";
import withErrorHandeler from "~/server/server-fns/utils/errorHandeler";

const getOverview = async (...config: Parameters<typeof getStudyOverview>) => {
  "use server";
  console.log("getOverview");
  return withErrorHandeler(getStudyOverview(...config));
};

export default getOverview;
