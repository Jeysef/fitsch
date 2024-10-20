import type { ParsedEvent } from "~/components/scheduler/store2";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import { subjectTypeColors } from "~/config/colors";

interface EventProps {
  event: ParsedEvent;
}

export default function ScheduleEvent(props: EventProps) {
  const { event } = props;
  const color = subjectTypeColors[event.type];
  return (
    <div class="relative w-full h-full min-h-min rounded flex flex-col items-center" style={{ "background-color": color }} >
      <Checkbox class="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none focus:ring-[1.5px] focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none ">
        <CheckboxControl />
      </Checkbox>
      <span class="w-full px-7 items-center flex justify-center">{event.abbreviation}</span>
      <span>{event.room}</span>
      <span class="text-sm">{formatWeeks(event.weeks.weeks!)}</span>
      <span>{event.info}</span>
    </div>
  )
}

function formatWeeks(weeks: string | number[]) {
  if (Array.isArray(weeks)) {
    return weeks.join(", ");
  }
  return weeks;
}