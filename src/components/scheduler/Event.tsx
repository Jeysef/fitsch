import Info from "lucide-solid/icons/info";
import { batch, createMemo } from "solid-js";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import { subjectTypeColors } from "~/config/colors";
import { cn } from "~/lib/utils";
import { WEEK_PARITY, type DAY } from "~/server/scraper/enums";
import { ellipsis2line } from "./event.module.css";
import type { Data, Event, ISchedulerSettings } from "./types";

interface EventProps {
  event: Event;
  store: {
    settings: ISchedulerSettings;
    data: Data;
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

  const handleCheck = (checked?: boolean) => {
    batch(() => {
      props.event.checked = checked ?? !props.event.checked;
      // check linked events
      if (event.linked) {
        for (const linked of event.strongLinked) {
          const event = getLinkedEvent(linked);
          event && (event.event.checked = props.event.checked);
        }
      }
    })
  }
  const isOdd = createMemo(() => event.weeks.parity === WEEK_PARITY.ODD)
  const isEven = createMemo(() => event.weeks.parity === WEEK_PARITY.EVEN)

  return (
    <div
      class={cn(
        "event relative w-full h-full min-h-min rounded flex flex-col items-center p-2 pt-1 *:text-center overflow-hidden",
        "outline-2 outline-offset-2 hover:outline-strongLinked hover:outline",
        {
          "border-red-500 border-dashed border-2": isEven(),
          "border-blue-500 border-dashed border-2": isOdd(),
        }
      )}
      data-id={event.id}
      style={{ "background-color": color }}
      ondblclick={() => handleCheck()}
    >
      <div class="flex items-center w-full ">
        <Button size={null} variant={null}><Info size={16} /></Button>
        <Text variant="largeText" class="w-full truncate">{event.courseDetail.abbreviation}</Text>
        <Checkbox
          checked={props.event.checked}
          onChange={handleCheck}
        >
          <CheckboxControl />
        </Checkbox>
      </div>
      <div class="w-full *:w-full">
        <Text variant="smallText" class="block">{event.room}</Text>
        <Text variant="smallText" class="text-xxs block">​</Text>
        <Text variant="smallText" class={cn(ellipsis2line, "text-xxs block")}>{formatWeeks(event.weeks.weeks)}</Text>
        <Text variant="smallText" class="truncate block w-full">{event.info}</Text>
      </div>
    </div>
  )
}

function formatWeeks(weeks: string | number[]) {
  if (Array.isArray(weeks)) {
    return weeks.join(". ");
  }
  return weeks;
}