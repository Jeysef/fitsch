import { z } from "zod";
import { DAY } from "~/enums/enums";
import { TimeSpan } from "~/lib/time/time";
import { courseDetailSchema, courseMetricsSchema, scheduleEventSchema } from "~/store/storeSchema-v2";

const timespanSchema = z.instanceof(TimeSpan);

const eventBaseSchema = z.looseObject({
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

const courseSchema = z
  .looseObject({
    detail: courseDetailSchema
      .extend({
        /** @deprecated */
        link: z.url().optional(),
        url: z.url().optional(),
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
    data: z.array(scheduleEventSchema.extend({ courseId: z.undefined(), title: z.undefined() })),
    metrics: courseMetricsSchema,
  })
  .transform((course) => ({
    ...course,
    data: course.data.map((event) => ({
      ...event,
      courseId: course.detail.id,
      title: course.detail.abbreviation,
    })),
  }));

const coursesSchema = z.array(courseSchema);

// no need to load the settings for now, will be added in recreateStore

export const storeSchema = z.looseObject({
  // settings: settingsSchema.optional(),
  courses: coursesSchema,
  customEvents: customEventsSchema,
});

export type StoreJson = z.infer<typeof storeSchema>;
