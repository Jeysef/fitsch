import type { TimeSpan } from "~/components/scheduler/time";
import type { LectureMetrics } from "~/components/scheduler/types";
import type { DAY } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";
import type { CourseDetail } from "~/server/scraper/types";

export interface EventBase {
  id: string;
  day: DAY;
  timeSpan: TimeSpan;
  info: string;
  /** @default false */
  checked: boolean;
  /** @default false (undefined) */
  hidden?: boolean;
}

export interface CustomEvent extends EventBase {
  title: string;
  color: string;
  type: "CUSTOM";
}

export type Event = CustomEvent | ScheduleEvent;

export interface CustomEventData {
  event: CustomEvent;
}

export interface ScheduleEvent extends EventBase, MCourseLecture {}

export interface ScheduleEventData {
  event: ScheduleEvent;
  courseDetail: CourseDetail;
  metrics: LectureMetrics;
}

export type EventData = ScheduleEventData | CustomEventData;

export interface DayEvent {
  /** @default 1 */
  row: number;
  colStart: number;
  colEnd: number;
  paddingStart: number;
  paddingEnd: number;
  eventData: EventData;
}
