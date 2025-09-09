import type { Jsonify } from "type-fest";

export function cloneDeepJSON<T>(obj: T): Jsonify<T> {
  return JSON.parse(JSON.stringify(obj)) as Jsonify<T>;
}
