import type { Event } from "~/components/scheduler/store2";
import Text from "~/components/typography/text";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import { subjectTypeColors } from "~/config/colors";
import { cn } from "~/lib/utils";
import { ellipsis2line } from "./event.module.css";

interface EventProps {
  event: Event;
}

export default function ScheduleEvent(props: EventProps) {
  const event = props.event;
  const color = subjectTypeColors[event.type];
  return (
    <div class="relative w-full h-full min-h-min rounded flex flex-col items-center p-2 *:text-center overflow-hidden" style={{ "background-color": color }} >
      <Checkbox
        checked={props.event.checked}
        class="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none focus:ring-[1.5px] focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none "
        onChange={(e) => props.event.checked = e}
      >
        <CheckboxControl />
      </Checkbox>
      <Text variant="largeText" class="w-full">{event.abbreviation}</Text>
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