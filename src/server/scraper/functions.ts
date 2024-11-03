
"use server"
import { fromURL } from "cheerio";
import type { ResourceFetcher } from "solid-js";
import { DataProvider } from "~/server/scraper/dataProvider";
import { LANGUAGE, type DEGREE } from "~/server/scraper/enums";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import { getStudyCoursesDetailsMock } from "~/server/scraper/mock";
import { type DataProviderTypes, type StudyOverview } from "~/server/scraper/types";

export const getStudyOverview: ResourceFetcher<{
  year: string | undefined;
  degree: DEGREE | undefined;
  program: string | undefined;
}, StudyOverview, DataProviderTypes.getStudyOverviewConfig> = async (source, { value, refetching }) => {
  "use server";
  const language = LANGUAGE.CZECH;

  const languageProvider = new LanguageProvider(language);
  const dataProvider = new DataProvider(languageProvider, fromURL);
  const val = value ? typeof refetching === "boolean" ? undefined : refetching : source
  const data = await dataProvider.getStudyOverview(val);
  return data
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // return getStudyOverviewMock(typeof refetching === "boolean" ? undefined : refetching)
}

export const getStudyCoursesDetails = async (config: DataProviderTypes.getStudyCoursesDetailsConfig): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> => {
  "use server"
  // console.log("🚀 ~ file: functions.ts:23 ~ getStudyCoursesDetails ~ config:", config)

  const language = LANGUAGE.CZECH;

  const languageProvider = new LanguageProvider(language);
  const dataProvider = new DataProvider(languageProvider, fromURL);
  const data = await dataProvider.getStudyCoursesDetails(config)
  return data
  return getStudyCoursesDetailsMock(config)


}