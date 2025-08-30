import { useSubmission } from "@solidjs/router";
import { merge } from "es-toolkit";
import { batch, createComputed, createContext, on, useContext, type ParentProps } from "solid-js";
import { createMutable } from "solid-js/store";
import { toast } from "solid-sonner";
import { end, rows, start, step } from "~/config/scheduler";
import { useI18n } from "~/i18n";
import { ClassRegistry } from "~/lib/classRegistry/classRegistry";
import type { LectureMutator } from "~/server/scraper/lectureMutator";
import { getStudyCoursesDetailsAction } from "~/server/server-fns/getCourses/actions";
import { isErrorReturn } from "~/server/server-fns/utils/errorHandeler";
import { SchedulerStore } from "~/store/store";
import { adaptSchedulerStore, type AdaptedSchedulerStore } from "~/store/storeAdapter";
import { parseStoreJsoUnsafeSync } from "~/store/storeSchema";
import { createColumns, filter, formatTime } from "~/store/utils";
import { makePersistedMutable } from "~/utils/persistedMutable";
import { makeAutoMemoStore } from "~/utils/store/autoMemo";

// Defines the structure of the store data when it's serialized (plain object without methods)
export type PlainStore = Pick<SchedulerStore, "courses">;

interface SchedulerContextType {
  store: AdaptedSchedulerStore;
  recreateStore: (plainStore: PlainStore) => void;
  serialize: (store: SchedulerStore) => string;
}

const SchedulerContext = createContext<SchedulerContextType>();

export function SchedulerProvider(props: ParentProps) {
  const { t } = useI18n();

  // Generate the columns based on configured start/end times and step duration
  const columns = createColumns({
    start,
    step,
    end,
    getTimeHeader: formatTime,
  });

  // Create an initial, empty store instance
  const emptyStore = new SchedulerStore({ columns, rows }, filter);

  // Serializes the relevant parts of the store state into a JSON string for persistence.
  const serialize = (store: SchedulerStore) => {
    // Only persist settings, courses, and custom events
    return JSON.stringify({
      settings: store.settings,
      courses: store.courses,
      customEvents: store.customEvents,
    });
  };

  // // Deserializes the JSON string from storage back into a store structure.
  const deserialize = (value: string) => {
    try {
      if (value === "undefined") return emptyStore;
      // Parse JSON and revive class instances (e.g., TimeSpan) using the ClassRegistry reviver.
      const parsedStore = JSON.parse(value, ClassRegistry.reviver);
      // Validate the structure and types of the parsed data using Zod schema.
      const validatedStoreResult = parseStoreJsoUnsafeSync(parsedStore);

      // Return the successfully validated and revived store data
      return validatedStoreResult as SchedulerStore;
    } catch (error) {
      console.log("Error parsing persisted store data:");
      console.error(error);
      setTimeout(
        () =>
          toast.error(t("schedulerProvider.importFromLocalStorage.error"), {
            description: t("schedulerProvider.importFromLocalStorage.errorDescription"),
            // Offer an action to clear the invalid data from local storage
            action: {
              label: t("schedulerProvider.importFromLocalStorage.clearLocalStorageAction"),
              onClick: () => {
                // Reset persisted state to the current (likely empty) store
                setPersistedShedulerStore(emptyStore);
              },
            },
          }),
        1000
      );
      return emptyStore;
    }
  };

  const revive = (store: SchedulerStore) => {
    return merge(emptyStore, store);
  };

  // Create the main mutable store instance, initialized with the empty store structure.

  // Create a persisted signal that automatically saves/loads the store to/from local storage.
  // const [store, setPersistedShedulerStore] = makePersisted(createMutableAdapter(emptyStore), {
  const [store, setPersistedShedulerStore] = makePersistedMutable(createMutable(emptyStore), {
    name: "schedulerStore", // Key used in local storage
    deserialize: (d) => revive(deserialize(d)), // Custom function to handle loading/validation
    serialize, // Custom function to handle saving
    debounceMs: 500,
  });

  // Function to merge plain data (e.g., from local storage) into the existing mutable store.
  // Uses `reconcile` to efficiently update the store while preserving reactivity,
  // and `merge` to combine the plain data with the existing store structure (including methods).
  const recreateStore = (plainStore: PlainStore) => setPersistedShedulerStore(merge(store, plainStore));

  // --- Handle updates when new course data is fetched from the server ---
  const data = useSubmission(getStudyCoursesDetailsAction);
  // Create a computed effect that runs when the server action result changes.
  createComputed(
    on(
      () => data.result, // Depend on the result of the server action
      (result) => {
        if (!result) return; // Ignore if no result yet

        // Check if the server returned an error
        if (isErrorReturn(result)) {
          // Optionally show an error toast
          // toast.error("Failed to fetch course details");
          return;
        }

        // Revive class instances from the fetched JSON data.
        // Necessary because server actions return plain JSON.
        const revivedData = JSON.parse(JSON.stringify(result), ClassRegistry.reviver) as LectureMutator.Return;

        // Update the store with the new course data within a batch to optimize reactivity.
        batch(() => {
          store.newCourses = revivedData;
        });
      }
    ),
    undefined,
    { name: "addCoursesToStore" } // Name for debugging purposes
  );

  // Provide the store and related functions to child components via context.
  return (
    <SchedulerContext.Provider
      value={{
        store: adaptSchedulerStore(makeAutoMemoStore(store)),
        recreateStore,
        serialize,
      }}
    >
      {props.children}
    </SchedulerContext.Provider>
  );
}

// Custom hook to easily access the Scheduler context.
export function useScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) throw new Error("useScheduler must be used within an SchedulerProvider");
  return context;
}
