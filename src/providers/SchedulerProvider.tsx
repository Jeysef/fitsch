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
import { days } from "~/components/scheduler/constants";
import { createColumns, recreateColumns, SchedulerStore } from "~/components/scheduler/store";
import { TimeSpan } from "~/components/scheduler/time";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { LECTURE_TYPE, type DAY } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator2";

interface SchedulerContextType {
  store: SchedulerStore;
  newSchedulerStore: () => SchedulerStore;
  persistedStore: Accessor<SchedulerStore>;
  setPersistedShedulerStore: Setter<SchedulerStore>;
  recreateStore: (plainStore: SchedulerStore) => void;
}

const SchedulerContext = createContext<SchedulerContextType>();

export function SchedulerProvider(props: ParentProps) {
  const data = useSubmission(getStudyCoursesDetailsAction);
  const formatTime = (start: { hour: number; minute: number }, end: { hour: number; minute: number }) =>
    `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}\u00A0- ${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;
  const formatDay = (day: DAY) => ({ day });
  const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);
  const newSchedulerStore = () =>
    new SchedulerStore(
      {
        columns: createColumns({
          start: { hour: 7, minute: 0 },
          step: { hour: 1, minute: 0 },
          end: { hour: 20, minute: 0 },
          getTimeHeader: formatTime,
        }),
        rows: days.map(formatDay),
      },
      filter
    );

  const [persistedStore, setPersistedShedulerStore] = makePersisted(createSignal(newSchedulerStore()), {
    name: "schedulerStore",
  });

  const store = createMutable(newSchedulerStore());
  const recreateStore = (plainStore: SchedulerStore) => {
    plainStore.settings.columns = recreateColumns(plainStore.settings.columns);
    for (const course of plainStore.courses) {
      for (const dayData of Object.values(course.data)) {
        for (const event of dayData.events) {
          event.event.timeSpan = TimeSpan.fromPlain(event.event.timeSpan);
        }
      }
    }

    batch(() => {
      modifyMutable(store, reconcile(merge(store, plainStore)));
      // link data to courses, must be done after createMutable to link not duplicate
      store.data = store.combineData(store.courses.map((c) => c.data));
      setPersistedShedulerStore(store);
    });
  };
  recreateStore(persistedStore());

  createComputed(
    on(
      () => data.result,
      (result) => {
        if (!result) return;
        batch(() => {
          store.newCourses = result;
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
