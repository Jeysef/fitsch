import type { enumUtil } from "node_modules/zod/lib/helpers/enumUtil";
import { type ZodObject, type ZodTypeAny, z } from "zod";
import { DEGREE, SEMESTER } from "~/server/scraper/enums";
import type { StudyOverview } from "~/server/scraper/types";

export const navigationSchema = z.object({
  year: z.object({ value: z.string(), label: z.string() }),
  semester: z.nativeEnum(SEMESTER),
  grade: z.string().optional(),
  degree: z.nativeEnum(DEGREE),
  program: z.string().optional(),
  coursesCompulsory: z.array(z.string()),
  coursesVoluntary: z.array(z.string()),
}) satisfies ZodObject<Record<Exclude<keyof StudyOverview["values"], "language">, ZodTypeAny>>;

export type NavigationSchema = z.infer<typeof navigationSchema>;
// export type NavigationSchemaKeys = keyof typeof navigationSchema.keyof;
export type NavigationSchemaKey = enumUtil.UnionToTupleString<keyof NavigationSchema>[number];
