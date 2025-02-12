import type { ResourceFetcher } from "solid-js";
import type { DataProviderTypes } from "~/server/scraper/types";
import getOverview from "~/server/server-fns/getOverview";
import type { FunctionReturn } from "~/server/server-fns/utils/errorHandeler";

export const getStudyOverviewResource: ResourceFetcher<
  DataProviderTypes.getStudyOverviewConfig,
  FunctionReturn<DataProviderTypes.getStudyOverviewReturn>,
  DataProviderTypes.getStudyOverviewConfig
> = async (source, { value, refetching }) => {
  "use server";
  // Fetch the data and return a value.
  //`source` tells you the current value of the source signal;
  //`value` tells you the last returned value of the fetcher;
  //`refetching` is true when the fetcher is triggered by calling `refetch()`,
  // or equal to the optional data passed: `refetch(info)`
  const config = typeof refetching === "boolean" ? source : { ...source, ...refetching };
  return getOverview(config);
};
