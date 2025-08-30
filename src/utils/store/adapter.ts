import { type Store } from "solid-js/store";

/**
 * Creates an adapter for a SolidJS mutable store, combining the reactive state
 * with a set of "actions" that can modify that state. This ensures that all
 * modifications are trackable by Solid's reactivity system.
 *
 * @template T The shape of the store's state (a plain object).
 * @template U The shape of the actions (an object of functions).
 *
 * @param {T} store The mutable store to wrap.
 * @param {(store: Store<T>) => U} actionsFactory A function that takes the mutable store
 *   and returns an object containing action functions. These functions should
 *   operate on the store to modify its state.
 *
 * @returns {T & U} A single object combining the reactive store state and the actions.
 *   This object can be destructured to access both state properties and action methods.
 */
export function createStoreAdapter<T extends object = {}, U extends object = {}>(
  store: T,
  actionsFactory: (store: Store<T>) => U
): T & U {
  // 1. Create the actions by passing the store to the factory.
  //    This links the actions to this specific store instance.
  const actions = actionsFactory(store);

  // 2. Return a proxy that combines the store and actions.
  //    This provides a unified API, similar to a class instance.
  return new Proxy(store, {
    get(target, prop, receiver) {
      // Prioritize returning an action if the property name matches.
      if (prop in actions) {
        return Reflect.get(actions, prop, receiver);
      }

      // Otherwise, return the property from the reactive store.
      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
      // Prioritize setting on the actions object if the property exists there.
      if (prop in actions) {
        return Reflect.set(actions, prop, value, receiver);
      }

      // Otherwise, set the property on the reactive store.
      return Reflect.set(target, prop, value, receiver);
    },

    has(target, prop) {
      // Check for property existence in both actions and the store.
      return prop in actions || prop in target;
    },

    ownKeys(target) {
      // Combine keys from both the actions and the store for introspection.
      return [...Reflect.ownKeys(actions), ...Reflect.ownKeys(target)];
    },

    getOwnPropertyDescriptor(target, prop) {
      if (prop in actions) {
        return Reflect.getOwnPropertyDescriptor(actions, prop);
      }
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  }) as T & U;
}
