import { css } from "@emotion/css";
import { createDateNow } from "@solid-primitives/date";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { compact, difference, flatMap, flow, values, without } from "lodash-es";
import Columns4 from "lucide-solid/icons/columns-4";
import Rows4 from "lucide-solid/icons/rows-4";
import { ObjectTyped } from "object-typed";
import { usePinch } from "solid-gesture";
import {
  For,
  Index,
  Show,
  createContext,
  createMemo,
  createSignal,
  useContext,
  type FlowProps,
  type JSX,
  type Signal,
} from "solid-js";
import { isServer } from "solid-js/web";
import type { StrictExtract } from "ts-essentials";
import { createElementHeightRef } from "~/components/heightMeasurer";
import EventComponent, { isCustomEventData } from "~/components/scheduler/event/Event";
import type { ScheduleEvent } from "~/components/scheduler/event/types";
import { DayEventObject, type SchedulerStore } from "~/components/scheduler/store";
import { Time, TimeSpan } from "~/components/scheduler/time";
import type { DayData } from "~/components/scheduler/types";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { hoverColors } from "~/config/colors";
import { end, start } from "~/config/scheduler";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { launchDayTime } from "~/server/scraper/constants";
import type { DAY } from "~/server/scraper/enums";
import type { LinkedLectureData } from "~/server/scraper/lectureMutator";

export interface WorkScheduleProps {
  store: SchedulerStore;
}

const SchedulerStoreContext = createContext<SchedulerStore>();
const LayoutContext = createContext<Signal<boolean>>();
// export const scheduleRef: HTMLDivElement | null = null; // Reference to the schedule container
export const [scheduleRef, setScheduleRef] = createSignal<HTMLDivElement | null>(null);

function useStore() {
  const value = useContext(SchedulerStoreContext);
  if (value === undefined) {
    throw new Error("useStore must be used within a SchedulerStoreContext.Provider");
  }
  return value;
}

function useLayout() {
  const value = useContext(LayoutContext);
  if (value === undefined) {
    throw new Error("useLayout must be used within a LayoutContext.Provider");
  }
  return value;
}

export default function Scheduler(props: WorkScheduleProps) {
  const [isHorizontalLayout, setIsHorizontalLayout] = makePersisted(createSignal(true), {
    name: "schedulerLayout",
    deserialize: (value) => value === "horizontal",
    serialize: (value) => (value ? "horizontal" : "vertical"),
    storage: cookieStorage,
  });
  return (
    <SchedulerStoreContext.Provider value={props.store}>
      <LayoutContext.Provider value={[isHorizontalLayout, setIsHorizontalLayout]}>
        <SchedulerGrid />
        <div class="absolute right-0 top-0 h-14 flex items-center justify-start w-20">
          <Button onClick={() => setIsHorizontalLayout((p) => !p)} variant="outline">
            <Show when={isHorizontalLayout()} fallback={<Columns4 />}>
              <Rows4 />
            </Show>
          </Button>
        </div>
      </LayoutContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}

function SchedulerGrid() {
  const store = useStore();
  const [isHorizontalLayout] = useLayout();
  const [scale, setScale] = createSignal(isServer ? 100 : window.innerWidth < 720 ? 70 : 100);
  const [touchAction, setTouchAction] = createSignal("pan-x pan-y");

  // const setScale: typeof _setScale = (num) => requestAnimationFrame(() => _setScale(num));

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
      class="relative grid overflow-auto max-h-full h-auto w-full justify-start zoom-container transition-[font-size] ease-in-out bg-background"
      {...bind()}
      style={{
        "--scheduler-scale": `${scale()}%`,
        "touch-action": touchAction(),
        "font-size": "var(--scheduler-scale, 100%)",
        "grid-template-columns": isHorizontalLayout()
          ? `max-content repeat(${store.settings.columns.length}, minmax(5.6em, 10rem))`
          : `max-content repeat(${store.settings.rows.length}, 1fr )`,
        "grid-template-rows": isHorizontalLayout()
          ? `auto repeat(${store.settings.rows.length}, auto)`
          : `auto repeat(${store.settings.columns.length}, calc(5em))`,
      }}
    >
      <SchedulerGridInner />
    </div>
  );
}

