import Scheduler from "~/components/scheduler";
import type { SchedulerStore } from "~/components/scheduler/store";

export default function WorkSchedule({ store }: { store: SchedulerStore }) {
  // class schedulerSettings {
  //   static readonly startHour = 7;
  //   static readonly hourStep = 1;
  //   static readonly endHour = 20;
  //   static readonly columns = (this.endHour - this.startHour) / this.hourStep;
  //   static readonly rows = 5; // days of the week
  //   static readonly timeBlocks = Array.from({ length: this.columns }, (_, i) => {
  //     const hour = i + this.startHour;
  //     return `${hour}:00 - ${hour + this.hourStep}:00`;
  //   });
  // }
  // // TODO: temporary
  // const workData = formatData(schedulerSettings, getData());
  return (
    <Scheduler store={store} />
  )
}