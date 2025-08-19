import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { without } from "es-toolkit/compat";
import { ObjectTyped } from "object-typed";
import { createMemo, createSignal, For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import type { DAY } from "~/server/scraper/enums";
import Text from "../typography/text";
import EventComponent from "./event/Event";
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

  const [isHorizontalLayout, setIsHorizontalLayout] = makePersisted(createSignal(true), {
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

  return (
    <SchedulerProvider store={props.store} layout={[isHorizontalLayout, setIsHorizontalLayout]}>
      <Scheduler>
        <SchedulerGrid>
          <>
            <Corner />
            <AxisComponents />
            <Week>
              <Days>{(day) => <Events day={day}>{(event) => <EventComponent event={event} />}</Events>}</Days>
            </Week>
            <ColumnLines />
          </>
        </SchedulerGrid>
      </Scheduler>
    </SchedulerProvider>
  );
}
