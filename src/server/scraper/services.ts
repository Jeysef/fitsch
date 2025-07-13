import { fromURL } from "cheerio";
import { LanguageProvider } from "./languageProvider";
import type { FACULTY, LANGUAGE } from "~/enums";
import { HttpFetcher } from "./httpFetcher";
import { ApiFactory } from "./api/factory";
import { OverviewDataProvider } from "./dataProviders/overviewDataProvider";
import { CoursesDataProvider } from "./dataProviders/coursesDataProvider";

export async function createAppServices(config: { language: LANGUAGE; faculty: FACULTY }) {
  const languageProvider = await LanguageProvider.create(config.language);
  const langSet = languageProvider.languageSet;

  const httpFetcher = new HttpFetcher(fromURL);

  const apiFactory = new ApiFactory(httpFetcher, langSet);

  const studyApi = apiFactory.create(config.faculty, config.language);

  const overviewProvider = new OverviewDataProvider(studyApi);
  const coursesProvider = new CoursesDataProvider(studyApi);

  return { overviewProvider, coursesProvider };
}
