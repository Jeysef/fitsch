import Info from "lucide-solid/icons/info";
import { batch, createMemo } from "solid-js";
import EventPopup from "~/components/scheduler/EventInfo";
import Text from "~/components/typography/text";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import { subjectTypeColors } from "~/config/colors";
import { cn } from "~/lib/utils";
import { type DAY, WEEK_PARITY } from "~/server/scraper/enums";
import type { Data, Event, ISchedulerSettings } from "./types";

interface EventProps {
  event: Event;
  store: {
    settings: ISchedulerSettings;
    data: Data;
  };
}

export default function ScheduleEvent(props: EventProps) {
  const store = props.store;
  const event = props.event;
  const color = subjectTypeColors[event.type];
  const getLinkedEvent = (linked: {
    id: string;
    day: DAY;
  }) => {
    return store.data[linked.day].events.find((e) => e.event.id === linked.id);
  };

  const handleCheck = (checked?: boolean) => {
    batch(() => {
      props.event.checked = checked ?? !props.event.checked;
      // check linked events
      if (event.linked) {
        for (const linked of event.strongLinked) {
          const event = getLinkedEvent(linked);
          if (event) {
            event.event.checked = props.event.checked;
          }
        }
      }
    });
  };
  const isOdd = createMemo(() => event.weeks.parity === WEEK_PARITY.ODD);
  const isEven = createMemo(() => event.weeks.parity === WEEK_PARITY.EVEN);

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
        <EventPopup event={event}>
          <Info size={16} />
        </EventPopup>
        <Text variant="largeText" class="w-full truncate text-base md:text-lg">
          {event.courseDetail.abbreviation}
        </Text>
        <Checkbox checked={props.event.checked} onChange={handleCheck}>
          <CheckboxControl />
        </Checkbox>
      </div>
      <div class="w-full *:w-full">
        <Text variant="smallText" class="block">
          {event.room}
        </Text>
        <Text variant="smallText" class="text-xxs hidden md:block">
          ​
        </Text>
        <Text variant="smallText" class="text-xxs block text-ellipsis line-clamp-2">
          {formatWeeks(event.weeks.weeks)}
        </Text>
        <Text variant="smallText" class="truncate block w-full">
          {event.info}
        </Text>
      </div>
    </div>
  );
}

function formatWeeks(weeks: string | number[]) {
  if (Array.isArray(weeks)) {
    return weeks.join(". ");
  }
  return weeks;
}
