import type { Merge } from 'type-fest';
export declare function isEqual<T>(a: T, b: any): b is T;
export declare function mergeObj<A, B>(a: A, b: Merge<Partial<A>, B>): Merge<A, B>;
/**
 * Helper to bind the owner of the current context to the
 * supplied function.
 *
 * Implementation is very simple:
 * ```ts
 * import { getOwner, runWithOwner } from 'solid-js';
 *
 * export function bindOwner<T>(fn: () => T): () => T {
 *   const owner = getOwner();
 *
 *   if (!owner) {
 *     throw new Error('No solidjs owner in current context');
 *   }
 *
 *   return () => runWithOwner(owner, fn);
 * }
 * ```
 */
export declare function bindOwner<T>(fn: () => T): () => T;
//# sourceMappingURL=util.d.ts.map