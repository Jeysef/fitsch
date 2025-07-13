import { FACULTY } from "~/enums";
import { createAppServices } from "~/server/scraper/services";
import type { DataProviderTypes } from "~/server/scraper/types";
import { isErrorReturn } from "~/server/server-fns/utils/errorHandeler";
import { defineCachedFunction, getKey } from "~/server/utils/cache";
import { useStorage } from "~/server/utils/storage";

const studyOverviewMaxCacheAge = 30 * 60; // 30 minutes
const studyOverviewMaxStaleCacheAge = 60 * 60 * 2; // 2 hours

export const getStudyOverview = defineCachedFunction(
  async (config: DataProviderTypes.getStudyOverviewConfig) => {
    "use server";
    const { overviewProvider } = await createAppServices({
      language: config.language,
      faculty: config.faculty ?? FACULTY.FIT,
    });

    const overview = await overviewProvider.getStudyOverview(config, config.language);
    return overview;
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
