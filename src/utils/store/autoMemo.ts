import { createMemo, getOwner, runWithOwner, type Accessor } from "solid-js";

const getGetter = <T extends object = {}>(store: T, prop: string | symbol) => {
  return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(store), prop)?.get;
};

/**
 * Creates a proxy over a Solid store that memoizes its getters.
 * Each getter is wrapped in a `createMemo` on its first access,
 * ensuring it only re-evaluates when its specific dependencies change.
 *
 * @param {T} store The reactive state object from a `createStore` or `createMutable` call.
 * @returns {T} A proxied version of the store with memoized getters.
 */
export function makeAutoMemoStore<T extends object = {}>(store: T): T {
  const memoCache = new Map<string | symbol, Accessor<unknown>>();
  const owner = getOwner();

  return new Proxy(store, {
    get(target, prop, receiver) {
      if (memoCache.has(prop)) {
        return memoCache.get(prop)!();
      }

      const getter = getGetter(target, prop);

      if (getter) {
        if (!owner) {
          // If there is no owner, we are not in a reactive context.
          // Creating a memo here would result in a memory leak as it would never be disposed.
          // In this case, we fall back to calling the original getter directly without memoization.
          return getter.call(receiver);
        }

        let memo: Accessor<unknown>;

        // By running the creation of the memo within the captured owner's context,
        // we ensure its lifecycle is correctly managed by Solid's reactivity system.
        runWithOwner(owner, () => {
          memo = createMemo(() => {
            // We use `getter.call(receiver)` to ensure that `this`
            // inside the getter refers to the proxy. This allows nested
            // memoized getters to work correctly.
            return getter.call(receiver);
          });
        });

        memoCache.set(prop, memo!);
        return memo!();
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}
