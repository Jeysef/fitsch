import type { NitroApp } from "nitropack/types";
import { createStorage, fsDriver, memoryDriver } from "vinxi/storage";
import netlifyBlobsDriver from "unstorage/drivers/netlify-blobs";

export default async function CachePlugin(nitroApp: NitroApp) {
  globalThis.cachePlugin = {
    storage: createStorage({
      driver: import.meta.env.DEV
        ? await fsDriver({ base: ".nitro" })  // File system driver for development
        : process.env.NETLIFY === "true"
          ? await netlifyBlobsDriver({ name: "fitsch-cache" }) // Netlify Blobs driver
          : await memoryDriver(), // Memory driver for other environments
    }),
    captureError: nitroApp.captureError,
  };
}
