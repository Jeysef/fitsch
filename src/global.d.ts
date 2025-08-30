/// <reference types="@solidjs/start/env" />

import type { CachePluginData } from "~/plugins/cache.types";

declare global {
  var cachePlugin: CachePluginData;
}
