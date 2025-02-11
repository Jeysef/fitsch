import { fromURL } from "cheerio";
import { DataProvider } from "~/server/scraper/dataProvider";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import type {
  DataProviderTypes,
  FunctionReturn,
  FunctionReturnError,
  GetStudyCoursesDetailsFunctionConfig,
} from "~/server/scraper/types";

export const getStudyCoursesDetails = (
  config: GetStudyCoursesDetailsFunctionConfig
): Promise<FunctionReturn<DataProviderTypes.getStudyCoursesDetailsReturn>> => {
  "use server";
  const { language, ...rest } = config;
  const languageProvider = new LanguageProvider(language);
  const dataProvider = new DataProvider(languageProvider, fromURL);
  const data = errorResolver(
    dataProvider.getStudyCoursesDetails(rest).then((d) => {
      const staleCoursesData = config.staleCoursesId?.map((id) => ({ detail: { id }, isStale: true }) as const);
      return d.concat(staleCoursesData ?? []);
    })
  );
  return data;
};

const errorResolver = <T>(promise: Promise<T>): Promise<FunctionReturn<T>> => {
  return Promise.race([
    promise,
    new Promise<FunctionReturn<T>>((_, reject) =>
      // netlify allows 10 seconds for a function to run
      setTimeout(() => reject(new Error("Request timeout after 9 seconds")), 9800)
    ),
  ]).catch((error) => {
    console.error("Error occurred:", error);
    return { error: true, errorMessage: error.message } satisfies FunctionReturnError;
  });
};
