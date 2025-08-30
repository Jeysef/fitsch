import { z } from "zod";
import { TimeSpan } from "~/lib/time/time";
import { DAY, LECTURE_TYPE, WEEK_PARITY } from "~/server/scraper/enums";

const timespanSchema = z.instanceof(TimeSpan);

const linkedLectureDataSchema = z.object({
  id: z.string(),
  day: z.enum(DAY),
});

const eventBaseSchema = z.object({
  id: z.string(),
  day: z.enum(DAY),
  timeSpan: timespanSchema,
  info: z.string(),
  checked: z.boolean(),
  hidden: z.boolean().optional(),
  title: z.string(),
});

// --- Custom Events Schema ---

export const customEventSchema = eventBaseSchema.extend({
  color: z.string(),
  type: z.literal("CUSTOM"),
});

export const customEventsSchema = z.array(customEventSchema).optional();

// --- Schedule Event Schema (for lectures within courses) ---

// This schema is complex and not fully redefined in the new store's types,
// so we reuse the robust definition from the old schema.
export const scheduleEventSchema = eventBaseSchema.extend({
  type: z.enum(LECTURE_TYPE),
  weeks: z
    .object({
      weeks: z.string().or(z.array(z.number())),
      parity: z.enum(WEEK_PARITY).nullable(),
    })
    .and(z.object({ calculated: z.boolean().optional() })),
  room: z.string(),
  lectureGroup: z.array(z.string()),
  groups: z.string(),
  note: z.null(),
  capacity: z.string(),
  lecturesCount: z.number(),
  strongLinked: z.array(linkedLectureDataSchema),
  linked: z.array(linkedLectureDataSchema),
  courseId: z.string(),
});

// --- Settings Schema (based on ISchedulerSettings) ---

const scheduleColumnSchema = z.object({
  title: z.string(),
  duration: timespanSchema,
});

const scheduleRowsSchema = z.partialRecord(z.enum(DAY), z.number());

export const settingsSchema = z.object({
  columns: z.array(scheduleColumnSchema),
  rows: scheduleRowsSchema,
});

const courseTimeSpan = z.partialRecord(z.enum(LECTURE_TYPE), z.number());

// --- Course Schema (based on Course type) ---

export const courseDetailSchema = z.object({
  abbreviation: z.string(),
  name: z.string(),
  url: z.url(),
  id: z.string(),
  // These were part of the old detail schema and are useful for display purposes.
  // They are derived in the new store but useful to have in the serialized state.
  timeSpan: courseTimeSpan,
  timeSpanText: z.array(z.string()),
});

export const courseMetricsSchema = z.partialRecord(
  z.enum(LECTURE_TYPE),
  z.object({ weeks: z.number(), weeklyLectures: z.number() })
);

const courseSchema = z.object({
  detail: courseDetailSchema,
  data: z.array(scheduleEventSchema),
  metrics: courseMetricsSchema,
});

const coursesSchema = z.array(courseSchema);

// --- Top-Level Store Schema ---

// This schema represents the serializable state of the new SchedulerStore
export const storeSchema = z.object({
  settings: settingsSchema.optional(),
  courses: coursesSchema,
  customEvents: customEventsSchema,
});

// --- Exports and Parser ---

export type StoreJson = z.infer<typeof storeSchema>;
