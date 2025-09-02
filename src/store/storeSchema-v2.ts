import * as v from "valibot";
import { DAY, LECTURE_TYPE, WEEK_PARITY } from "~/enums/enums";
import { TimeSpan } from "~/lib/time/time";

const timespanSchema = v.instance(TimeSpan);

const linkedLectureDataSchema = v.object({
  id: v.string(),
  day: v.enum(DAY),
});

const eventBaseSchema = v.object({
  id: v.string(),
  day: v.enum(DAY),
  timeSpan: timespanSchema,
  info: v.string(),
  checked: v.boolean(),
  hidden: v.optional(v.boolean()),
  title: v.string(),
});

export const customEventSchema = v.object({
  ...eventBaseSchema.entries,
  color: v.string(),
  type: v.literal("CUSTOM"),
});

export type CustomEventSchema = v.InferOutput<typeof customEventSchema>;

export const customEventsSchema = v.optional(v.array(customEventSchema));

export const scheduleEventSchema = v.object({
  ...eventBaseSchema.entries,
  type: v.enum(LECTURE_TYPE),
  weeks: v.intersect([
    v.object({
      weeks: v.union([v.string(), v.array(v.number())]),
      parity: v.nullable(v.enum(WEEK_PARITY)),
    }),
    v.object({
      calculated: v.optional(v.boolean()),
    }),
  ]),
  room: v.string(),
  lectureGroup: v.array(v.string()),
  groups: v.string(),
  note: v.union([v.null_(), v.string()]),
  capacity: v.string(),
  lecturesCount: v.number(),
  strongLinked: v.array(linkedLectureDataSchema),
  linked: v.array(linkedLectureDataSchema),
  courseId: v.string(),
});

const scheduleColumnSchema = v.object({
  title: v.string(),
  duration: timespanSchema,
});

const scheduleRowsSchema = v.record(v.enum(DAY), v.optional(v.number()));

export const settingsSchema = v.object({
  columns: v.array(scheduleColumnSchema),
  rows: scheduleRowsSchema,
});

const courseTimeSpan = v.record(v.enum(LECTURE_TYPE), v.optional(v.number()));

export const courseDetailSchema = v.object({
  abbreviation: v.string(),
  name: v.string(),
  url: v.pipe(v.string(), v.url()),
  id: v.string(),
  timeSpan: courseTimeSpan,
  timeSpanText: v.array(v.string()),
});

export const courseMetricsSchema = v.record(
  v.enum(LECTURE_TYPE),
  v.optional(
    v.object({
      weeks: v.number(),
      weeklyLectures: v.number(),
    })
  )
);

const courseSchema = v.object({
  detail: courseDetailSchema,
  data: v.array(scheduleEventSchema),
  metrics: courseMetricsSchema,
});

const coursesSchema = v.array(courseSchema);

export const storeSchema = v.object({
  settings: v.optional(settingsSchema),
  courses: coursesSchema,
  customEvents: customEventsSchema,
});

export type StoreJson = v.InferOutput<typeof storeSchema>;
