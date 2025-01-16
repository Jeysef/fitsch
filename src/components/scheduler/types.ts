import type { DayEvent, ScheduleEvent } from "~/components/scheduler/event/types";
import type { Time, TimeSpan } from "~/components/scheduler/time";
import type { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type { CourseDetail } from "~/server/scraper/types";

export interface DayData {
  dayRow: number;
  /** @default 1 */
  dayRows: number;
  events: DayEvent[];
}

export type Data = Record<DAY, DayData>;
export type CourseData = ScheduleEvent[];

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
  start: Time;
  step: Time;
  end: Time;
  getTimeHeader: (start: Time, end: Time) => string;
}

export interface LectureMetrics {
  weeks: number;
  weeklyLectures: number;
}
export interface Course {
  detail: CourseDetail;
  data: CourseData;
  metrics: Record<LECTURE_TYPE, LectureMetrics>;
}
