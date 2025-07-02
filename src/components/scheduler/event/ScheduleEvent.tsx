import Info from "lucide-solid/icons/info";
import { batch } from "solid-js";
import { EventTitle, EventWrapper, type EventProps } from "~/components/scheduler/event/Event";
import type { ScheduleEvent, ScheduleEventData } from "~/components/scheduler/event/types";
import EventPopup from "~/components/scheduler/EventInfo";
import Text from "~/components/typography/text";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import { WEEK_PARITY } from "~/server/scraper/enums";
import { useStore } from "../Scheduler";

export interface ScheduleEventProps extends EventProps {}

function formatWeeks(weeks: string | number[]) {
  if (Array.isArray(weeks)) {
    return weeks.join(". ");
  }
  return weeks;
}

export default function ScheduleEventComponent(props: ScheduleEventProps) {
  const store = useStore();
  const eventData = props.event.eventData as ScheduleEventData;
  const event = eventData.event as ScheduleEvent;

  const strongLinked = event.strongLinked.map((data) => store.getEvent(data));

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
        "!border-parityEven !border-dashed": isEven,
        "!border-parityOdd !border-dashed": isOdd,
      }}
      header={
        <>
          <EventTitle title={eventData.courseDetail.abbreviation} />
          <EventPopup
            eventData={eventData}
            onHide={() => {
              event.hidden = event.hidden === undefined ? true : !event.hidden;
            }}
          >
            <Info size={"1em"} />
          </EventPopup>
        </>
      }
    >
      <Text em variant="smallText" class="em:text-xxs truncate block text-colored-event-foreground contrast-[.25] shrink-0">
        {event.room}
      </Text>
      <div class="em:h-2 shrink-0">​</div>
      <Text em variant="smallText" class="em:text-xxs block text-ellipsis line-clamp-2 text-colored-event-foreground shrink-0">
        {formatWeeks(event.weeks.weeks)}
      </Text>
      <Text em variant="smallText" class="truncate block w-full text-colored-event-foreground shrink-0">
        {event.info}
      </Text>
      <Checkbox checked={event.checked} onChange={handleCheck} class="flex justify-center grow items-end shrink-0">
        <CheckboxControl class="em:size-4 text-colored-event-foreground light *:light" />
      </Checkbox>
    </EventWrapper>
  );
}
