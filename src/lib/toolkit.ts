/**
 * Recursively restores undefined values that were lost during JSON serialization.
 * - Adds back object keys with `undefined` values.
 * - Converts `null` back to `undefined` in arrays if the source had `undefined`.
 * @param source The original object (can be a proxy).
 * @param target The object cloned via JSON.parse(JSON.stringify()).
 */
function restoreUndefineds(source: any, target: any) {
  // If source is not an object or is null, there's nothing to restore.
  if (source === null || typeof source !== "object") {
    return;
  }

  // Handle Arrays: JSON.stringify converts `undefined` in arrays to `null`.
  if (Array.isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      // If the source had `undefined` and the target now has `null`, fix it.
      if (source[i] === undefined && target[i] === null) {
        target[i] = undefined;
      }
      // Recurse into nested elements.
      restoreUndefineds(source[i], target[i]);
    }
  }
  // Handle Objects
  else {
    // Iterate over the keys of the original source object.
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        // If a key existed in the source but is missing in the target, it means
        // its value was `undefined`. Add it back.
        if (!(key in target)) {
          target[key] = undefined;
        } else {
          // If the key exists, recurse to check for nested undefined values.
          restoreUndefineds(source[key], target[key]);
        }
      }
    }
  }
}

/**
 * Deep clones any JSON-serializable object, preserving keys with `undefined` values.
 * This method works correctly with Proxies by first unwrapping them into a plain
 * object via JSON serialization and then restoring the dropped `undefined` values.
 */
export function cloneDeepJSON<T>(obj: T): T {
  // Primitives don't need cloning.
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Step 1: Perform the fast JSON-based clone. This unwraps proxies
  // but drops keys with `undefined` values.
  const clonedObj = JSON.parse(JSON.stringify(obj));

  // Step 2: Restore the `undefined` values by comparing with the original object.
  restoreUndefineds(obj, clonedObj);

  return clonedObj as T;
}
