import { trackStore } from "@solid-primitives/deep";
import { makePersisted, type PersistenceOptions } from "@solid-primitives/storage";
import { debounce } from "es-toolkit";
import { batch, createComputed, on } from "solid-js";
import { modifyMutable, reconcile, type createStore, type Store } from "solid-js/store";

type StoreReturn<T extends object = {}> = ReturnType<typeof createStore<T>>;
type MakePersistedReturn<T extends object = {}> = ReturnType<typeof makePersisted<StoreReturn<T>>>;

export function createMutableAdapter<T extends object = {}>(store: Store<T>): StoreReturn<T> {
  const setStore = (...args: any[]): void => {
    batch(() =>
      args.length === 1
        ? modifyMutable(store, reconcile(args[0]))
        : console.warn("setStore called with multiple arguments, ignoring extra arguments.")
    );
  };

  return [store, setStore];
}

export function makePersistedMutable<T extends object = {}>(
  store: T,
  options?: PersistenceOptions<T, undefined> & { debounceMs?: number }
): MakePersistedReturn<T> {
  const { debounceMs = 0, ...persistedOptions } = options ?? {};
  const [persisted, setPersisted, init] = makePersisted<StoreReturn<T>>(createMutableAdapter(store), persistedOptions);

  const setPersistedDebounced = debounce((newValue: T) => {
    setPersisted(newValue);
  }, debounceMs);

  createComputed(
    on(
      // Track deep changes within the mutable store object.
      () => trackStore(persisted),
      // The callback function receives the changed store.
      (currentStore, _, firstEffect) => {
        // Skip the very first run on mount, as it's just the initial state.
        if (firstEffect) return false;

        setPersistedDebounced(currentStore);

        // Return false to prevent the effect from re-running if only the store reference changed
        // (though trackStore should usually prevent this).
        return false;
      }
    ),
    true, // Defer execution until after the render phase
    { name: "persistStore" } // Name for debugging purposes
  );

  return [persisted, setPersisted, init];
}
