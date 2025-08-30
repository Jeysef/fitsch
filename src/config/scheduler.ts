import { DAY } from "~/enums/enums";
import { Time } from "~/lib/time/time";

export const start = new Time({ hour: 7, minute: 0 });
export const step = new Time({ hour: 1, minute: 0 });
export const end = new Time({ hour: 21, minute: 0 });
export const days: DAY[] = [DAY.MON, DAY.TUE, DAY.WED, DAY.THU, DAY.FRI];

export const LAUNCH_DAY_TIME = {
  [DAY.MON]: { start: "11:00", end: "14:30" },
  [DAY.TUE]: { start: "11:00", end: "14:30" },
  [DAY.WED]: { start: "11:00", end: "14:30" },
  [DAY.THU]: { start: "11:00", end: "14:30" },
  [DAY.FRI]: { start: "11:00", end: "14:00" },
};

// Define the rows for the scheduler grid, mapping days to row numbers
export const rows = {
  [DAY.MON]: 1,
  [DAY.TUE]: 2,
  [DAY.WED]: 3,
  [DAY.THU]: 4,
  [DAY.FRI]: 5,
};
