import { Time } from "~/components/scheduler/time";
import { DAY } from "~/server/scraper/enums";

export const start = new Time({ hour: 7, minute: 0 });
export const step = new Time({ hour: 1, minute: 0 });
export const end = new Time({ hour: 21, minute: 0 });
export const days: DAY[] = [DAY.MON, DAY.TUE, DAY.WED, DAY.THU, DAY.FRI];
