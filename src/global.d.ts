/// <reference types="@solidjs/start/env" />

import type { CachePluginData } from "~/plugins/cache.types";
import type { BeforeInstallPromptEvent } from "~/types";

declare global {
  var cachePlugin: CachePluginData;

  // PWA
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}
