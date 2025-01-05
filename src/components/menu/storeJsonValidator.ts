import { z, type EnumLike } from "zod";
import { TimeSpan } from "~/components/scheduler/time";
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

const dataSchema = RecordOf(
  DAY,
  z.object({
    dayRow: z.number(),
    dayRows: z.number(),
    events: z.array(
      z.object({
        colStart: z.number(),
        colEnd: z.number(),
        paddingStart: z.number(),
        paddingEnd: z.number(),
        row: z.number(),
        event: z.object({
          type: z.nativeEnum(LECTURE_TYPE),
          day: z.nativeEnum(DAY),
          weeks: z.object({
            parity: z.nativeEnum(WEEK_PARITY).nullable(),
            weeks: z.array(z.number()),
          }),
          room: z.string(),
          timeSpan: timespanSchema,
          lectureGroup: z.array(z.string()),
          groups: z.string(),
          info: z.string(),
          note: z.string().nullable(),
          capacity: z.string(),
          id: z.string(),
          lecturesCount: z.number(),
          strongLinked: z.array(linkedLectureDataSchema),
          linked: z.array(linkedLectureDataSchema),
          courseDetail: z.object({
            abbreviation: z.string(),
            name: z.string(),
            link: z.string(),
            timeSpan: courseTimeSpan,
            timeSpanText: z.array(z.string()),
            id: z.string(),
          }),
          metrics: z.object({
            weeks: z.number(),
            weeklyLectures: z.number(),
          }),
          checked: z.boolean(),
        }),
      })
    ),
  })
);

const schema = z.object({
  settings: z.object({
    blockDimensions: z.object({
      width: z.object({
        min: z.string(),
        max: z.string(),
      }),
      height: z.string(),
    }),
    columns: z.array(
      z.object({
        title: z.string(),
        duration: timespanSchema,
      })
    ),
    rows: z.array(
      z.object({
        day: z.nativeEnum(DAY),
      })
    ),
  }),
  courses: z.array(
    z.object({
      detail: z.object({
        abbreviation: z.string(),
        name: z.string(),
        link: z.string(),
        timeSpan: courseTimeSpan,
        timeSpanText: z.array(z.string()),
        id: z.string(),
      }),
      data: dataSchema,
      metrics: RecordOf(LECTURE_TYPE, z.object({ weeks: z.number(), weeklyLectures: z.number() }).optional()),
    })
  ),
});

export function parseStoreJson(json: any) {
  return schema.safeParse(json);
}
