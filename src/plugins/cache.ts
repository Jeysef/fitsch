import type { NitroApp } from "nitropack/types";
import { createStorage, fsDriver, memoryDriver } from "vinxi/storage";

export default async function sdas(nitroApp: NitroApp) {
  globalThis.cachePlugin = {
    storage: createStorage({
      driver: import.meta.env.DEV ? await fsDriver({ base: ".nitro" }) : await memoryDriver(),
    }),
    captureError: nitroApp.captureError,
  };
}
