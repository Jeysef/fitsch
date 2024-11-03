import type { DAY } from "~/server/scraper/enums";
import type { DataProviderTypes } from "~/server/scraper/types";


export type Event = Omit<DataProviderTypes.getStudyCoursesDetailsReturn[number]["data"][number], "start" | "end"> & TimeFrame & {
  abbreviation: string;
  name: string;
  link: string;
  id: string;
  /** @default false */
  checked: boolean;
};
export interface DayEvent {
  /** @default 1 */
  row: number;
  colStart: number;
  colEnd: number;
  paddingStart: number;
  paddingEnd: number;
  event: Event;
}
export interface DayData {
  dayRow: number;
  /** @default 1 */
  dayRows: number;
  events: DayEvent[];
}

export type Data = Record<DAY, DayData>;
export interface TimeFrame {
  start: ISchedulerTime;
  end: ISchedulerTime;
}export interface ISchedulerTime {
  hour: number;
  minute: number;
}
interface IScheduleRow {
  title: string;
  day: DAY;
}
export interface IScheduleColumn {
  title: string;
  start: ISchedulerTime;
  end: ISchedulerTime;
}
interface IScheduleDimensions {
  width: {
    min: string | "auto";
    max: string | "auto";
  } | string;
  height: {
    min: string | "auto";
    max: string | "auto";
  } | string;
}

export interface ISchedulerSettings {
  blockDimensions?: Partial<IScheduleDimensions>;
  columns: IScheduleColumn[];
  rows: IScheduleRow[];
  filter?: (event: Event) => boolean;
}
export interface ICreateColumns {
  start: ISchedulerTime;
  step: ISchedulerTime;
  /**
   * if end is less than last closest step, the end of the step will be used
   */
  end: ISchedulerTime;
  getTimeHeader: (start: ISchedulerTime, end: ISchedulerTime) => string;
}

