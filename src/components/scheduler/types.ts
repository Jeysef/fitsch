import { DAY } from "~/server/scraper/enums";


export const days = Object.values(DAY);

export const DayNumbers = {
  [DAY.MON]: 1,
  [DAY.TUE]: 2,
  [DAY.WED]: 3,
  [DAY.THU]: 4,
  [DAY.FRI]: 5,
} as const satisfies Record<DAY, number>;

export interface ISchedulerSettings {
  startHour: number;
  hourStep: number;
  endHour: number;
  columns: number;
  rows: number;
  timeBlocks: string[];
}

export type IScheduleData = Record<DAY, IScheduleDay>;

export interface IScheduleDay {
  events: IScheduleEvent[];
  rows: number;
  row: number;
}

export interface IScheduleEvent {
  name: string;
  link: string;
  dayNumber: number;
  room: string | undefined;
  start: string; // "07:00"
  end: string;
  type: string;
  row: number;
  colStart: number;
  colEnd: number;
}

// interface SchedulerConfig {
//   data: {
//     type: string;
//     color: string;
//     togglable: boolean;
//     events: {
//       start: string;
//       end: string;
//       day: DAY;
//       name: string;
//       link: string;
//       room: string;
//     }[]
//   }[]
// }