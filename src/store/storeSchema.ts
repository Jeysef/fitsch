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
});

// --- Custom Events Schema ---

export const customEventSchema = eventBaseSchema.extend({
  title: z.string(),
  color: z.string(),
  type: z.literal("CUSTOM"),
});

export const customEventsSchema = z.array(customEventSchema).optional();

// --- Schedule Event Schema (for lectures within courses) ---

// This schema is complex and not fully redefined in the new store's types,
// so we reuse the robust definition from the old schema.
const scheduleEventSchema = eventBaseSchema.extend({
  type: z.enum(LECTURE_TYPE),
  //    type LectureWeeks = (
  //   | {
  //       weeks: number[];
  //       parity: WEEK_PARITY | null;
  //     }
  //   | {
  //       weeks: string;
  //       parity: WEEK_PARITY | null;
  //     }
  // ) & {
  //   calculated?: boolean;
  // };
  weeks: z
    .union([
      z.object({
        weeks: z.array(z.number()),
        parity: z.enum(WEEK_PARITY).nullable(),
      }),
      z.object({
        weeks: z.string(),
        parity: z.enum(WEEK_PARITY).nullable(),
      }),
    ])
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
  title: z.string(),
  hidden: z.boolean().optional(),
});

// --- Settings Schema (based on ISchedulerSettings) ---

const scheduleColumnSchema = z.object({
  title: z.string(),
  duration: timespanSchema,
});

const scheduleRowsSchema = z.partialRecord(z.enum(DAY), z.number());

const settingsSchema = z.object({
  columns: z.array(scheduleColumnSchema),
  rows: scheduleRowsSchema,
});

// --- Course Schema (based on Course type) ---

const courseDetailSchema = z
  .object({
    abbreviation: z.string(),
    name: z.string(),
    /** @deprecated */
    link: z.url().optional(),
    url: z.url().optional(),
    id: z.string(),
    // These were part of the old detail schema and are useful for display purposes.
    // They are derived in the new store but useful to have in the serialized state.
    timeSpan: z.partialRecord(z.enum(LECTURE_TYPE), z.number()),
    timeSpanText: z.array(z.string()),
  })
  .refine((data) => data.url || data.link, {
    message: "Either 'url' or the deprecated 'link' property must be provided.",
    path: ["courseDetailSchema", "url"],
  })
  .transform((detail) => {
    // Handle backward compatibility for link -> url
    const finalUrl = detail.url ?? detail.link!;

    const { link, ...rest } = detail;
    return {
      ...rest,
      url: finalUrl,
    };
  });

const courseMetricsSchema = z.partialRecord(
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
const schema = z.object({
  settings: settingsSchema,
  courses: coursesSchema,
  customEvents: customEventsSchema,
});

// --- Exports and Parser ---

export type StoreJson = z.infer<typeof schema>;

/**
 * Parses a JSON object against the store schema.
 * @param json The raw JSON object to parse.
 * @returns A Zod SafeParseReturnType indicating success or failure.
 */
export function parseStoreJson(json: unknown) {
  return schema.safeParseAsync(json);
}

export function parseStoreJsonSync(json: unknown) {
  return schema.safeParse(json);
}

export function parseStoreJsoUnsafeSync(json: unknown) {
  return schema.parse(json);
}
