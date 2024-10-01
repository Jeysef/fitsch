import { z, type ZodObject, type ZodTypeAny } from "zod";
import { SEMESTER, type StudyOverview } from "~/server/scraper/types";


export const navigationSchema = z.object({
  year: z.string(),
  semester: z.nativeEnum(SEMESTER),
  grade: z.string(),
  degree: z.string(),
  program: z.string().optional(),
  programsObligatory: z.array(z.string()).optional(),
  programsOptional: z.array(z.string()).optional(),
}) satisfies ZodObject<{ [V in keyof StudyOverview["values"]]: ZodTypeAny }>;

export type NavigationSchema = z.infer<typeof navigationSchema>;