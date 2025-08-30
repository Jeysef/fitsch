import { z } from "zod";
import { FACULTY, LANGUAGE } from "~/enums";
import { DEGREE, OBLIGATION, SEMESTER } from "~/enums/enums";

export const menuCurrentSchema = z.object({
  year: z.object({ value: z.string(), label: z.string() }),
  language: z.enum(LANGUAGE),
  faculty: z.enum(FACULTY),
  degree: z.enum(DEGREE).optional(),
  program: z.string().optional(),
});

export const menuAdditionalSchema = z.object({
  semester: z.enum(SEMESTER),
  grade: z.string().optional(),
  [OBLIGATION.COMPULSORY]: z.array(z.string()),
  [OBLIGATION.COMPULSORY_ELECTIVE]: z.array(z.string()),
  [OBLIGATION.ELECTIVE]: z.array(z.string()),
});

export const menuSchema = menuCurrentSchema.extend(menuAdditionalSchema.shape);

export type MenuSchema = z.infer<typeof menuSchema>;
export type MenuSchemaKey = keyof MenuSchema;
