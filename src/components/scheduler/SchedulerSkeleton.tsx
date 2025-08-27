import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { ObjectTyped } from "object-typed";
import { createMemo, createSignal, For, Show } from "solid-js";
import EventSkeleton from "~/components/scheduler/event/EventSkeleton";
import { useI18n } from "~/i18n";
import { ClassRegistry } from "~/lib/classRegistry/classRegistry";
import { cn } from "~/lib/utils";
import type { SchedulerStore } from "~/store/store";
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

const mockData = `[
  {
    "dayRows": 1,
    "events": [
      {
        "colStart": 2,
        "colEnd": 3,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "MON",
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 8,
        "colEnd": 9,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "MON",
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 10,
        "colEnd": 11,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "MON",
          "strongLinked": [],
          "linked": []
        }
      }
    ],
    "day": "MON",
    "dayRow": 1
  },
  {
    "dayRows": 2,
    "events": [
      {
        "colStart": 1,
        "colEnd": 2,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "LECTURE",
          "day": "TUE",
          "lecturesCount": 13,
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 2,
        "colEnd": 3,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 2,
        "event": {
          "type": "EXERCISE",
          "day": "TUE",
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 4,
        "colEnd": 5,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "TUE",
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 5,
        "colEnd": 6,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 2,
        "event": {
          "type": "LECTURE",
          "day": "TUE",
          "lecturesCount": 13,
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 6,
        "colEnd": 7,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "TUE",
          "strongLinked": [],
          "linked": []
        }
      }
    ],
    "day": "TUE",
    "dayRow": 2
  },
  {
    "dayRows": 1,
    "events": [
      {
        "colStart": 2,
        "colEnd": 3,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "WED",
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 4,
        "colEnd": 5,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "WED",
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 7,
        "colEnd": 8,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "WED",
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 9,
        "colEnd": 10,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "WED",
          "strongLinked": [],
          "linked": []
        }
      }
    ],
    "day": "WED",
    "dayRow": 3
  },
  {
    "dayRows": 1,
    "events": [
      {
        "colStart": 3,
        "colEnd": 4,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "THU",
          "strongLinked": [],
          "linked": []
        }
      }
    ],
    "day": "THU",
    "dayRow": 4
  },
  {
    "dayRows": 1,
    "events": [
      {
        "colStart": 5,
        "colEnd": 6,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "FRI",
          "strongLinked": [],
          "linked": []
        }
      },
      {
        "colStart": 7,
        "colEnd": 8,
        "paddingStart": 0,
        "paddingEnd": 8.33,
        "row": 1,
        "event": {
          "type": "EXERCISE",
          "day": "FRI",
          "strongLinked": [],
          "linked": []
        }
      }
    ],
    "day": "FRI",
    "dayRow": 5
  }
]`;

export default function SchedulerSkeleton(props: { store: SchedulerStore }) {
  const t = useI18n().t;

  const [isHorizontalLayout] = makePersisted(createSignal(true), {
    name: "schedulerLayout",
    deserialize: (value) => value === "horizontal",
    serialize: (value) => (value ? "horizontal" : "vertical"),
    storage: cookieStorage,
  });

  const DayComp = createMemo(() => (
    <For each={ObjectTyped.keys(props.store.settings.rows)}>
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

  const data = JSON.parse(mockData, ClassRegistry.reviver);

  const storeProxy = new Proxy(props.store, {
    get(store, prop) {
      if (prop === "data") return data;
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
