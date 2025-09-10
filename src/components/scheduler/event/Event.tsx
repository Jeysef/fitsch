import { useSearchParams } from "@solidjs/router";
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
import type { Tab } from "~/components/homepage/tab";
import CustomEventComponent from "~/components/scheduler/event/CustomEvent";
import ScheduleEventComponent from "~/components/scheduler/event/ScheduleEvent";
import Text from "~/components/typography/text";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Collapsible, CollapsibleContent } from "~/components/ui/collapsible";
import { subjectTypeColors } from "~/config/colors";
import { cn } from "~/lib/utils";
import type { CustomEvent, DayEvent, Event, ScheduleEvent } from "./types";

export interface EventProps<T extends Event = Event> {
  dayEvent: DayEvent<T>;
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
  const [local, rest] = splitProps(props, ["dayEvent", "handleCheck", "header", "children"]);
  const event = local.dayEvent.event;
  const [searchParams] = useSearchParams<Tab>();

  const color = createMemo(() => {
    if (event.type === "CUSTOM") {
      const lightBg = `hsl(from ${event.color} h s 90%)` as const;
      return {
        bg: lightBg,
        border: event.color,
      } as const;
    }
    return subjectTypeColors[event.type];
  });

  return (
    <Card
      data-id={event.id}
      style={{ "background-color": color().bg, border: `2px solid ${color().border}` }}
      on:dblclick={() => local.handleCheck()}
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
      <Collapsible open={!(event.collapsed || event.hidden)} class="group data-[expanded]:visible flex flex-col h-full">
        <CardHeader class="flex-row w-full p-3 relative space-y-0">
          {event.checked && searchParams.tab !== "resultSchedule" && (
            <div class={"absolute top-0 left-0 bottom-0 w-1 bg-green-500  group-data-[expanded]:hidden"} />
          )}
          {local.header}
        </CardHeader>
        <CollapsibleContent class={"w-full p-3 pt-0 grow flex flex-col -mt-3 h-full"} as={CardContent}>
          {local.children}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
export function isCustomDayEvent(event: DayEvent): event is DayEvent<CustomEvent> {
  return isCustomEvent(event.event);
}

export function isCustomEvent(event: Event): event is CustomEvent {
  return event.type === "CUSTOM";
}

export default function EventComponent(props: EventProps) {
  const event = props.dayEvent;

  return (
    <Switch>
      <Match when={isCustomDayEvent(event)}>
        <CustomEventComponent dayEvent={event as DayEvent<CustomEvent>} />
      </Match>
      <Match when={!isCustomDayEvent(event)}>
        <ScheduleEventComponent dayEvent={event as DayEvent<ScheduleEvent>} />
      </Match>
    </Switch>
  );
}
