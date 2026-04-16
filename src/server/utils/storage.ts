import type { Storage, StorageValue } from "unstorage";
import { createStorage, prefixStorage } from "unstorage";
import nullDriver from "unstorage/drivers/null";

export function useStorage<T extends StorageValue = StorageValue>(base = ""): Storage<T> {
  if (!globalThis.cachePlugin) {
    // mocked storage
    console.warn("globalThis.cachePlugin is not defined");
    return createStorage({
      driver: nullDriver(),
    });
  }
  return (base
    ? prefixStorage(globalThis.cachePlugin.storage, base)
    : globalThis.cachePlugin.storage) as unknown as Storage<T>;
}
