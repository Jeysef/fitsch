import { Time } from "~/lib/time/time";
import { DAY } from "~/server/scraper/enums";

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
