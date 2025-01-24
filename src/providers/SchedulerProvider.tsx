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
  onMount,
  useContext,
  type ParentProps,
  type Setter,
} from "solid-js";
import { createMutable, modifyMutable, reconcile } from "solid-js/store";
import { parseStoreJson } from "~/components/menu/storeJsonValidator";
import { ClassRegistry } from "~/components/scheduler/classRegistry";
import { SchedulerStore } from "~/components/scheduler/store";
import { TimeSpan, type Time } from "~/components/scheduler/time";
import type { ICreateColumns, IScheduleColumn, IScheduleRow } from "~/components/scheduler/types";
import { days, end, start, step } from "~/config/scheduler";
import { useI18n } from "~/i18n";
import { toast } from "~/packages/solid-sonner";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types";

// some classes are already revived by ClassRegistry
export type PlainStore = Pick<SchedulerStore, "settings" | "courses">;

interface SchedulerContextType {
  store: SchedulerStore;
  recreateStore: (plainStore: PlainStore) => void;
  serialize: (store: SchedulerStore) => string;
}

const SchedulerContext = createContext<SchedulerContextType>();

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

  const formatTime = (start: Time, end: Time) =>
    `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}\u00A0- ${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;
  const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);
  const rows: IScheduleRow[] = days.map((day) => ({ day }));
  const columns = createColumns({
    start,
    step,
    end,
    getTimeHeader: formatTime,
  });
  const emptyStore = new SchedulerStore({ columns, rows }, filter);

  const serialize = (store: SchedulerStore) => {
    return JSON.stringify({
      settings: store.settings,
      courses: store.courses,
      customEvents: store.customEvents,
    });
  };

  const deserialize = (value: string) => {
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
      return store;
    }
    return validatedStoreResult.data as SchedulerStore;
  };

  const store = createMutable(emptyStore);
  const [persistedStore, setPersistedShedulerStore] = makePersisted(createSignal(emptyStore), {
    name: "schedulerStore",
    deserialize,
    serialize,
  });

  // must be merged to carry over the functions
  const recreateStore = (plainStore: PlainStore) => modifyMutable(store, reconcile(merge(store, plainStore)));

  onMount(() => {
    recreateStore(persistedStore());
  });

  // --- update on data from server
  const data = useSubmission(getStudyCoursesDetailsAction);
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

  // create Effect so the set store does not delay the render
  createEffect(
    on(
      () => trackStore(store),
      // I don't want to trigger on first effect because it's the initial store
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
        recreateStore,
        serialize,
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
