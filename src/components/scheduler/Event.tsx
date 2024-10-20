import type { ParsedEvent } from "~/components/scheduler/store2";
import Text from "~/components/typography/text";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import { subjectTypeColors } from "~/config/colors";
import { ellipsis2line } from "./event.module.css";
import { cn } from "~/lib/utils";

interface EventProps {
  event: ParsedEvent;
}

export default function ScheduleEvent(props: EventProps) {
  const { event } = props;
  const color = subjectTypeColors[event.type];
  return (
    <div class="relative w-full h-full min-h-min rounded flex flex-col items-center p-2 *:text-center overflow-hidden" style={{ "background-color": color }} >
      <Checkbox class="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none focus:ring-[1.5px] focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none ">
        <CheckboxControl />
      </Checkbox>
      <Text variant="largeText" class="w-full px-7">{event.abbreviation}</Text>
      <Text variant="smallText">{event.room}</Text>
      <div class="flex flex-1" />
      <Text variant="smallText" class={cn(ellipsis2line, "text-xs")}>{formatWeeks(event.weeks.weeks!)}</Text>
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