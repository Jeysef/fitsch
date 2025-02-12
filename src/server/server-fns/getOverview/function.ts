import { fromURL } from "cheerio";
import { StudyApi } from "~/server/scraper/api";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import type { DataProviderTypes } from "~/server/scraper/types";
import { OverviewDataProvider } from "~/server/server-fns/getOverview/OverviewDataProvider";

export const getStudyOverview = async (config: DataProviderTypes.getStudyOverviewConfig) => {
  "use server";
  console.log("fetching getStudyOverview");
  const language = config.language;
  const languageProvider = new LanguageProvider(language);
  const studyApi = new StudyApi(languageProvider, fromURL);
  const dataProvider = new OverviewDataProvider(studyApi, language);
  const data = await dataProvider.getStudyOverview(config);
  return data;
};
