import type { NitroApp } from "nitropack/types";
import { createStorage, fsDriver, memoryDriver } from "vinxi/storage";
import type { CachePluginData } from "~/plugins/cache.types";

export default async function sdas(nitroApp: NitroApp) {
  (globalThis as unknown as { cache: CachePluginData }).cache = {
    storage: createStorage({
      driver: import.meta.env.DEV ? await fsDriver({ base: ".nitro" }) : await memoryDriver(),
    }),
    captureError: nitroApp.captureError,
  };
}
