import type { ClassValue } from "clsx";
import {
  createMemo,
  Match,
  splitProps,
  Switch,
  type ComponentProps,
  type FlowComponent,
  type JSX,
  type VoidComponent,
} from "solid-js";
import type { StrictOmit } from "ts-essentials";
import CustomEventComponent from "~/components/scheduler/event/CustomEvent";
import ScheduleEventComponent from "~/components/scheduler/event/ScheduleEvent";
import type { CustomEvent, CustomEventData, DayEvent, EventData, ScheduleEvent } from "~/components/scheduler/event/types";
import type { SchedulerStore } from "~/components/scheduler/store";
import Text from "~/components/typography/text";
import { subjectTypeColors } from "~/config/colors";
import { cn } from "~/lib/utils";

export interface EventProps {
  store: SchedulerStore;
  event: DayEvent;
}

export const EventTitle: VoidComponent<{ title: string }> = (props) => {
  return (
    <Text em variant="largeText" class="text-colored-event-foreground w-full truncate em:text-base md:em:text-lg">
      {props.title}
    </Text>
  );
};

interface EventWrapperProps extends EventProps, StrictOmit<ComponentProps<"div">, "class"> {
  handleCheck: () => void;
  header: JSX.Element;
  class?: ClassValue;
}
export const EventWrapper: FlowComponent<EventWrapperProps> = (props) => {
  const [local, rest] = splitProps(props, ["event", "store", "handleCheck", "header", "children"]);
  const event = local.event.eventData.event;

  const color = createMemo(() => {
    if (event.type === "CUSTOM") {
      return event.color;
    }
    return subjectTypeColors[event.type];
  });

  return (
    <div
      data-id={event.id}
      style={{ "background-color": color() }}
      on:dblclick={() => local.handleCheck()}
      {...rest}
      class={cn(
        "text-colored-event-foreground",
        "event relative w-full h-full min-h-min rounded flex flex-col items-center em:p-2 em:pt-1 *:text-center overflow-hidden",
        "outline-2 outline-offset-2 hover:outline-strongLinked hover:outline",
        rest.class
      )}
    >
      <div class="flex items-center w-full ">{local.header}</div>
      <div class="w-full *:w-full">{local.children}</div>
    </div>
  );
};

export function isCustomEventData(event: EventData): event is CustomEventData {
  return isCustomEvent(event.event);
}
export function isCustomEvent(event: ScheduleEvent | CustomEvent): event is CustomEvent {
  return event.type === "CUSTOM";
}

export default function EventComponent(props: EventProps) {
  const event = props.event;

  return (
    <Switch>
      <Match when={isCustomEventData(event.eventData)}>
        <CustomEventComponent event={event} store={props.store} />
      </Match>
      <Match when={!isCustomEventData(event.eventData)}>
        <ScheduleEventComponent event={event} store={props.store} />
      </Match>
    </Switch>
  );
}
