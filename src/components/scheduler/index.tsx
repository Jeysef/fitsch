import { without } from "lodash-es";
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
  useLayout,
  Week,
} from "./Scheduler";
import { For, Show } from "solid-js";
import { ObjectTyped } from "object-typed";
import type { DAY } from "~/server/scraper/enums";
import { useI18n } from "~/i18n";
import type { SchedulerStore } from "./store";
import Text from "../typography/text";
import { cn } from "~/lib/utils";
import EventComponent from "./event/Event";

export default function SchedulerComp(props: { store: SchedulerStore }) {
  const t = useI18n().t;

  const DayComp = () => (
    <For each={without(ObjectTyped.keys(props.store.settings.rows), "length") as DAY[]}>
      {(day) => <span class="items-center justify-center em:p-2 md:em:p-4 flex">{t(`scheduler.days.${day}`)}</span>}
    </For>
  );

  const TimeComponent = () => (
    <>
      <p class="!border-x first:border-l-transparent border-r-transparent" />
      <For each={props.store.settings.columns}>
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
    </>
  );

  const AxisComponents = () => {
    const [isHorizontalLayout] = useLayout();
    return (
      <>
        <TopXAxisHeader>
          <Show when={isHorizontalLayout()} fallback={<DayComp />}>
            <TimeComponent />
          </Show>
        </TopXAxisHeader>
        <LeftYAxisHeader>
          <Show when={isHorizontalLayout()} fallback={<TimeComponent />}>
            <DayComp />
          </Show>
        </LeftYAxisHeader>
      </>
    );
  };

  return (
    <SchedulerProvider store={props.store}>
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
