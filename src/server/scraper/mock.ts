import type { ResourceFetcher } from "solid-js";
import { DataProvider } from "~/server/scraper";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import { type DataProviderTypes, type StudyOverview, LANGUAGE } from "~/server/scraper/types";

export const getData: ResourceFetcher<true, StudyOverview, DataProviderTypes.getStudyOverviewConfig> = async (source, { value, refetching }) => {
  "use server";
  console.log("getting Data")
  const language = LANGUAGE.CZECH;

  const languageProvider = new LanguageProvider(language);
  const dataProvider = new DataProvider(languageProvider);
  // @ts-ignore
  const data = await dataProvider.getStudyOverview(refetching ?? undefined);
  return data
}