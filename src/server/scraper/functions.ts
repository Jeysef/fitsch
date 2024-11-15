
"use server"
import { fromURL } from "cheerio";
import type { ResourceFetcher } from "solid-js";
import { DataProvider } from "~/server/scraper/dataProvider";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import { type DataProviderTypes, type StudyOverview } from "~/server/scraper/types";

export const getStudyOverview: ResourceFetcher<DataProviderTypes.getStudyOverviewConfig, StudyOverview, DataProviderTypes.getStudyOverviewConfig> = async (source, { value, refetching }) => {
  "use server";
  // Fetch the data and return a value.
  //`source` tells you the current value of the source signal;
  //`value` tells you the last returned value of the fetcher;
  //`refetching` is true when the fetcher is triggered by calling `refetch()`,
  // or equal to the optional data passed: `refetch(info)`
  const val = typeof refetching === "boolean" ? source : { ...source, ...refetching }
  const languageProvider = new LanguageProvider(val.language);
  const dataProvider = new DataProvider(languageProvider, fromURL);
  const data = await dataProvider.getStudyOverview(val);
  return data;

}

export const getStudyCoursesDetails = async (config: DataProviderTypes.getStudyCoursesDetailsConfig): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> => {
  "use server";
  const languageProvider = new LanguageProvider(config.language);
  const dataProvider = new DataProvider(languageProvider, fromURL);
  const data = await dataProvider.getStudyCoursesDetails(config)
  return data
}