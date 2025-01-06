import type { TimeSpan } from "~/components/scheduler/time";
import type { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";
import type { CourseDetail } from "~/server/scraper/types";

export type Event = Omit<MCourseLecture, "start" | "end"> & {
  courseDetail: CourseDetail;
  metrics: LectureMetrics;
  timeSpan: TimeSpan;
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
export interface ISchedulerTime {
  hour: number;
  minute: number;
}
interface IScheduleRow {
  day: DAY;
}
export interface IScheduleColumn {
  title: string;
  duration: TimeSpan;
}
interface IScheduleDimensionsSize {
  min: string | "auto";
  max: string | "auto";
}
interface IScheduleDimensions {
  width: IScheduleDimensionsSize | string;
  height: IScheduleDimensionsSize | string;
}

export interface ISchedulerSettings {
  blockDimensions?: Partial<IScheduleDimensions>;
  columns: IScheduleColumn[];
  rows: IScheduleRow[];
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

export interface LectureMetrics {
  weeks: number;
  weeklyLectures: number;
}
export interface CourseData {
  detail: CourseDetail;
  data: Data;
  metrics: Partial<Record<LECTURE_TYPE, LectureMetrics>>;
}
