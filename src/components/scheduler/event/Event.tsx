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
import Text from "~/components/typography/text";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Collapsible, CollapsibleContent } from "~/components/ui/collapsible";
import { subjectTypeColors } from "~/config/colors";
import { cn } from "~/lib/utils";

export interface EventProps {
  event: DayEvent;
}

export const EventTitle: VoidComponent<{ title: string }> = (props) => {
  return (
    <Text em variant={null} class="text-colored-event-foreground w-full truncate em:text-sm md:em:text-base">
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
  const [local, rest] = splitProps(props, ["event", "handleCheck", "header", "children"]);
  const event = local.event.eventData.event;

  const color = createMemo(() => {
    if (event.type === "CUSTOM") {
      return subjectTypeColors.EXAM;
    }
    return subjectTypeColors[event.type];
  });

  return (
    <Card
      data-id={event.id}
      style={{ "background-color": color().bg, border: `2px solid ${color().border}` }}
      on:dblclick={() => {
        if (!(typeof window !== "undefined" && "ontouchstart" in window)) local.handleCheck();
      }}
      on:click={() => {
        if (typeof window !== "undefined" && "ontouchstart" in window) local.handleCheck();
      }}
      {...rest}
      class={cn(
        "event", // needed for linked outline
        "flex flex-col h-full hover:shadow-md transition-shadow overflow-auto",
        // "text-colored-event-foreground",
        // "event relative w-full h-full min-h-min rounded flex flex-col items-center em:p-2 em:pt-1 *:text-center overflow-hidden",
        "outline-2 outline-offset-2 hover:outline-strongLinked hover:outline",
        // if hidden, make the event more transparent
        event.hidden && "opacity-50 h-auto",
        rest.class
      )}
    >
      <Collapsible
        open={!(event.collapsed ||event.hidden)}
      >
        <CardHeader class="flex-row w-full p-3">{local.header}</CardHeader>
        <CollapsibleContent class={"w-full p-3 pt-0 grow flex flex-col -mt-3"} as={CardContent}>
          {local.children}
        </CollapsibleContent>
      </Collapsible>
    </Card>
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
        <CustomEventComponent event={event} />
      </Match>
      <Match when={!isCustomEventData(event.eventData)}>
        <ScheduleEventComponent event={event} />
      </Match>
    </Switch>
  );
}
