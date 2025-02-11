import type { Storage, StorageValue } from "vinxi/storage";
import { prefixStorage } from "vinxi/storage";

export function useStorage<T extends StorageValue = StorageValue>(base = ""): Storage<T> {
  return (base
    ? // @ts-ignore
      prefixStorage(globalThis.cachePlugin.storage, base)
    : // @ts-ignore
      globalThis.cachePlugin.storage) as unknown as Storage<T>;
}
