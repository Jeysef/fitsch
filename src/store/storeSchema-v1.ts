import * as v from "valibot";
import { courseDetailSchema, courseMetricsSchema, customEventsSchema, scheduleEventSchema } from "~/store/storeSchema-v2";

const courseSchema = v.pipe(
  v.looseObject({
    detail: v.pipe(
      v.object({
        ...courseDetailSchema.entries,
        /** @deprecated */
        link: v.optional(v.pipe(v.string(), v.url())),
        url: v.optional(v.pipe(v.string(), v.url())),
      }),
      v.check((data) => !!(data.url || data.link), "Either 'url' or the deprecated 'link' property must be provided."),
      v.transform((detail) => {
        const finalUrl = detail.url ?? detail.link!;
        const { link, ...rest } = detail;
        return {
          ...rest,
          url: finalUrl,
        };
      })
    ),
    data: v.array(
      v.object({
        ...scheduleEventSchema.entries,
        courseId: v.undefined(),
        title: v.undefined(),
      })
    ),
    metrics: courseMetricsSchema,
  }),
  v.transform((course) => ({
    ...course,
    data: course.data.map((event) => ({
      ...event,
      courseId: course.detail.id,
      title: course.detail.abbreviation,
    })),
  }))
);

const coursesSchema = v.array(courseSchema);

export const storeSchema = v.looseObject({
  courses: coursesSchema,
  customEvents: customEventsSchema,
});

export type StoreJson = v.InferOutput<typeof storeSchema>;
