import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { without } from "es-toolkit/compat";
import { ObjectTyped } from "object-typed";
import { createMemo, createSignal, For, Show } from "solid-js";
import EventSkeleton from "~/components/scheduler/event/EventSkeleton";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { DAY } from "~/server/scraper/enums";
import Text from "../typography/text";
import {
  ColumnLines,
  Corner,
  Days,
  Events,
  LeftYAxisHeader,
  Scheduler,
  SchedulerGrid,
  SchedulerProvider,
  TopXAxisHeader,
  Week,
} from "./Scheduler";
import type { SchedulerStore } from "./store";

export default function SchedulerComp(props: { store: SchedulerStore }) {
  const t = useI18n().t;

  const [isHorizontalLayout] = makePersisted(createSignal(true), {
    name: "schedulerLayout",
    deserialize: (value) => value === "horizontal",
    serialize: (value) => (value ? "horizontal" : "vertical"),
    storage: cookieStorage,
  });

  const DayComp = createMemo(() => (
    <For each={without(ObjectTyped.keys(props.store.settings.rows), "length") as DAY[]}>
      {(day) => <span class="items-center justify-center em:p-2 md:em:p-4 flex">{t(`scheduler.days.${day}`)}</span>}
    </For>
  ));

  const TimeComponent = createMemo(() => (
    <>
      <p class="" />
      <For each={props.store.settings.columns}>
        {(column) => (
          <Text
            em
            class={cn(
              "[text-align-last:right] em:p-1 font-mono",
              "em:text-sm font-medium leading-none !mt-0",
              "md:em:text-base md:font-normal font-mono",
              ""
            )}
          >
            {column.title}
          </Text>
        )}
      </For>
    </>
  ));

  const AxisComponents = createMemo(() => (
    <Show
      when={isHorizontalLayout()}
      fallback={
        <>
          <TopXAxisHeader>
            <DayComp />
          </TopXAxisHeader>
          <LeftYAxisHeader>
            <TimeComponent />
          </LeftYAxisHeader>
        </>
      }
    >
      <TopXAxisHeader>
        <TimeComponent />
      </TopXAxisHeader>
      <LeftYAxisHeader>
        <DayComp />
      </LeftYAxisHeader>
    </Show>
  ));

  const storeProxy = new Proxy(props.store, {
    get(store, prop) {
      if (prop === "data") return mockData;
      // Forward all other property access to original store
      // @ts-expect-error prop is a string
      return store[prop];
    },
    set(store, prop, value) {
      // Forward all property sets to original store
      // @ts-expect-error prop is a string
      store[prop] = value;
      return true;
    },
  });

  return (
    <SchedulerProvider store={storeProxy} layout={[isHorizontalLayout, () => void 0]}>
      <Scheduler>
        <SchedulerGrid>
          <>
            <Corner />
            <AxisComponents />
            <Week>
              <Days>{(day) => <Events day={day}>{() => <EventSkeleton />}</Events>}</Days>
            </Week>
            <ColumnLines />
          </>
        </SchedulerGrid>
      </Scheduler>
    </SchedulerProvider>
  );
}

const mockData = {
  MON: {
    dayRow: 1,
    dayRows: 1,
    events: [
      {
        row: 1,
        colStart: 13,
        colEnd: 15,
        paddingStart: 0,
        paddingEnd: 8,
        eventData: {
          event: {
            linked: [],
            strongLinked: [],
            id: "83",
          },
        },
      },
      {
        row: 1,
        colStart: 3,
        colEnd: 5,
        paddingStart: 0,
        paddingEnd: 4,
        eventData: {
          event: {
            linked: [],
            strongLinked: [],
            id: "4",
          },
        },
      },
    ],
  },
  TUE: {
    dayRow: 2,
    dayRows: 1,
    events: [
      {
        row: 1,
        colStart: 1,
        colEnd: 2,
        paddingStart: 0,
        paddingEnd: 3,
        eventData: {
          event: {
            linked: [],
            strongLinked: [],
            id: "47",
          },
        },
      },
      {
        row: 1,
        colStart: 6,
        colEnd: 7,
        paddingStart: 0,
        paddingEnd: 9,
        eventData: {
          event: {
            linked: [],
            strongLinked: [],
            id: "100",
          },
        },
      },
    ],
  },
  WED: {
    dayRow: 3,
    dayRows: 1,
    events: [
      {
        row: 1,
        colStart: 7,
        colEnd: 8,
        paddingStart: 0,
        paddingEnd: 4,
        eventData: {
          event: {
            linked: [],
            strongLinked: [],
            id: "31",
          },
        },
      },
      {
        row: 1,
        colStart: 3,
        colEnd: 5,
        paddingStart: 0,
        paddingEnd: 6,
        eventData: {
          event: {
            linked: [],
            strongLinked: [],
            id: "81",
          },
        },
      },
    ],
  },
  THU: {
    dayRow: 4,
    dayRows: 1,
    events: [
      {
        row: 1,
        colStart: 11,
        colEnd: 13,
        paddingStart: 0,
        paddingEnd: 9,
        eventData: {
          event: {
            linked: [],
            strongLinked: [],
            id: "92",
          },
        },
      },
    ],
  },
  FRI: {
    dayRow: 5,
    dayRows: 1,
    events: [
      {
        row: 1,
        colStart: 8,
        colEnd: 10,
        paddingStart: 0,
        paddingEnd: 4,
        eventData: {
          event: {
            linked: [],
            strongLinked: [],
            id: "23",
          },
        },
      },
    ],
  },
};
