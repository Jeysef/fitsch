import type { NitroApp } from "nitropack/types";
import { createStorage, fsDriver, } from "vinxi/storage";
import netlifyBlobsDriver from "unstorage/drivers/netlify-blobs";

export default async function CachePlugin(nitroApp: NitroApp) {
  globalThis.cachePlugin = {
    storage: createStorage({
      driver: import.meta.env.DEV ? await fsDriver({ base: ".nitro" }) : await netlifyBlobsDriver({
        name: "fitsch-cache",
      }),
    }),
    captureError: nitroApp.captureError,
  };
}
