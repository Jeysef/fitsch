
"use server"
import type { ResourceFetcher } from "solid-js";
import { getStudyCoursesDetailsMock, getStudyOverviewMock } from "~/server/scraper/mock";
import { type DataProviderTypes, type StudyOverview } from "~/server/scraper/types";

export const getStudyOverview: ResourceFetcher<true, StudyOverview, DataProviderTypes.getStudyOverviewConfig> = async (source, { value, refetching }) => {
  "use server";
  // console.log("getting Data")
  // const language = LANGUAGE.CZECH;

  // const languageProvider = new LanguageProvider(language);
  // const dataProvider = new DataProvider(languageProvider, fromURL);
  // const data = await dataProvider.getStudyOverview(typeof refetching === "boolean" ? undefined : refetching);
  // return data
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return getStudyOverviewMock(typeof refetching === "boolean" ? undefined : refetching)
}

export const getStudyCoursesDetails = async (config: DataProviderTypes.getStudyCoursesDetailsConfig): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> => {
  "use server"
  // console.log("🚀 ~ file: functions.ts:23 ~ getStudyCoursesDetails ~ config:", config)

  // const language = LANGUAGE.CZECH;

  // const languageProvider = new LanguageProvider(language);
  // const dataProvider = new DataProvider(languageProvider, fromURL);
  // const data = await dataProvider.getStudyCoursesDetails(config)
  // return data
  return getStudyCoursesDetailsMock(config)
}