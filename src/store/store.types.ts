import type { DayEvent, ScheduleEvent } from "~/components/scheduler/event/types";
import type { DAY, LECTURE_TYPE } from "~/enums/enums";
import type { Time, TimeSpan } from "~/lib/time/time";
import type { CourseDetail } from "~/server/scraper/types/types";
import type { DayStore } from "~/store/dayStore";

export interface DayData {
  // dayRow: number;
  /** @default 1 */
  dayRows: number;
  events: DayEvent[];
}

/**
 * Indexed by day
 */
export type Data = DayStore[];
export type CourseData = ScheduleEvent[];

export type IScheduleRows = Partial<Record<DAY, number>>;

export interface IScheduleColumn {
  title: string;
  duration: TimeSpan;
}

export interface ISchedulerSettings {
  columns: IScheduleColumn[];
  rows: IScheduleRows;
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

export type CourseMetrics = Partial<Record<LECTURE_TYPE, LectureMetrics>>;

export interface Course {
  detail: CourseDetail;
  data: CourseData;
  metrics: CourseMetrics;
}

export type AnyEventType = LECTURE_TYPE | "CUSTOM";
