"use server";
import { fromURL } from "cheerio";
import type { ResourceFetcher } from "solid-js";
import { DataProvider } from "~/server/scraper/dataProvider";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import type {
  DataProviderTypes,
  FunctionReturn,
  FunctionReturnError,
  GetStudyCoursesDetailsFunctionConfig,
} from "~/server/scraper/types";
import { defineCachedFunction } from "~/server/utils/cache";

const cacheMaxAge = 30 * 60;
const cacheMaxAgeStale = 60 * 60;

export const getStudyOverview: ResourceFetcher<
  DataProviderTypes.getStudyOverviewConfig,
  FunctionReturn<DataProviderTypes.getStudyOverviewReturn>,
  DataProviderTypes.getStudyOverviewConfig
> = defineCachedFunction(
  async (source, { value, refetching }) => {
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
  },
  { maxAge: cacheMaxAge, name: "getStudyOverview", swr: false, staleMaxAge: cacheMaxAgeStale }
);

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
