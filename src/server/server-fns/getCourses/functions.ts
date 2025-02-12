import { fromURL } from "cheerio";
import { StudyApi } from "~/server/scraper/api";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import type { DataProviderTypes, GetStudyCoursesDetailsFunctionConfig } from "~/server/scraper/types";
import { CoursesDataProvider } from "~/server/server-fns/getCourses/coursesDataProvider";

export function getStudyCoursesDetails(
  config: GetStudyCoursesDetailsFunctionConfig
): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
  "use server";
  const { language, ...rest } = config;
  const languageProvider = new LanguageProvider(language);
  const studyApi = new StudyApi(languageProvider, fromURL);
  const dataProvider = new CoursesDataProvider(studyApi);
  const data = dataProvider.getStudyCoursesDetails(rest).then((d) => {
    const staleCoursesData = config.staleCoursesId?.map((id) => ({ detail: { id }, isStale: true }) as const);
    return d.concat(staleCoursesData ?? []);
  });

  return data;
}
