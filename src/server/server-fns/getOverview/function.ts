import { StudyApi } from "~/server/scraper/api";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import type { DataProviderTypes } from "~/server/scraper/types";
import { OverviewDataProvider } from "~/server/server-fns/getOverview/OverviewDataProvider";
import { isErrorReturn } from "~/server/server-fns/utils/errorHandeler";
import { defineCachedFunction, getKey } from "~/server/utils/cache";
import { fromURL } from "~/server/utils/fetcher";
import { useStorage } from "~/server/utils/storage";

const studyOverviewMaxCacheAge = 30 * 60; // 30 minutes
const studyOverviewMaxStaleCacheAge = 60 * 60 * 2; // 2 hours

export const getStudyOverview = defineCachedFunction(
  async (config: DataProviderTypes.getStudyOverviewConfig) => {
    "use server";
    const language = config.language;
    const languageProvider = new LanguageProvider(language);
    const studyApi = new StudyApi(languageProvider, fromURL);
    const dataProvider = new OverviewDataProvider(studyApi, language);
    const data = await dataProvider.getStudyOverview(config);
    return data;
  },
  {
    maxAge: studyOverviewMaxCacheAge,
    staleMaxAge: studyOverviewMaxStaleCacheAge,
    swr: true,
    name: "getStudyOverview",
    transform: async (entry, ...args) => {
      if (isErrorReturn(entry.value)) {
        const key = getKey(...args);
        console.log("invaliding cache", key);
        const cacheKey = `/cache:nitro/functions:getStudyOverview:${key}.json`;
        await useStorage("cache").removeItem(cacheKey);
      }
    },
  }
);
