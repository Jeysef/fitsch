"use server";
import { fromURL } from "cheerio";
import type { ResourceFetcher } from "solid-js";
import { DataProvider } from "~/server/scraper/dataProvider";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import type { DataProviderTypes, GetStudyCoursesDetailsFunctionConfig, StudyOverview } from "~/server/scraper/types";

export const getStudyOverview: ResourceFetcher<
  DataProviderTypes.getStudyOverviewConfig,
  StudyOverview,
  DataProviderTypes.getStudyOverviewConfig
> = async (source, { value, refetching }) => {
  "use server";
  // Fetch the data and return a value.
  //`source` tells you the current value of the source signal;
  //`value` tells you the last returned value of the fetcher;
  //`refetching` is true when the fetcher is triggered by calling `refetch()`,
  // or equal to the optional data passed: `refetch(info)`
  const val = typeof refetching === "boolean" ? source : { ...source, ...refetching };
  const languageProvider = new LanguageProvider(val.language);
  const dataProvider = new DataProvider(languageProvider, fromURL);
  const data = await errorResolver(dataProvider.getStudyOverview(val));
  return data;
};

export const getStudyCoursesDetails = (
  config: GetStudyCoursesDetailsFunctionConfig
): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> => {
  "use server";
  const { language, ...rest } = config;
  const languageProvider = new LanguageProvider(language);
  const dataProvider = new DataProvider(languageProvider, fromURL);
  const data = errorResolver(dataProvider.getStudyCoursesDetails(rest));
  console.log("🚀 ~ file: functions.ts:34 ~ data:", data);
  return data;
};

const errorResolver = <T>(promise: Promise<T>): Promise<T> => {
  return promise.catch((error) => {
    console.error("Error occurred:", error);
    throw error;
  });
};
