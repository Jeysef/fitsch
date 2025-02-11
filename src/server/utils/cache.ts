import type { CacheEntry, CacheOptions, NitroAsyncContext } from "nitropack/types";
import { hash } from "ohash";
import { isEvent } from "vinxi/server";
import type { TransactionOptions } from "vinxi/storage";
import type { CachePluginData } from "~/plugins/cache.types";
import { useStorage } from "./storage";

type H3Event = NitroAsyncContext["event"];

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1,
  } as const;
}

type ResolvedCacheEntry<T> = CacheEntry<T> & { value: T };

export function defineCachedFunction<T, ArgsT extends unknown[] = any[]>(
  fn: (...args: ArgsT) => T | Promise<T>,
  opts: CacheOptions<T, ArgsT> = {}
): (...args: ArgsT) => Promise<T> {
  opts = { ...defaultCacheOptions(), ...opts };

  const pending: { [key: string]: Promise<T> } = {};

  // Normalize cache params
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== undefined);

  async function get(
    key: string,
    resolver: () => T | Promise<T>,
    shouldInvalidateCache?: boolean,
    event?: H3Event
  ): Promise<ResolvedCacheEntry<T>> {
    // Use extension for key to avoid conflicting with parent namespace (foo/bar and foo/bar/baz)
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");

    let entry: CacheEntry<T> =
      ((await useStorage()
        .getItem(cacheKey)
        .catch((error) => {
          console.error(`[nitro] [cache] Cache read error.`, error);
          (globalThis as unknown as { cache: CachePluginData }).cache.captureError(error, { event, tags: ["cache"] });
        })) as unknown) || {};

    // https://github.com/nitrojs/nitro/issues/2160
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[nitro] [cache]", error);
      (globalThis as unknown as { cache: CachePluginData }).cache.captureError(error, { event, tags: ["cache"] });
    }

    const ttl = (opts.maxAge ?? 0) * 1000;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }

    const expired =
      shouldInvalidateCache ||
      entry.integrity !== integrity ||
      (ttl && Date.now() - (entry.mtime || 0) > ttl) ||
      validate(entry) === false;

    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== undefined && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          // Remove cached entry to prevent using expired cache on concurrent requests
          entry.value = undefined;
          entry.integrity = undefined;
          entry.mtime = undefined;
          entry.expires = undefined;
        }
        pending[key] = Promise.resolve(resolver());
      }

      try {
        entry.value = await pending[key];
      } catch (error) {
        // Make sure entries that reject get removed.
        if (!isPending) {
          delete pending[key];
        }
        // Re-throw error to make sure the caller knows the task failed.
        throw error;
      }

      if (!isPending) {
        // Update mtime, integrity + validate and set the value in cache only the first time the request is made.
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts: TransactionOptions | undefined;
          if (opts.maxAge && !opts.swr /* TODO: respect staleMaxAge */) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage()
            .setItem(cacheKey, entry, setOpts)
            .catch((error) => {
              console.error(`[nitro] [cache] Cache write error.`, error);
              (globalThis as unknown as { cache: CachePluginData }).cache.captureError(error, { event, tags: ["cache"] });
            });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };

    const _resolvePromise = expired ? _resolve() : Promise.resolve();

    if (entry.value === undefined) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }

    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        (globalThis as unknown as { cache: CachePluginData }).cache.captureError(error, { event, tags: ["cache"] });
      });
      return entry as ResolvedCacheEntry<T>;
    }

    return _resolvePromise.then(() => entry) as Promise<ResolvedCacheEntry<T>>;
  }

  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : undefined
    );
    let value = entry.value;
    if (opts.transform) {
      value = (await opts.transform(entry, ...args)) || value;
    }
    return value;
  };
}

export function cachedFunction<T, ArgsT extends unknown[] = any[]>(
  fn: (...args: ArgsT) => T | Promise<T>,
  opts: CacheOptions<T> = {}
): (...args: ArgsT) => Promise<T | undefined> {
  return defineCachedFunction(fn, opts);
}

function getKey(...args: unknown[]) {
  return args.length > 0 ? hash(args, {}) : "";
}
