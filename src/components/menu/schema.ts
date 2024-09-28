import { z } from "zod";
import { DEGREE, SEMESTER } from "~/server/scraper/types";


export const navigationSchema = z.object({
  year: z.string(),
  semester: z.nativeEnum(SEMESTER),
  degree: z.nativeEnum(DEGREE),
  grade: z.string(),
  programsObligatory: z.array(z.string()).optional(),
  programsOptional: z.array(z.string()).optional(),
});

export type NavigationSchema = z.infer<typeof navigationSchema>;