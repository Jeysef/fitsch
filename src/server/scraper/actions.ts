import { action } from "@solidjs/router";
import type { ResourceFetcher } from "solid-js";
import { DataProvider } from "~/server/scraper";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import { mockData } from "~/server/scraper/mock";
import { LANGUAGE, type DataProviderTypes, type StudyOverview } from "~/server/scraper/types";

export const getStudyOverview: ResourceFetcher<true, StudyOverview, DataProviderTypes.getStudyOverviewConfig> = async (source, { value, refetching }) => {
  "use server";
  // console.log("getting Data")
  // const language = LANGUAGE.CZECH;

  // const languageProvider = new LanguageProvider(language);
  // const dataProvider = new DataProvider(languageProvider);
  // // @ts-ignore
  // const data = await dataProvider.getStudyOverview(refetching ?? undefined);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockData(typeof refetching === "boolean" ? undefined : refetching) as StudyOverview
}

export const getStudyProgramCourses = action(async (config: DataProviderTypes.getStudyCoursesDetailsConfig) => {
  const language = LANGUAGE.CZECH;

  const languageProvider = new LanguageProvider(language);
  const dataProvider = new DataProvider(languageProvider);
  const data = await dataProvider.getStudyCoursesDetails(config)
  console.log("🚀 ~ file: actions.ts:27 ~ submitData ~ data:", data)
  return data
}, "getStudyProgramCourses");