import { defineCachedFunction as _defineCachedFunction, setStorage, type CachedFunction, type CacheOptions } from "ocache";
import { hash } from "ohash";
import type { StorageValue } from "unstorage";
import { useStorage } from "./storage";

interface CapturedErrorContext {
  tags?: string[];
}
const captureError = (error: unknown, errorCtx: CapturedErrorContext) => {
  console.error("[Captured Error]", error, "Context:", errorCtx);
};

let _storageReady = false;
function ensureStorage() {
  if (_storageReady) {
    return;
  }
  _storageReady = true;
  const storage = useStorage();
  setStorage({
    get: <T = unknown>(key: string) => storage.getItem<T>(key),
    set: <T = unknown>(key: string, value: T, opts?: { ttl?: number }) =>
      storage.setItem(key, value as StorageValue, opts?.ttl ? { ttl: opts.ttl } : undefined),
  });
}
function defaultOnError(error: unknown) {
  console.error("[cache]", error);
  captureError(error as Error, { tags: ["cache"] });
}
export function defineCachedFunction<T, ArgsT extends unknown[] = any[]>(
  fn: (...args: ArgsT) => T | Promise<T>,
  opts?: CacheOptions<T, ArgsT>
): CachedFunction<T, ArgsT> {
  ensureStorage();
  return _defineCachedFunction(fn, {
    group: "nitro/functions",
    onError: defaultOnError,
    ...opts,
  });
}

export function getKey(...args: unknown[]) {
  return args.length > 0 ? hash(args) : "";
}
