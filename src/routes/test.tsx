import { createEffect } from "solid-js";
import Scheduler from "~/components/scheduler/index";
import { useSchedule } from "~/providers/schedule/schedule-hooks";

// export default function () {
//   const formatTime = (start: Time, end: Time) =>
//     `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}–${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;

//   // Filter function to exclude certain lecture types (e.g., exams, notes) from the main schedule display
//   const filter = (event: LectureMutator.MutatedLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);

//   // Define the rows for the scheduler grid, mapping days to row numbers
//   const rows = zipObject(days, range(1, days.length + 1)) as IScheduleRow;

//   // Generate the columns based on configured start/end times and step duration
//   const columns = createColumns({
//     start,
//     step,
//     end,
//     getTimeHeader: formatTime,
//   });
//   return <Scheduler store={new SchedulerStore({ columns, rows }, filter)} />;
// }

export default function () {
  const { store } = useSchedule();

  createEffect(() => {
    console.log("🚀 ~ test ~ store courses changed:", store.courses);
  });
  createEffect(() => {
    console.log("🚀 ~ test ~ store changed:", store.data);
  });
  return <Scheduler store={store} />;
}
