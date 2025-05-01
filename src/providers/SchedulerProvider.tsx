import { trackStore } from "@solid-primitives/deep";
import { makePersisted } from "@solid-primitives/storage";
import { useSubmission } from "@solidjs/router";
import { merge, range, zipObject } from "lodash-es";
import {
  batch,
  createComputed,
  createContext,
  createEffect,
  createSignal,
  on,
  onMount,
  useContext,
  type ParentProps,
} from "solid-js";
import { createMutable, modifyMutable, reconcile } from "solid-js/store";
import { toast } from "solid-sonner";
import { parseStoreJson } from "~/components/menu/storeJsonValidator";
import { ClassRegistry } from "~/components/scheduler/classRegistry";
import { SchedulerStore } from "~/components/scheduler/store";
import { TimeSpan, type Time } from "~/components/scheduler/time";
import type { ICreateColumns, IScheduleColumn, IScheduleRow } from "~/components/scheduler/types";
import { days, end, start, step } from "~/config/scheduler";
import { useI18n } from "~/i18n";
import { LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types";
import { getStudyCoursesDetailsAction } from "~/server/server-fns/getCourses/actions";
import { isErrorReturn } from "~/server/server-fns/utils/errorHandeler";

// Defines the structure of the store data when it's serialized (plain object without methods)
export type PlainStore = Pick<SchedulerStore, "courses">;

interface SchedulerContextType {
  store: SchedulerStore;
  recreateStore: (plainStore: PlainStore) => void;
  serialize: (store: SchedulerStore) => string;
}

const SchedulerContext = createContext<SchedulerContextType>();

// Helper function to generate the time column headers for the scheduler grid
export function createColumns(config: ICreateColumns): IScheduleColumn[] {
  // create columns from start to end with step
  const columns: IScheduleColumn[] = [];
  const step = config.step;
  const end = config.end;
  let spanStart = config.start;
  let spanEnd = spanStart.add(step);
  while (spanEnd.minutes <= end.minutes) {
    columns.push({
      title: config.getTimeHeader(spanStart, spanEnd),
      duration: new TimeSpan(spanStart, spanEnd),
    });
    spanStart = spanEnd;
    spanEnd = spanEnd.add(step);
  }

  return columns;
}

export function SchedulerProvider(props: ParentProps) {
  const { t } = useI18n();

  // Formatter for time headers in the scheduler columns (e.g., "08:00–08:50")
  const formatTime = (start: Time, end: Time) =>
    `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}–${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;

  // Filter function to exclude certain lecture types (e.g., exams, notes) from the main schedule display
  const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);

  // Define the rows for the scheduler grid, mapping days to row numbers
  const rows = { ...zipObject(days, range(1, days.length + 1)), length: days.length } as IScheduleRow;

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
      settings: { blockDimensions: store.settings.blockDimensions },
      courses: store.courses,
      customEvents: store.customEvents,
    });
  };

  // Deserializes the JSON string from storage back into a store structure.
  const deserialize = (value: string) => {
    try {
      // Parse JSON and revive class instances (e.g., TimeSpan) using the ClassRegistry reviver.
      const parsedStore = JSON.parse(value, ClassRegistry.reviver);
      // Validate the structure and types of the parsed data using Zod schema.
      const validatedStoreResult = parseStoreJson(parsedStore);

      if (!validatedStoreResult.success) {
        // Log validation errors
        console.log("Error parsing persisted store data:");
        console.error(validatedStoreResult.error);
        // Show an error toast to the user after a short delay
        setTimeout(
          () =>
            toast.error(t("schedulerProvider.importFromLocalStorage.error"), {
              description: t("schedulerProvider.importFromLocalStorage.errorDescription"),
              // Offer an action to clear the invalid data from local storage
              action: {
                label: t("schedulerProvider.importFromLocalStorage.clearLocalStorageAction"),
                onClick: () => {
                  // Reset persisted state to the current (likely empty) store
                  setPersistedShedulerStore(store);
                },
              },
            }),
          1000
        );
        // Return the current store state as a fallback
        return store;
      }
      // Return the successfully validated and revived store data
      return validatedStoreResult.data as SchedulerStore;
    } catch (error) {
        // Handle potential JSON parsing errors
        console.error("Failed to deserialize scheduler store:", error);
        // Optionally show a toast or return the empty store
        return store;
    }
  };

  // Create the main mutable store instance, initialized with the empty store structure.
  const store = createMutable(emptyStore);

  // Create a persisted signal that automatically saves/loads the store to/from local storage.
  const [persistedStore, setPersistedShedulerStore] = makePersisted(createSignal(emptyStore), {
    name: "schedulerStore", // Key used in local storage
    deserialize, // Custom function to handle loading/validation
    serialize, // Custom function to handle saving
  });

  // Function to merge plain data (e.g., from local storage) into the existing mutable store.
  // Uses `reconcile` to efficiently update the store while preserving reactivity,
  // and `merge` to combine the plain data with the existing store structure (including methods).
  const recreateStore = (plainStore: PlainStore) => modifyMutable(store, reconcile(merge(store, plainStore)));

  // On component mount, load the persisted state from local storage and merge it into the store.
  onMount(() => {
    const plain = persistedStore();
    recreateStore(plain);
  });

  // --- Handle updates when new course data is fetched from the server ---
  const data = useSubmission(getStudyCoursesDetailsAction);
  // Create a computed effect that runs when the server action result changes.
  createComputed(
    on(
      () => data.result, // Depend on the result of the server action
      (result) => {
        if (!result) return; // Ignore if no result yet
        console.log("🚀 ~ SchedulerProvider ~ result:", result);

        // Check if the server returned an error
        if (isErrorReturn(result)) {
          // Optionally show an error toast
          // toast.error("Failed to fetch course details");
          return;
        }

        // Revive class instances from the fetched JSON data.
        // Necessary because server actions return plain JSON.
        const revivedData = JSON.parse(
          JSON.stringify(result),
          ClassRegistry.reviver
        ) as DataProviderTypes.getStudyCoursesDetailsReturn;

        // Update the store with the new course data within a batch to optimize reactivity.
        batch(() => {
          store.newCourses = revivedData;
        });
      }
    ),
    undefined,
    { name: "addCoursesToStore" } // Name for debugging purposes
  );

  // --- Persist store changes to local storage ---
  // Create an effect that triggers whenever the store content changes.
  createEffect(
    on(
      // Track deep changes within the mutable store object.
      () => trackStore(store),
      // The callback function receives the changed store.
      (currentStore, _, firstEffect) => {
        // Skip the very first run on mount, as it's just the initial state.
        if (firstEffect) return false;

        console.log("Store changed, persisting...", currentStore);
        // Update the persisted signal, triggering the `serialize` function and saving to local storage.
        setPersistedShedulerStore(currentStore);

        // Return false to prevent the effect from re-running if only the store reference changed
        // (though trackStore should usually prevent this).
        return false;
      }
    ),
    true, // Defer execution until after the render phase
    { name: "persistStore" } // Name for debugging purposes
  );

  // Provide the store and related functions to child components via context.
  return (
    <SchedulerContext.Provider
      value={{
        store: store,
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
