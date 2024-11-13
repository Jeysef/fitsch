import { css } from "@emotion/css";
import { compact, flatMap, flow, values } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { createContext, createEffect, createMemo, For, Index, useContext } from "solid-js";
import { StrictExtract } from 'ts-essentials';
import ScheduleEvent from "~/components/scheduler/Event";
import { getDayEventData, type SchedulerStore } from "~/components/scheduler/store";
import { Time, TimeSpan } from "~/components/scheduler/time";
import type { Event } from "~/components/scheduler/types";
import { hoverColors } from "~/config/colors";
import { cn } from "~/lib/utils";
import { launchDayTime } from "~/server/scraper/constants";
import type { LinkedLectureData } from "~/server/scraper/lectureMutator";

export interface WorkScheduleProps {
  store: SchedulerStore;
}


const SchedulerStoreContext = createContext<SchedulerStore>();

function useStore() {
  const value = useContext(SchedulerStoreContext);
  if (value === undefined) {
    throw new Error("useStore must be used within a SchedulerStoreContext.Provider");
  }
  return value;

}


export default function Scheduler(props: WorkScheduleProps) {

  return (
    <SchedulerStoreContext.Provider value={props.store}>
      <SchedulerGrid />
    </SchedulerStoreContext.Provider>
  );
}

function SchedulerGrid() {
  const store = useStore();

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
  const store = useStore();
  return <div class="grid grid-cols-subgrid row-span-1 col-[2/-1] outline-1 sticky top-px outline outline-border z-20 bg-background font-mono divide-x">
    <For each={store.settings.columns}>
      {(column) => (
        <div class="flex items-center justify-center [text-align-last:right] p-1">{column.title}</div>
      )}
    </For>
  </div>;
}

function Days() {
  const store = useStore();
  return <div class="grid grid-rows-subgrid row-[2/-1] col-span-1 border-r sticky left-0 z-10 bg-background divide-y">
    <For each={store.settings.rows}>
      {(day) => (
        <div class="items-center justify-center p-4 flex">{day.title}</div>
      )}
    </For>
  </div>;
}

const createLinkedCss = (eventId: string, linked: LinkedLectureData[], color: string): string | null => {
  if (!(linked.length)) return null;
  const wrapperCss = `&:has([data-id="${eventId}"]:hover)`
  const linkedCss = linked.map(linked => `${wrapperCss} .event[data-id="${linked.id}"] { outline-style: solid; outline-color: ${color}; }`).join('\n')
  return linkedCss;
}

function Week() {
  const store = useStore();
  const storeData = createMemo(() => values(store.data));
  createEffect(() => {
    console.log("storeData", storeData());
  });
  const createLinkedHighlightClass = (property: StrictExtract<keyof Event, "linked" | "strongLinked">, color: string) =>
    createMemo(() =>
      flow([
        data => flatMap(data, 'events'),
        events => flatMap(events, event => createLinkedCss(event.event.id, event.event[property], color)),
        compact,
        links => links.join('\n'),
        css
      ])(storeData())
    );

  // Usage:
  const linkedHighlightClass = createLinkedHighlightClass('linked', hoverColors.linked);
  const strongLinkedHighlightClass = createLinkedHighlightClass('strongLinked', hoverColors.strongLinked);
  return <div class={cn("week grid grid-cols-subgrid grid-rows-subgrid row-[2/-1] col-[2/-1]", linkedHighlightClass(), strongLinkedHighlightClass())}>
    <LaunchHighlight />
    <Index each={storeData()}>{(data) => (
      <div
        class="schedule-row grid grid-cols-subgrid col-span-full py-2 gap-y-2 border-t"
        style={{
          "grid-row": `${data().dayRow} / span 1`,
          "grid-template-rows": `repeat(${data().dayRows}, minmax(0, auto))`,
        }}
      >
        <For each={data().events}>{(event) => (
          <div style={{ "grid-row": `${event.row} / span 1`, "grid-column": `${event.colStart + 1} / ${event.colEnd + 2}`, "padding-inline-start": `${event.paddingStart}%`, "padding-inline-end": `${event.paddingEnd}%` }}>
            <ScheduleEvent event={event.event} store={store} />
          </div>
        )}
        </For>
      </div>
    )}
    </Index>
  </div>;
}

function ColumnLines() {
  const store = useStore();
  return <div class="grid grid-cols-subgrid row-start-2 -row-end-1 col-[2/-1] select-none -z-30 divide-x divide-dashed">
    <For each={store.settings.columns} >
      {() => <div role="separator" />}
    </For>
  </div>;
}

function LaunchHighlight() {
  const store = useStore();
  // semi transparent block to represent time of launch
  return ObjectTyped.entries(launchDayTime).map(([day, time]) => {
    const convertTime = (time: string) => { const [hour, minute] = time.split(':').map(Number); return { hour, minute } }
    const timeSpan = new TimeSpan(new Time(convertTime(time.start)), new Time(convertTime(time.end)));
    const row = store.settings.rows.findIndex(row => row.day === day) + 1;
    const data = getDayEventData(store.settings.columns, timeSpan);
    return (
      <div
        style={{
          "grid-row": `${row} / span 1`,
          "grid-column": `${data.colStart + 1} / ${data.colEnd + 2}`,
          "margin-inline-start": `${data.paddingStart}%`,
          "margin-inline-end": `${data.paddingEnd}%`,
        }}
        class="bg-fuchsia-300 bg-opacity-10 -z-20"
      />
    )
  });
}

function Corner() {
  return <div class="row-span-1 col-span-1 left-0  sticky top-px z-30 bg-background font-mono outline-border outline outline-1 mr-px" />;
}