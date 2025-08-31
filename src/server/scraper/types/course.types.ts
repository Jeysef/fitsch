import type { DAY, LECTURE_TYPE, OBLIGATION, WEEK_PARITY } from "~/enums/enums";
import type { TimeSpan } from "~/lib/time/time";
import type { url } from "~/server/scraper/types/types";

export type CourseUrl = url;

interface CourseBase {
  name: string;
  abbreviation: string;
  url: CourseUrl;
  id: string;
}

export interface CourseOverview extends CourseBase {
  // credits: number;
  obligation: OBLIGATION;
  // completion: string;
  // faculty: string;
  // note: boolean;
}

export interface Course {
  detail: CourseDetail;
  data: Lecture[];
}

export interface CourseDetail extends CourseBase {
  timeSpan: CourseTimeSpan;
  timeSpanText: string[];
}

export type CourseTimeSpan = Partial<Record<LECTURE_TYPE, number>>;

export interface Lecture {
  day: DAY;
  type: LECTURE_TYPE;
  weeks: LectureWeeks;
  room: string[];
  timeSpan: TimeSpan;
  capacity: string;
  lectureGroup: string[];
  groups: string;
  info: string;
  note: string | null;
}

export type LectureWeeks = {
  weeks: string | number[];
  parity: WEEK_PARITY | null;
} & {
  calculated?: boolean | undefined;
};
