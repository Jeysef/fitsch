import type { enumUtil } from "node_modules/zod/lib/helpers/enumUtil";
import { type ZodObject, type ZodTypeAny, z } from "zod";
import { DEGREE, OBLIGATION, SEMESTER } from "~/server/scraper/enums";
import type { StudyOverview } from "~/server/scraper/types";

export const navigationSchema = z.object({
  year: z.object({ value: z.string(), label: z.string() }),
  semester: z.nativeEnum(SEMESTER),
  grade: z.string().optional(),
  degree: z.nativeEnum(DEGREE),
  program: z.string().optional(),
  [OBLIGATION.COMPULSORY]: z.array(z.string()),
  [OBLIGATION.COMPULSORY_ELECTIVE]: z.array(z.string()),
  [OBLIGATION.ELECTIVE]: z.array(z.string()),
}) satisfies ZodObject<Record<Exclude<keyof StudyOverview["values"], "language">, ZodTypeAny>>;

export type NavigationSchema = z.infer<typeof navigationSchema>;
export type NavigationSchemaKey = enumUtil.UnionToTupleString<keyof NavigationSchema>[number];
