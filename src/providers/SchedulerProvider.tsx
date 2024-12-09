import { makePersisted } from "@solid-primitives/storage";
import { createContext, createSignal, useContext, type Accessor, type ParentProps, type Setter } from "solid-js";
import { days } from "~/components/scheduler/constants";
import { createColumns, SchedulerStore } from "~/components/scheduler/store";
import { LECTURE_TYPE, type DAY } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator2";

interface SchedulerContextType {
  newSchedulerStore: () => SchedulerStore;
  persistedStore: Accessor<SchedulerStore>;
  setPersistedShedulerStore: Setter<SchedulerStore>;
}

const SchedulerContext = createContext<SchedulerContextType>();

export function SchedulerProvider(props: ParentProps) {
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

  return (
    <SchedulerContext.Provider value={{ persistedStore, setPersistedShedulerStore, newSchedulerStore }}>
      {props.children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) throw new Error("useScheduler must be used within an SchedulerProvider");
  return context;
}
