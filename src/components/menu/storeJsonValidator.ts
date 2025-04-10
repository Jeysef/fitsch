import { z, type EnumLike } from "zod";
import { TimeSpan } from "~/components/scheduler/time";
import type { LectureMetrics } from "~/components/scheduler/types";
import { DAY, LECTURE_TYPE, WEEK_PARITY } from "~/server/scraper/enums";

export const RecordOf = <T extends EnumLike, ZodValueType extends z.ZodTypeAny>(obj: T, zodValueType: ZodValueType) => {
  type KeyType = T[keyof T];
  const keys = Object.values(obj);
  return z.object(
    keys.reduce(
      (agg, k) =>
        Object.assign(agg, {
          [k]: zodValueType,
        }),
      {} as Record<KeyType, ZodValueType>
    )
  );
};

const timespanSchema = z.instanceof(TimeSpan);

const linkedLectureDataSchema = z.object({
  id: z.string(),
  day: z.nativeEnum(DAY),
});

const courseTimeSpan = RecordOf(LECTURE_TYPE, z.number().optional());

const eventBaseSchema = z.object({
  id: z.string(),
  day: z.nativeEnum(DAY),
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
  type: z.nativeEnum(LECTURE_TYPE),
  weeks: z.union([
    z.object({
      weeks: z.array(z.number()),
      parity: z.nativeEnum(WEEK_PARITY).nullable(),
      calculated: z.boolean().optional(),
    }),
    z.object({
      weeks: z.string(),
      parity: z.nativeEnum(WEEK_PARITY).nullable(),
      calculated: z.boolean().optional(),
    }),
  ]),
  room: z.string(),
  lectureGroup: z.array(z.string()),
  groups: z.string(),
  note: z.string().nullable(),
  capacity: z.string(),
  lecturesCount: z.number().or(z.literal(false)),
  strongLinked: z.array(linkedLectureDataSchema),
  linked: z.array(linkedLectureDataSchema),
});

const coursesSchema = z.array(
  z.object({
    detail: z.object({
      abbreviation: z.string(),
      name: z.string(),
      link: z.string(),
      timeSpan: courseTimeSpan,
      timeSpanText: z.array(z.string()),
      id: z.string(),
    }),
    data: z.array(scheduleEventSchema),
    metrics: RecordOf(LECTURE_TYPE, z.object({ weeks: z.number(), weeklyLectures: z.number() }).optional()).transform(
      (val): Record<LECTURE_TYPE, LectureMetrics> => val as Record<LECTURE_TYPE, LectureMetrics>
    ),
  })
);

const settingsSchema = z.object({
  blockDimensions: z
    .object({
      width: z
        .union([
          z.string(),
          z.object({
            min: z.union([z.string(), z.literal("auto")]),
            max: z.union([z.string(), z.literal("auto")]),
          }),
        ])
        .optional(),
      height: z
        .union([
          z.string(),
          z.object({
            min: z.union([z.string(), z.literal("auto")]),
            max: z.union([z.string(), z.literal("auto")]),
          }),
        ])
        .optional(),
    })
    .optional(),
  columns: z.array(
    z.object({
      title: z.string(),
      duration: timespanSchema,
    })
  ).optional(),
  rows: z
    .union([
      // New format
      RecordOf(DAY, z.number()).and(z.object({ length: z.number() })),
      // Legacy format
      z.array(
        z.object({
          day: z.nativeEnum(DAY),
        })
      ),
    ])
    .transform((val) => {
      if (Array.isArray(val)) {
        // Transform legacy format
        const transformed = Object.fromEntries(Object.values(DAY).map((day, index) => [day, index + 1]));
        return { ...transformed, length: Object.values(DAY).length };
      }
      return val;
    }).optional(),
});

const schema = z.object({
  settings: settingsSchema,
  courses: coursesSchema,
  customEvents: customEventsSchema,
});

export type StoreJson = z.infer<typeof schema>;

export function parseStoreJson(json: any) {
  return schema.safeParse(json);
}
