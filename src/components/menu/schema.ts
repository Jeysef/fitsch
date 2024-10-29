import { z, type ZodObject, type ZodTypeAny } from "zod";
import { DEGREE, SEMESTER } from "~/server/scraper/enums";
import { type StudyOverview } from "~/server/scraper/types";


export const navigationSchema = z.object({
  year: z.object({ value: z.string(), label: z.string() }).optional(),
  semester: z.nativeEnum(SEMESTER),
  grade: z.string(),
  degree: z.nativeEnum(DEGREE),
  program: z.string().optional(),
  coursesCompulsory: z.array(z.string()),
  coursesOptional: z.array(z.string()),
}) satisfies ZodObject<Record<keyof StudyOverview["values"], ZodTypeAny>>;

export type NavigationSchema = z.infer<typeof navigationSchema>;