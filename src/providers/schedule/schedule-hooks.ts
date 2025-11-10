import { useContext } from "solid-js";
import { ScheduleContext } from "~/providers/schedule/schedule-context";

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error("useSchedule must be used within an SchedulerProvider");
  return context;
}
