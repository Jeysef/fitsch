import Info from "lucide-solid/icons/info";
import { batch } from "solid-js";
import { EventTitle, EventWrapper, type EventProps } from "~/components/scheduler/event/Event";
import type { ScheduleEvent, ScheduleEventData } from "~/components/scheduler/event/types";
import EventPopup from "~/components/scheduler/EventInfo";
import Text from "~/components/typography/text";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import { WEEK_PARITY } from "~/server/scraper/enums";

export interface ScheduleEventProps extends EventProps {}

function formatWeeks(weeks: string | number[]) {
  if (Array.isArray(weeks)) {
    return weeks.join(". ");
  }
  return weeks;
}

export default function ScheduleEventComponent(props: ScheduleEventProps) {
  const eventData = props.event.eventData as ScheduleEventData;
  const event = eventData.event as ScheduleEvent;

  const strongLinked = event.strongLinked.map((data) => props.store.getEvent(data));

  const handleCheck = (checked?: boolean) => {
    batch(() => {
      const toBeChecked = checked ?? !event.checked;
      event.checked = toBeChecked;
      for (const linkedEvent of strongLinked) {
        if (linkedEvent) {
          linkedEvent.checked = toBeChecked;
        }
      }
    });
  };

  const isOdd = event.weeks.parity === WEEK_PARITY.ODD;
  const isEven = event.weeks.parity === WEEK_PARITY.EVEN;

  return (
    <EventWrapper
      handleCheck={handleCheck}
      {...props}
      class={{
        "border-parityEven border-dashed border-2": isEven,
        "border-parityOdd border-dashed border-2": isOdd,
      }}
      header={
        <>
          <EventPopup eventData={eventData}>
            <Info size={"1em"} />
          </EventPopup>
          <EventTitle title={eventData.courseDetail.abbreviation} />
          <Checkbox checked={event.checked} onChange={handleCheck}>
            <CheckboxControl class="em:size-4 text-colored-event-foreground light *:light" />
          </Checkbox>
        </>
      }
    >
      <>
        <Text em variant="smallText" class="block text-colored-event-foreground">
          {event.room}
        </Text>
        <Text em variant="smallText" class="wm:text-xxs hidden md:block text-colored-event-foreground">
          ​
        </Text>
        <Text em variant="smallText" class="em:text-xxs block text-ellipsis line-clamp-2 text-colored-event-foreground">
          {formatWeeks(event.weeks.weeks)}
        </Text>
        <Text em variant="smallText" class="truncate block w-full text-colored-event-foreground">
          {event.info}
        </Text>
      </>
    </EventWrapper>
  );
}
