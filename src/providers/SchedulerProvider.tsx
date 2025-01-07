import { trackStore } from "@solid-primitives/deep";
import { makePersisted } from "@solid-primitives/storage";
import { useSubmission } from "@solidjs/router";
import { merge } from "lodash-es";
import {
  batch,
  createComputed,
  createContext,
  createEffect,
  createSignal,
  on,
  useContext,
  type Accessor,
  type ParentProps,
  type Setter,
} from "solid-js";
import { createMutable, modifyMutable, reconcile } from "solid-js/store";
import { parseStoreJson } from "~/components/menu/storeJsonValidator";
import { ClassRegistry } from "~/components/scheduler/classRegistry";
import { createColumns, SchedulerStore } from "~/components/scheduler/store";
import { days, end, start, step } from "~/config/scheduler";
import { useI18n } from "~/i18n";
import { toast } from "~/packages/solid-sonner";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { LECTURE_TYPE, type DAY } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types";

// some classes are already revived by ClassRegistry
export type PlainStore = Pick<SchedulerStore, "settings" | "courses">;

interface SchedulerContextType {
  store: SchedulerStore;
  newSchedulerStore: () => SchedulerStore;
  persistedStore: Accessor<SchedulerStore>;
  setPersistedShedulerStore: Setter<SchedulerStore>;
  recreateStore: (plainStore: PlainStore) => void;
}

const SchedulerContext = createContext<SchedulerContextType>();

export const storeSerializer = (store: SchedulerStore) => {
  return JSON.stringify({
    settings: store.settings,
    courses: store.courses,
  });
};

export function SchedulerProvider(props: ParentProps) {
  const { t } = useI18n();
  const data = useSubmission(getStudyCoursesDetailsAction);
  const formatTime = (start: { hour: number; minute: number }, end: { hour: number; minute: number }) =>
    `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}\u00A0- ${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;
  const formatDay = (day: DAY) => ({ day });
  const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);
  const newSchedulerStore = () =>
    new SchedulerStore(
      {
        columns: createColumns({
          start: start,
          step: step,
          end: end,
          getTimeHeader: formatTime,
        }),
        rows: days.map(formatDay),
      },
      filter
    );
  const updateStoreData = (store: SchedulerStore) => {
    store.data = store.createDataFromCourses(store.courses);
  };

  const newStore = newSchedulerStore();
  const store = createMutable(newStore);
  const [persistedStore, setPersistedShedulerStore] = makePersisted(createSignal(newStore), {
    name: "schedulerStore",
    deserialize: (value) => {
      const parsedStore = JSON.parse(value, ClassRegistry.reviver);
      const validatedStoreResult = parseStoreJson(parsedStore);
      if (!validatedStoreResult.success) {
        console.log("error parsing store");
        console.error(validatedStoreResult.error);
        setTimeout(
          () =>
            toast.error(t("schedulerProvider.importFromLocalStorage.error"), {
              description: t("schedulerProvider.importFromLocalStorage.errorDescription"),
              action: {
                label: t("schedulerProvider.importFromLocalStorage.clearLocalStorageAction"),
                onClick: () => {
                  setPersistedShedulerStore(store);
                },
              },
            }),
          1000
        );
        return newStore;
      }
      return validatedStoreResult.data as SchedulerStore;
    },
    serialize: storeSerializer,
  });

  const recreateStore = (plainStore: PlainStore) => {
    batch(() => {
      modifyMutable(store, reconcile(merge(store, plainStore)));
      // link data to courses, must be done after createMutable to link not duplicate
      updateStoreData(store);
    });
  };
  // updateStoreData(store);
  recreateStore(persistedStore());

  createComputed(
    on(
      () => data.result,
      (result) => {
        if (!result) return;
        const revivedData = JSON.parse(
          JSON.stringify(result),
          ClassRegistry.reviver
        ) as DataProviderTypes.getStudyCoursesDetailsReturn;
        batch(() => {
          store.newCourses = revivedData;
        });
      }
    ),
    undefined,
    { name: "addCoursesToStore" }
  );

  createEffect(
    on(
      () => trackStore(store),
      (store, _, firstEffect) => {
        if (firstEffect) return false;
        console.log("store changed", store);
        setPersistedShedulerStore(store);
        return false;
      }
    ),
    true,
    { name: "persistStore" }
  );

  return (
    <SchedulerContext.Provider
      value={{
        store: store,
        persistedStore,
        setPersistedShedulerStore,
        newSchedulerStore,
        recreateStore,
      }}
    >
      {props.children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) throw new Error("useScheduler must be used within an SchedulerProvider");
  return context;
}
