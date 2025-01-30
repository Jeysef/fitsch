import { css } from "@emotion/css";
import { compact, difference, flatMap, flow, merge, values } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { usePinch } from "solid-gesture";
import { For, Index, createContext, createMemo, createSignal, useContext } from "solid-js";
import { isServer } from "solid-js/web";
import { animated, createSpring } from "solid-spring";
import type { StrictExtract } from "ts-essentials";
import EventComponent, { isCustomEventData } from "~/components/scheduler/event/Event";
import type { ScheduleEvent } from "~/components/scheduler/event/types";
import { type SchedulerStore, getDayEventData } from "~/components/scheduler/store";
import { Time, TimeSpan } from "~/components/scheduler/time";
import type { DayData } from "~/components/scheduler/types";
import Text from "~/components/typography/text";
import { hoverColors } from "~/config/colors";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { launchDayTime } from "~/server/scraper/constants";
import type { LinkedLectureData } from "~/server/scraper/lectureMutator";

export interface WorkScheduleProps {
  store: SchedulerStore;
}

const SchedulerStoreContext = createContext<SchedulerStore>();
// export const scheduleRef: HTMLDivElement | null = null; // Reference to the schedule container
export const [scheduleRef, setScheduleRef] = createSignal<HTMLDivElement | null>(null);

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
  const [scale, setScale] = createSignal(isServer ? 100 : window.innerWidth < 720 ? 70 : 100);
  const [touchAction, setTouchAction] = createSignal("pan-x pan-y");

  const styles = createSpring(() => ({
    "--scheduler-scale": `${scale()}%`,
    "touch-action": touchAction(),
    config: {
      tension: 500,
      friction: 43,
      precision: 0.05,
    },
  }));

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
      rubberband: true,
      // pointer: { touch: true },
      eventOptions: { passive: true },
    }
  );

  const InnerComponent = createMemo(() => (
    <div class="relative grid grid-rows-subgrid grid-cols-subgrid row-span-full col-span-full border inset-0 h-full w-full isolate [font-size:inherit]">
      <Corner />
      <Heading />
      <Days />
      <Week />
      <ColumnLines />
    </div>
  ));

  return (
    <animated.div
      ref={setScheduleRef}
      class="relative grid overflow-auto max-h-full h-auto w-full justify-start zoom-container transition-[font-size] ease-in-out bg-background"
      {...bind()}
      style={merge(styles(), {
        "font-size": "var(--scheduler-scale, 100%)",
        "grid-template-columns": `max-content repeat(${store.settings.columns.length}, minmax(5.6em, 10rem))`,
        "grid-template-rows": `auto repeat(${store.settings.rows.length}, auto)`,
      })}
    >
      {/* @ts-ignore */}
      <InnerComponent />
    </animated.div>
  );
}

function Heading() {
  const store = useStore();
  return (
    <div class="grid grid-cols-subgrid row-span-1 col-[2/-1] outline-1 sticky top-px outline outline-border z-20 bg-background font-mono">
      <For each={store.settings.columns}>
        {(column) => (
          <Text
            em
            class={cn(
              "[text-align-last:right] em:p-1 font-mono",
              "em:text-sm font-medium leading-none !mt-0",
              "md:em:text-base md:font-normal",
              "border-x first:border-l-transparent border-r-transparent"
            )}
          >
            {column.title}
          </Text>
        )}
      </For>
    </div>
  );
}

function Days() {
  const t = useI18n().t;
  const store = useStore();
  return (
    <div class="grid grid-rows-subgrid row-[2/-1] col-span-1 border-r sticky left-0 z-10 bg-background divide-y">
      <For each={store.settings.rows}>
        {(day) => <span class="items-center justify-center em:p-2 md:em:p-4 flex">{t(`scheduler.days.${day.day}`)}</span>}
      </For>
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

function Week() {
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
      <LaunchHighlight />
      <Index each={storeData()}>
        {(data) => (
          <div
            class="schedule-row grid grid-cols-subgrid col-span-full em:py-2 em:gap-y-4 border-t [font-size:inherit]"
            style={{
              "grid-row": `${data().dayRow} / span 1`,
              "grid-template-rows": `repeat(${data().dayRows}, minmax(0, auto))`,
            }}
          >
            <For each={data().events}>
              {(event) => (
                <div
                  style={{
                    "grid-row": `${event.row} / span 1`,
                    "grid-column": `${event.colStart + 1} / ${event.colEnd + 2}`,
                    "padding-inline-start": `${event.paddingStart}%`,
                    "padding-inline-end": `${event.paddingEnd}%`,
                  }}
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
  // semi transparent block to represent time of launch
  return ObjectTyped.entries(launchDayTime).map(([day, time]) => {
    const convertTime = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      return { hour, minute };
    };
    const timeSpan = new TimeSpan(new Time(convertTime(time.start)), new Time(convertTime(time.end)));
    const row = store.settings.rows.findIndex((row) => row.day === day) + 1;
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
    );
  });
}

function Corner() {
  return (
    <div class="row-span-1 col-span-1 left-0  sticky top-px z-30 bg-background font-mono outline-border outline outline-1 mr-px" />
  );
}
