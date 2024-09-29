import { getData } from "~/components/homepage/data";
import { formatData } from "~/components/homepage/parser";
import Scheduler from "~/components/scheduler";
import ScheduleEvent from "~/components/scheduler/Event";

export default function WorkSchedule() {
  class schedulerSettings {
    static readonly startHour = 7;
    static readonly hourStep = 1;
    static readonly endHour = 20;
    static readonly columns = (this.endHour - this.startHour) / this.hourStep;
    static readonly rows = 5; // days of the week
    static readonly timeBlocks = Array.from({ length: this.columns }, (_, i) => {
      const hour = i + this.startHour;
      return `${hour}:00 - ${hour + this.hourStep}:00`;
    });
  }
  // TODO: temporary
  const workData = formatData(schedulerSettings, getData());
  return (
    <Scheduler data={workData} scheduleSettings={schedulerSettings} event={ScheduleEvent} />
  )
}