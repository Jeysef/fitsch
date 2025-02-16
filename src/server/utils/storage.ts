import type { Storage, StorageValue } from "vinxi/storage";
import { createStorage, defineDriver, prefixStorage } from "vinxi/storage";

const DRIVER_NAME = "MOCK_MEMORY";
const memory = defineDriver(() => {
  return {
    name: DRIVER_NAME,
    hasItem: () => false,
    getItem: () => null,
    getItemRaw: () => null,
    setItem: () => undefined,
    setItemRaw: () => undefined,
    removeItem: () => undefined,
    getKeys: () => [],
    clear: () => undefined,
    dispose: () => undefined,
  };
});

export function useStorage<T extends StorageValue = StorageValue>(base = ""): Storage<T> {
  if (!globalThis.cachePlugin) {
    // mocked storage
    console.warn("globalThis.cachePlugin is not defined");
    return createStorage({
      driver: memory({}),
    });
  }
  return (base
    ? // @ts-ignore
      prefixStorage(globalThis.cachePlugin.storage, base)
    : // @ts-ignore
      globalThis.cachePlugin.storage) as unknown as Storage<T>;
}
