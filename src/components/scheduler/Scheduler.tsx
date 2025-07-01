import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { type DayDataObject, DayEventObject, type SchedulerStore } from "./store";
import {
  createContext,
  createSignal,
  type FlowProps,
  useContext,
  type Signal,
  For,
  createMemo,
  Index,
  type Accessor,
  type JSX,
} from "solid-js";
import { isServer } from "solid-js/web";
import { usePinch } from "solid-gesture";
import { Button } from "../ui/button";
import TableProperties from "lucide-solid/icons/table-properties";
import { cn } from "~/lib/utils";
import { ObjectTyped } from "object-typed";
import { DAY } from "~/server/scraper/enums";
import { Time, TimeSpan } from "./time";
import { createElementHeightRef } from "../heightMeasurer";
import type { DayEvent, ScheduleEvent } from "./event/types";
import type { StrictExtract } from "ts-essentials";
import { compact, difference, flatMap, flow, values } from "lodash-es";
import { isCustomEventData } from "./event/Event";
import { css } from "@emotion/css";
import type { DayData } from "./types";
import type { LinkedLectureData } from "~/server/scraper/lectureMutator";
import { hoverColors } from "~/config/colors";

// Constants
export const LAUNCH_DAY_TIME = {
  [DAY.MON]: { start: "11:00", end: "14:30" },
  [DAY.TUE]: { start: "11:00", end: "14:30" },
  [DAY.WED]: { start: "11:00", end: "14:30" },
  [DAY.THU]: { start: "11:00", end: "14:30" },
  [DAY.FRI]: { start: "11:00", end: "14:00" },
};

// Context
const SchedulerStoreContext = createContext<SchedulerStore>();
const LayoutContext = createContext<Signal<boolean>>();

export function useStore() {
  const value = useContext(SchedulerStoreContext);
  if (value === undefined) {
    throw new Error("useStore must be used within a SchedulerStoreContext.Provider");
  }
  return value;
}

export function useLayout() {
  const value = useContext(LayoutContext);
  if (value === undefined) {
    throw new Error("useLayout must be used within a LayoutContext.Provider");
  }
  return value;
}

export const [scheduleRef, setScheduleRef] = createSignal<HTMLDivElement | null>(null);

