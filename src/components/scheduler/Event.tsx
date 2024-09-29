import type { IScheduleEvent } from "~/components/scheduler/types";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";

interface EventProps {
  event: IScheduleEvent;
}

export default function ScheduleEvent(props: EventProps) {
  const { event } = props;
  return (
    <div class="relative w-full h-auto min-h-16 rounded flex flex-col items-center bg-blue-300" >
      <Checkbox class="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none focus:ring-[1.5px] focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none ">
        <CheckboxControl />
      </Checkbox>
      <span class="w-full px-7 items-center flex justify-center">{event.name}</span>
      <span>{event.room}</span>
      <span>weeks</span>
      <span>Teacher</span>
    </div>
  )
}