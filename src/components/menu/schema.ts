import { z, type ZodObject, type ZodTypeAny } from "zod";
import { DEGREE, SEMESTER } from "~/server/scraper/enums";
import { type StudyOverview } from "~/server/scraper/types";


export const navigationSchema = z.object({
  year: z.object({ value: z.string(), label: z.string() }).optional(),
  semester: z.nativeEnum(SEMESTER),
  grade: z.string().optional(),
  degree: z.nativeEnum(DEGREE),
  program: z.string().optional(),
  coursesCompulsory: z.array(z.string()),
  coursesVoluntary: z.array(z.string()),
}) satisfies ZodObject<Record<Exclude<keyof StudyOverview["values"], "language">, ZodTypeAny>>;

export type NavigationSchema = z.infer<typeof navigationSchema>;