export function SchedulerProvider(props: { store: SchedulerStore } & FlowProps) {
  const [isHorizontalLayout, setIsHorizontalLayout] = makePersisted(createSignal(true), {
    name: "schedulerLayout",
    deserialize: (value) => value === "horizontal",
    serialize: (value) => (value ? "horizontal" : "vertical"),
    storage: cookieStorage,
  });
  return (
    <SchedulerStoreContext.Provider value={props.store}>
      <LayoutContext.Provider value={[isHorizontalLayout, setIsHorizontalLayout]}>{props.children}</LayoutContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}

export function Scheduler(props: FlowProps) {
  const store = useStore();
  const [isHorizontalLayout] = useLayout();
  const [scale, setScale] = createSignal(isServer ? 100 : window.innerWidth < 720 ? 50 : 100);
  const [touchAction, setTouchAction] = createSignal("pan-x pan-y");

  const bind = usePinch(
    ({ offset: [s], first, last, type }) => {
      if (first) {
        setTouchAction("none");
      }
      if (last) {
        setTouchAction("pan-x pan-y");
      }
      if (type === "wheel") {
        // wheel moves it too fast, so we need to slow it down
        setScale((prev) => prev + (s - prev) / 10);
        return;
      }

      setScale(s);
    },
    {
      scaleBounds: { min: 40, max: 150 },
      preventDefault: true,
      eventOptions: { passive: true },
    }
  );

  return (
    <div
      ref={setScheduleRef}
      class="relative grid overflow-auto max-h-full h-auto w-auto zoom-container transition-[font-size] ease-in-out bg-background"
      {...bind()}
      style={{
        "justify-content": "safe center",
        "--scheduler-scale": `${scale()}%`,
        "touch-action": touchAction(),
        "font-size": "var(--scheduler-scale, 100%)",
        "grid-template-columns": isHorizontalLayout()
          ? `max-content 7px repeat(${store.settings.columns.length}, minmax(5.6em, 6rem))`
          : `max-content repeat(${store.settings.rows.length}, 1fr )`,
        "grid-template-rows": isHorizontalLayout()
          ? `auto repeat(${store.settings.rows.length}, auto)`
          : `auto  7px repeat(${store.settings.columns.length}, calc(5em))`,
      }}
    >
      {props.children}
    </div>
  );
}

export function SchedulerGrid(props: FlowProps) {
  return (
    <div class="relative grid grid-rows-subgrid grid-cols-subgrid row-span-full col-span-full border inset-0 h-full w-full isolate [font-size:inherit]">
      {props.children}
    </div>
  );
}

const createLinkedCss = (eventId: string, linked: LinkedLectureData[], color: string): string | null => {
  if (!linked.length) return null;
  const wrapperCss = `&:has([data-id="${eventId}"]:hover)`;
  const linkedCss = linked
    .map((linked) => `${wrapperCss} .event[data-id="${linked.id}"] { outline-style: solid; outline-color: ${color}; }`)
    .join("\n");
  return linkedCss;
};

export function Week(props: FlowProps) {
  const store = useStore();
  const storeData = createMemo(() => values(store.data || store.getEmptyData()));
  const createLinkedHighlightClass = (
    property: StrictExtract<keyof ScheduleEvent, "linked" | "strongLinked">,
    color: string
  ) =>
    createMemo(() =>
      flow(
        (data: DayData[]) => flatMap(data, (e) => e.events),
        (events) =>
          flatMap(
            events,
            (event) =>
              !isCustomEventData(event.eventData) &&
              createLinkedCss(
                event.eventData.event.id,
                property === "linked"
                  ? difference(event.eventData.event.linked, event.eventData.event.strongLinked)
                  : event.eventData.event.strongLinked,
                color
              )
          ),
        compact,
        (links) => links.join("\n"),
        css
      )(storeData())
    );

  // Usage:
  const linkedHighlightClass = createLinkedHighlightClass("linked", hoverColors.linked);
  const strongLinkedHighlightClass = createLinkedHighlightClass("strongLinked", hoverColors.strongLinked);
  return (
    <div
      class={cn(
        "week grid grid-cols-subgrid grid-rows-subgrid row-[2/-1] col-[2/-1] [font-size:inherit]",
        linkedHighlightClass(),
        strongLinkedHighlightClass()
      )}
    >
      {props.children}
    </div>
  );
}

export function Days(props: {
  children: (data: Accessor<DayDataObject>) => JSX.Element;
}) {
  const store = useStore();
  const [isHorizontalLayout] = useLayout();
  const storeData = createMemo(() => values(store.data || store.getEmptyData()));
  return (
    <Index each={storeData()}>
      {(data) => (
        <div
          class={cn("schedule-row grid border-t [font-size:inherit]", {
            "em:py-2 em:gap-y-4": isHorizontalLayout(),
            "em:px-2 em:gap-x-4": !isHorizontalLayout(),
          })}
          style={{
            "grid-row": isHorizontalLayout() ? `${data().dayRow} / span 1` : "1 / -1",
            "grid-column": isHorizontalLayout() ? "1 / -1" : `${data().dayRow} / span 1`,
            "grid-template-rows": isHorizontalLayout() ? `repeat(${data().dayRows}, minmax(0, auto))` : "subgrid",
            "grid-template-columns": isHorizontalLayout() ? "subgrid" : `repeat(${data().dayRows}, minmax(8em, auto))`,
          }}
        >
          {props.children(data)}
        </div>
      )}
    </Index>
  );
}

export function Events(props: { day: Accessor<DayDataObject>; children: (event: DayEvent) => JSX.Element }) {
  const [isHorizontalLayout] = useLayout();
  return (
    <For each={props.day().events}>
      {(event) => (
        <div
          style={
            isHorizontalLayout()
              ? {
                  "grid-row": `${event.row} / span 1`,
                  "grid-column": `${event.colStart + 2} / ${event.colEnd + 3}`,
                  "padding-inline-start": `${event.paddingStart}%`,
                  "padding-inline-end": `${event.paddingEnd}%`,
                }
              : {
                  "grid-column": `${event.row} / span 1`,
                  "grid-row": `${event.colStart + 2} / ${event.colEnd + 3}`,
                  "padding-block-start": `calc(${event.paddingStart} * var(--element-height, 0) / 100)`,
                  "padding-block-end": `calc(${event.paddingEnd} * var(--element-height, 0) / 100)`,
                }
          }
          ref={createElementHeightRef(isHorizontalLayout)}
        >
          {props.children(event)}
        </div>
      )}
    </For>
  );
}

export function Corner() {
  const [isHorizontalLayout, setIsHorizontalLayout] = useLayout();
  return (
    <div class="row-span-1 col-span-1 left-0  sticky top-px z-30 bg-background font-mono outline-border outline mr-px flex justify-center items-center">
      <Button onClick={() => setIsHorizontalLayout((p) => !p)} variant="ghost" class="h-full w-full p-1">
        <TableProperties
          class={cn("transition-transform ease-linear em:w-5 md:em:w-7 aspect-square", {
            "rotate-180": isHorizontalLayout(),
            "rotate-[270deg]": !isHorizontalLayout(),
          })}
        />
      </Button>
    </div>
  );
}

// semi transparent block to represent time of launch
export function LaunchHighlight() {
  const store = useStore();
  const [isHorizontalLayout] = useLayout();
  return ObjectTyped.entries(LAUNCH_DAY_TIME).map(([day, time]) => {
    const timeSpan = new TimeSpan(Time.fromString(time.start), Time.fromString(time.end));
    const row = store.getDayRow(day);
    const data = new DayEventObject(store.settings.columns, timeSpan);
    return (
      <div
        style={{
          "grid-row": isHorizontalLayout() ? `${row} / span 1` : `${data.colStart + 1} / ${data.colEnd + 2}`,
          "grid-column": isHorizontalLayout() ? `${data.colStart + 1} / ${data.colEnd + 2}` : `${row} / span 1`,
          "margin-inline-start": isHorizontalLayout() ? `${data.paddingStart}%` : "unset",
          "margin-inline-end": isHorizontalLayout() ? `${data.paddingEnd}%` : "unset",
          "margin-block-start": isHorizontalLayout()
            ? "unset"
            : `calc(${data.paddingStart} * var(--element-height, 0) / 100)`,
          "margin-block-end": isHorizontalLayout() ? "unset" : `calc(${data.paddingEnd} * var(--element-height, 0) / 100)`,
        }}
        class="bg-fuchsia-300 bg-opacity-10 -z-20"
        ref={createElementHeightRef(isHorizontalLayout)}
      />
    );
  });
}

export function ColumnLines() {
  const store = useStore();
  const [isHorizontalLayout] = useLayout();
  return (
    <div
      class={cn("grid grid-cols-subgrid row-start-2 -row-end-1 col-[3/-1] select-none -z-30 divide-x divide-dashed", {
        "divide-solid": !isHorizontalLayout(),
      })}
    >
      <For each={isHorizontalLayout() ? store.settings.columns : Array(store.settings.rows.length)}>
        {() => <div class="col-span-1 row-span-full" />}
      </For>
    </div>
  );
}

export function TopXAxisHeader(props: FlowProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      class="grid grid-cols-subgrid row-span-1 col-[2/-1] sticky top-px outline outline-border z-20 bg-background divide-x"
      {...props}
    />
  );
}

export function LeftYAxisHeader(props: FlowProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      class="grid grid-rows-subgrid row-[2/-1] col-span-1 border-r sticky left-0 z-10 bg-background divide-y"
      {...props}
    />
  );
}
