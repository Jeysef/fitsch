import type { CachePluginData } from "~/plugins/cache.types";

declare global {
  var cachePlugin: CachePluginData;
}
