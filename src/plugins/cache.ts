import type { NitroApp } from "nitropack/types";
import fsLiteDriver from "unstorage/drivers/fs-lite";
import netlifyBlobsDriver from "unstorage/drivers/netlify-blobs";
import { createStorage } from "vinxi/storage";

export default function CachePlugin(nitroApp: NitroApp) {
  globalThis.cachePlugin = {
    storage: createStorage({
      driver: import.meta.env.DEV
        ? fsLiteDriver({ base: ".nitro" }) // File system driver for development
        : // ? nullDriver()
          process.env.NETLIFY === "true"
          ? netlifyBlobsDriver({ name: "fitsch-cache" }) // Netlify Blobs driver
          : undefined, // Memory driver for other environments
    }),
    captureError: nitroApp.captureError,
  };
}
