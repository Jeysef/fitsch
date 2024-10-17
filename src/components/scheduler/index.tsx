import { Accessor, createContext, createMemo, For, useContext } from "solid-js";
import ScheduleEvent from "~/components/scheduler/Event";
import type { ISchedulerSettings, ParsedDayData } from "~/components/scheduler/store2";

export interface WorkScheduleProps {
  store: {
    settings: ISchedulerSettings;
    data: ParsedDayData;
  }
}


const SchedulerStoreContext = createContext<Accessor<{
  settings: ISchedulerSettings;
  data: ParsedDayData;
}> | null>(null);



export default function Scheduler(props: WorkScheduleProps) {

  return (
    <SchedulerStoreContext.Provider value={() => props.store}>
      <SchedulerGrid />
    </SchedulerStoreContext.Provider>
  );
}

function SchedulerGrid() {
  const store = useContext(SchedulerStoreContext)!;

  return (
    <div
      class="relative grid overflow-auto max-h-full h-auto w-full justify-start"
      style={{
        "grid-template-columns": `max-content repeat(${store().settings.columns.length}, minmax(5.5rem, 10rem))`,
        "grid-template-rows": `auto repeat(${store().settings.rows.length}, auto)`,
      }}
    >
      <div class="relative grid grid-rows-subgrid grid-cols-subgrid row-span-full col-span-full border inset-0 h-full w-full isolate">
        <Corner />
        <Heading />
        <Days />
        <Week />
        <ColumnLines />
      </div>
    </div>
  );
}

function Heading() {
  const store = useContext(SchedulerStoreContext)!;
  return <div class="grid grid-cols-subgrid row-span-1 col-[2/-1] outline-1 sticky top-px outline outline-border z-10 bg-background font-mono">
    <For each={store().settings.columns}>
      {(column) => (
        <div class="hour border-l flex items-center justify-center [text-align-last:right] p-1">{column.title}</div>
      )}
    </For>
  </div>;
}

function Days() {
  const store = useContext(SchedulerStoreContext)!;
  return <div class="grid grid-rows-subgrid row-[2/-1] col-span-1 border-r sticky left-0 z-10 bg-background">
    <For each={store().settings.rows}>
      {(day) => (
        <div class="items-center justify-center p-4 flex border-t">{day.title}</div>
      )}
    </For>
  </div>;
}

function Week() {
  return <div class="schedule grid grid-cols-subgrid grid-rows-subgrid row-[2/-1] col-[2/-1] border-l">
    <WeekSchedule />
  </div>;
}

function ColumnLines() {
  const store = useContext(SchedulerStoreContext)!;
  return <div class="grid grid-cols-subgrid row-start-2 -row-end-1 col-[2/-1] select-none -z-30">
    <For each={store().settings.columns} >
      {() => <div class="border-l border-dashed" />}
    </For>
  </div>;
}

function Corner() {
  return <div class="row-span-1 col-span-1 border-r border-b sticky top-0 left-0 z-20 bg-background" />;
}

function WeekSchedule() {
  const store = useContext(SchedulerStoreContext)!;
  const days = createMemo(() => Object.values(store().data));

  return (
    <>
      {days().map((data) => (
        <div
          class="schedule-row grid grid-cols-subgrid col-span-full py-2 gap-y-2 border-t"
          style={{
            "grid-row": `${data.dayRow} / span 1`,
            "grid-template-rows": `repeat(${data.dayRows}, minmax(0, auto))`,
          }}
        >
          <For each={data.events}>{(event) => (
            <div style={{ "grid-row": `${event.row} / span 1`, "grid-column": `${event.colStart} / ${event.colEnd + 1}`, "padding-inline-start": `${event.paddingStart}%`, "padding-inline-end": `${event.paddingEnd}%` }}>
              <ScheduleEvent event={event.event} />
            </div>
          )}
          </For>
        </div>
      ))}
    </>
  )
}