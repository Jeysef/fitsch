import type { CacheOptions } from "nitropack/types";
export declare function defineCachedFunction<T, ArgsT extends unknown[] = any[]>(
  fn: (...args: ArgsT) => T | Promise<T>,
  opts?: CacheOptions<T, ArgsT>
): (...args: ArgsT) => Promise<T>;
export declare function cachedFunction<T, ArgsT extends unknown[] = any[]>(
  fn: (...args: ArgsT) => T | Promise<T>,
  opts?: CacheOptions<T>
): (...args: ArgsT) => Promise<T | undefined>;
