import { ObjectTyped } from "object-typed";
import { createContext, createMemo, For, useContext } from "solid-js";
import ScheduleEvent from "~/components/scheduler/Event";
import { schedulerTimeToMinutes, type ISchedulerSettings, type ParsedDayData } from "~/components/scheduler/store";
import { launchDayTime } from "~/server/scraper/constants";

export interface WorkScheduleProps {
  store: {
    settings: ISchedulerSettings;
    data: ParsedDayData;
  }
}


export const SchedulerStoreContext = createContext<{
  settings: ISchedulerSettings;
  data: ParsedDayData;
} | null>(null);



export default function Scheduler(props: WorkScheduleProps) {

  return (
    <SchedulerStoreContext.Provider value={props.store}>
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
        "grid-template-columns": `max-content repeat(${store.settings.columns.length}, minmax(5.5rem, 10rem))`,
        "grid-template-rows": `auto repeat(${store.settings.rows.length}, auto)`,
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
    <For each={store.settings.columns}>
      {(column) => (
        <div class="hour border-l flex items-center justify-center [text-align-last:right] p-1">{column.title}</div>
      )}
    </For>
  </div>;
}

function Days() {
  const store = useContext(SchedulerStoreContext)!;
  return <div class="grid grid-rows-subgrid row-[2/-1] col-span-1 border-r sticky left-0 z-10 bg-background">
    <For each={store.settings.rows}>
      {(day) => (
        <div class="items-center justify-center p-4 flex border-t">{day.title}</div>
      )}
    </For>
  </div>;
}

function Week() {
  return <div class="schedule grid grid-cols-subgrid grid-rows-subgrid row-[2/-1] col-[2/-1] border-l">
    <LaunchHighlight />
    <WeekSchedule />
  </div>;
}

function ColumnLines() {
  const store = useContext(SchedulerStoreContext)!;
  return <div class="grid grid-cols-subgrid row-start-2 -row-end-1 col-[2/-1] select-none -z-30">
    <For each={store.settings.columns} >
      {() => <div class="border-l border-dashed" />}
    </For>
  </div>;
}

function LaunchHighlight() {
  const store = useContext(SchedulerStoreContext)!;
  // semi transparent block to represent time of launch
  return ObjectTyped.entries(launchDayTime).map(([day, time]) => {
    const [start, end] = time.split(" – ");
    const event = {
      start: { hour: parseInt(start.split(":")[0]), minute: parseInt(start.split(":")[1]) },
      end: { hour: parseInt(end.split(":")[0]), minute: parseInt(end.split(":")[1]) },
    };
    const row = store.settings.rows.findIndex(row => row.day === day) + 1;
    const colStart = store.settings.columns.findIndex(column => schedulerTimeToMinutes(column.start) <= schedulerTimeToMinutes(event.start) && schedulerTimeToMinutes(column.end) > schedulerTimeToMinutes(event.start))
    const colEnd = store.settings.columns.findIndex(column => schedulerTimeToMinutes(column.start) < schedulerTimeToMinutes(event.end) && schedulerTimeToMinutes(column.end) >= schedulerTimeToMinutes(event.end))
    const columnsDuration = schedulerTimeToMinutes(store.settings.columns[colEnd].end) - schedulerTimeToMinutes(store.settings.columns[colStart].start);
    const marginStart = Math.round((schedulerTimeToMinutes(event.start) - schedulerTimeToMinutes(store.settings.columns[colStart].start)) * 100) / columnsDuration;
    const marginEnd = Math.round((schedulerTimeToMinutes(store.settings.columns[colEnd].end) - schedulerTimeToMinutes(event.end)) * 100) / columnsDuration;
    return (
      <div
        style={{
          "grid-row": `${row} / span 1`,
          "grid-column": `${colStart + 1} / ${colEnd + 2}`,
          "margin-inline-start": `${marginStart}%`,
          "margin-inline-end": `${marginEnd}%`,
        }}
        class="bg-fuchsia-300 bg-opacity-10 -z-20"
      >

      </div>
    )
  });
}

function Corner() {
  return <div class="row-span-1 col-span-1 border-r border-b sticky top-0 left-0 z-20 bg-background" />;
}

function WeekSchedule() {
  const store = useContext(SchedulerStoreContext)!;
  const days = createMemo(() => Object.values(store.data));

  // for info, I need to use fragmeents to wrap the days in solid jsx observer
  return (
    <>
      <For each={days()}>{(data) => (
        <div
          class="schedule-row grid grid-cols-subgrid col-span-full py-2 gap-y-2 border-t"
          style={{
            "grid-row": `${data.dayRow} / span 1`,
            "grid-template-rows": `repeat(${data.dayRows}, minmax(0, auto))`,
          }}
        >
          <For each={data.events}>{(event) => (
            <div style={{ "grid-row": `${event.row} / span 1`, "grid-column": `${event.colStart + 1} / ${event.colEnd + 2}`, "padding-inline-start": `${event.paddingStart}%`, "padding-inline-end": `${event.paddingEnd}%` }}>
              <ScheduleEvent event={event.event} store={store} />
            </div>
          )}
          </For>
        </div>
      )}
      </For>
    </>
  )
}