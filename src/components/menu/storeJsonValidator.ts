import { z } from "zod";
import { TimeSpan } from "~/components/scheduler/time";
import type { LectureMetrics } from "~/components/scheduler/types";
import { DAY, LECTURE_TYPE, WEEK_PARITY } from "~/server/scraper/enums";

const timespanSchema = z.instanceof(TimeSpan);

const linkedLectureDataSchema = z.object({
  id: z.string(),
  day: z.enum(DAY),
});

const courseTimeSpan = z.record(z.enum(LECTURE_TYPE), z.number().optional());

const eventBaseSchema = z.object({
  id: z.string(),
  day: z.enum(DAY),
  timeSpan: timespanSchema,
  info: z.string(),
  checked: z.boolean(),
  hidden: z.boolean().optional(),
});

export const customEventSchema = eventBaseSchema.extend({
  title: z.string(),
  color: z.string(),
  type: z.literal("CUSTOM"),
});

export const customEventsSchema = z.array(customEventSchema).optional();

const scheduleEventSchema = eventBaseSchema.extend({
  type: z.enum(LECTURE_TYPE),
  weeks: z.union([
    z.object({
      weeks: z.array(z.number()),
      parity: z.enum(WEEK_PARITY).nullable(),
      calculated: z.boolean().optional(),
    }),
    z.object({
      weeks: z.string(),
      parity: z.enum(WEEK_PARITY).nullable(),
      calculated: z.boolean().optional(),
    }),
  ]),
  room: z.string(),
  lectureGroup: z.array(z.string()),
  groups: z.string(),
  note: z.null(),
  capacity: z.string(),
  lecturesCount: z.number(),
  strongLinked: z.array(linkedLectureDataSchema),
  linked: z.array(linkedLectureDataSchema),
});

const coursesSchema = z.array(
  z.object({
    detail: z
      .object({
        abbreviation: z.string(),
        name: z.string(),
        /** @deprecated */
        link: z.url().optional(),
        url: z.url().optional(),
        id: z.string(),
        timeSpan: courseTimeSpan,
        timeSpanText: z.array(z.string()),
      })
      .refine((data) => data.url || data.link, {
        message: "Either 'url' or the deprecated 'link' property must be provided.",
        // Point the error to the 'url' field for better DX in forms etc.
        path: ["coursesSchema", "detail", "url"],
      })
      .transform((detail) => {
        const finalUrl = detail.url ?? detail.link!;
        const { link, ...rest } = detail;
        return {
          ...rest,
          url: finalUrl,
        };
      }),
    data: z.array(scheduleEventSchema),
    metrics: z
      .record(z.enum(LECTURE_TYPE), z.object({ weeks: z.number(), weeklyLectures: z.number() }).optional())
      .transform((val): Record<LECTURE_TYPE, LectureMetrics> => val as Record<LECTURE_TYPE, LectureMetrics>),
  })
);

// no need to load the settings for now, will be added in recreateStore

const schema = z.object({
  // settings: settingsSchema,
  courses: coursesSchema,
  customEvents: customEventsSchema,
});

export type StoreJson = z.infer<typeof schema>;

export function parseStoreJson(json: any) {
  return schema.safeParse(json);
}