function SchedulerGridInner() {
  const store = useStore();
  const t = useI18n().t;
  const [isHorizontalLayout] = useLayout();
  const [now] = createDateNow(1000);
  const offset = createMemo(() => {
    const nowDate = now();
    const nowSeconds = nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds();
    const startSeconds = start.hour * 3600 + start.minute * 60;
    const endSeconds = end.hour * 3600 + end.minute * 60;
    const offset = nowSeconds - startSeconds;
    return Math.min(Math.max((offset / (endSeconds - startSeconds)) * 100, 0), 100);
  });

  const hidden = createMemo(() => offset() === 0 || offset() === 100);

  const [indicatorSize, setIndicatorSize] = createSignal<string | null>("100%");
  return (
    <div class="relative grid grid-rows-subgrid grid-cols-subgrid row-span-full col-span-full border inset-0 h-full w-full isolate [font-size:inherit]">
      <Corner />
      <Show
        when={isHorizontalLayout()}
        fallback={
          <>
            <TopXAxisHeader>
              <For each={without(ObjectTyped.keys(store.settings.rows), "length") as DAY[]}>
                {(day) => (
                  <span class="items-center justify-center em:p-2 md:em:p-4 flex">{t(`scheduler.days.${day}`)}</span>
                )}
              </For>
            </TopXAxisHeader>
            <LeftYAxisHeader
              ref={createElementHeightRef(isHorizontalLayout)}
              on:click={() => {
                if (window.getSelection()?.toString()) return;
                setIndicatorSize((h) => (h === "100%" ? null : "100%"));
              }}
            >
              <For each={store.settings.columns}>
                {(column) => (
                  <Text
                    em
                    class={cn(
                      "[text-align-last:right] em:p-1 font-mono",
                      "em:text-sm font-medium leading-none !mt-0",
                      "md:em:text-base md:font-normal font-mono",
                      "!border-x first:border-l-transparent border-r-transparent"
                    )}
                  >
                    {column.title.split("\u00A0")[0]}
                  </Text>
                )}
              </For>
              <div
                class={cn("bg-red-500/30 h-px absolute !border-none", { hidden: hidden() })}
                style={{
                  "margin-top": `calc(${offset()} * var(--element-height) / 100)`,
                  width: indicatorSize() ?? "100vw",
                }}
              />
            </LeftYAxisHeader>
          </>
        }
      >
        <TopXAxisHeader
          on:click={() => {
            if (window.getSelection()?.toString()) return;
            setIndicatorSize((h) => (h === "100%" ? null : "100%"));
          }}
        >
          <For each={store.settings.columns}>
            {(column) => (
              <Text
                em
                class={cn(
                  "[text-align-last:right] em:p-1 font-mono",
                  "em:text-sm font-medium leading-none !mt-0",
                  "md:em:text-base md:font-normal font-mono",
                  "!border-x first:border-l-transparent border-r-transparent"
                )}
              >
                {column.title}
              </Text>
            )}
          </For>
          <div
            class={cn("bg-red-500/30 w-px absolute !border-none", { hidden: hidden() })}
            style={{ "margin-left": `${offset()}%`, height: indicatorSize() ?? "100vh" }}
          />
        </TopXAxisHeader>
        <LeftYAxisHeader>
          <For each={without(ObjectTyped.keys(store.settings.rows), "length") as DAY[]}>
            {(day) => <span class="items-center justify-center em:p-2 md:em:p-4 flex">{t(`scheduler.days.${day}`)}</span>}
          </For>
        </LeftYAxisHeader>
      </Show>
      <Week />
      <ColumnLines />
    </div>
  );
}

function TopXAxisHeader(props: FlowProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      class="grid grid-cols-subgrid row-span-1 col-[2/-1] outline-1 sticky top-px outline outline-border z-20 bg-background divide-x"
      {...props}
    />
  );
}

function LeftYAxisHeader(props: FlowProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      class="grid grid-rows-subgrid row-[2/-1] col-span-1 border-r sticky left-0 z-10 bg-background divide-y"
      {...props}
    />
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

function Week() {
  const store = useStore();
  const [isHorizontalLayout] = useLayout();
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
      <LaunchHighlight />
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
            <For each={data().events}>
              {(event) => (
                <div
                  style={{
                    "grid-row": isHorizontalLayout()
                      ? `${event.row} / span 1`
                      : `${event.colStart + 1} / ${event.colEnd + 2}`,
                    "grid-column": isHorizontalLayout()
                      ? `${event.colStart + 1} / ${event.colEnd + 2}`
                      : `${event.row} / span 1`,
                    "padding-inline-start": isHorizontalLayout() ? `${event.paddingStart}%` : "unset",
                    "padding-inline-end": isHorizontalLayout() ? `${event.paddingEnd}%` : "unset",
                    "padding-block-start": isHorizontalLayout()
                      ? "unset"
                      : `calc(${event.paddingStart} * var(--element-height, 0) / 100)`,
                    "padding-block-end": isHorizontalLayout()
                      ? "unset"
                      : `calc(${event.paddingEnd} * var(--element-height, 0) / 100)`,
                  }}
                  ref={createElementHeightRef(isHorizontalLayout)}
                >
                  <EventComponent event={event} store={store} />
                </div>
              )}
            </For>
          </div>
        )}
      </Index>
    </div>
  );
}

function ColumnLines() {
  const store = useStore();
  return (
    <div class="grid grid-cols-subgrid row-start-2 -row-end-1 col-[2/-1] select-none -z-30 divide-x divide-dashed">
      <For each={store.settings.columns}>{() => <div />}</For>
    </div>
  );
}

function LaunchHighlight() {
  const store = useStore();
  const [isHorizontalLayout] = useLayout();
  // semi transparent block to represent time of launch
  return ObjectTyped.entries(launchDayTime).map(([day, time]) => {
    const convertTime = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      return { hour, minute };
    };
    const timeSpan = new TimeSpan(new Time(convertTime(time.start)), new Time(convertTime(time.end)));
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

function Corner() {
  return (
    <div class="row-span-1 col-span-1 left-0  sticky top-px z-30 bg-background font-mono outline-border outline outline-1 mr-px" />
  );
}
