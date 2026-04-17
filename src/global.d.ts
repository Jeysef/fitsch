/// <reference types="@solidjs/start/env" />

import type { BeforeInstallPromptEvent } from "~/types";

declare global {
  // PWA
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}
