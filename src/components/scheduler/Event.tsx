import type { Event, ISchedulerSettings, ParsedDayData } from "~/components/scheduler/store";
import Text from "~/components/typography/text";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import { subjectTypeColors } from "~/config/colors";
import { cn } from "~/lib/utils";
import type { DAY } from "~/server/scraper/enums";
import { ellipsis2line } from "./event.module.css";

interface EventProps {
  event: Event;
  store: {
    settings: ISchedulerSettings;
    data: ParsedDayData;
  }
}

export default function ScheduleEvent(props: EventProps) {
  const store = props.store
  const event = props.event;
  const color = subjectTypeColors[event.type];
  const getLinkedEvent = (linked: {
    id: string;
    day: DAY;
  }) => {
    return store.data[linked.day].events.find((e) => e.event.id === linked.id)
  }

  const handleCheck = (e: boolean) => {
    props.event.checked = e;
    // check linked events
    if (event.linked) {
      for (const linked of event.linked) {
        const event = getLinkedEvent(linked);
        event && (event.event.checked = e);
      }
    }
  }
  const handleHover = (is: boolean) => {
    props.event.hovered = is;
    console.log("is hovered")
    if (event.linked) {
      for (const linked of event.linked) {
        const event = getLinkedEvent(linked);
        event && (event.event.hovered = is);
      }
    }
  }
  // console.log("🚀 ~ file: Event.tsx:27 ~ ScheduleEvent ~ event.linked:", event.linked)
  return (
    <div class={cn("relative w-full h-full min-h-min rounded flex flex-col items-center p-2 *:text-center overflow-hidden", { "outline outline-orange-500 outline-2 outline-offset-2": props.event.hovered })} style={{ "background-color": color }}
      onmouseover={() => handleHover(true)}
      onmouseout={() => handleHover(false)}
      ondblclick={() => handleCheck(!props.event.checked)}
    >
      <Checkbox
        checked={props.event.checked}
        class="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none focus:ring-[1.5px] focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none "
        onChange={handleCheck}
      >
        <CheckboxControl />
      </Checkbox>
      <Text variant="largeText" class="w-full">{event.abbreviation}</Text>
      {/* <Text variant="smallText">{event.id}</Text> */}
      {/* <Text variant="smallText">{event.linked?.join(",")}</Text> */}
      <Text variant="smallText">{event.room}</Text>
      <div class="flex flex-1" />
      <Text variant="smallText" class={cn(ellipsis2line, "text-xs")}>{formatWeeks(event.weeks.weeks)}</Text>
      <Text variant="smallText" class={"text-ellipsis overflow-hidden whitespace-nowrap w-full"}>{event.info}</Text>
    </div>
  )
}

function formatWeeks(weeks: string | number[]) {
  if (Array.isArray(weeks)) {
    return weeks.join(". ");
  }
  return weeks;
}