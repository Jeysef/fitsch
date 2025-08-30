import type { DAY } from "~/enums/enums";
import type { TimeSpan } from "~/lib/time/time";
import type { LectureMutator } from "~/server/scraper/lectureMutator";

export interface EventBase {
  id: string;
  day: DAY;
  timeSpan: TimeSpan;
  title: string;
  info: string;
  /** @default false */
  checked: boolean;
  /** @default false (undefined) */
  hidden?: boolean | undefined;
  /** @default false (undefined) */
  collapsed?: boolean | undefined;
}

export interface CustomEvent extends EventBase {
  color: string;
  type: "CUSTOM";
}

export type Event = CustomEvent | ScheduleEvent;

export interface ScheduleEvent extends EventBase, LectureMutator.MutatedLecture {
  courseId: string;
}

export interface DayEventWORow<T extends Event = Event> {
  colStart: number;
  colEnd: number;
  paddingStart: number;
  paddingEnd: number;
  event: T;
}

export interface DayEvent<T extends Event = Event> extends DayEventWORow<T> {
  /** @default 1 */
  row: number;
}
