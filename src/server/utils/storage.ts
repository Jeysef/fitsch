import { createStorage, prefixStorage, type Storage, type StorageValue } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";
import memoryDriver from "unstorage/drivers/memory";
import netlifyBlobsDriver from "unstorage/drivers/netlify-blobs";
export function initStorage() {
  return createStorage({
    driver: import.meta.env.DEV
      ? fsLiteDriver({ base: ".nitro" })
      : process.env.NETLIFY === "true"
        ? netlifyBlobsDriver({ name: "fitsch-cache" })
        : memoryDriver(),
  });
}
export function useStorage<T extends StorageValue = StorageValue>(base = ""): Storage<T> {
  // @ts-expect-error iplementation taken from nitro
  const storage = (useStorage._storage ??= initStorage());
  return base ? prefixStorage(storage, base) : storage;
}
