import { getStudyOverview } from "~/server/server-fns/getOverview/function";

const getOverview: typeof getStudyOverview = async (...config) => {
  "use server";
  console.log("getOverview");
  return getStudyOverview(...config);
};

export default getOverview;
