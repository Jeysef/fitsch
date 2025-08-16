import type { enumUtil } from "node_modules/zod/dist/types/v3/helpers/enumUtil";
import { z, type ZodObject, type ZodTypeAny } from "zod";
import { FACULTY, LANGUAGE } from "~/enums";
import { DEGREE, OBLIGATION, SEMESTER } from "~/server/scraper/enums";
import type { OverviewCurrent } from "~/server/scraper/types/overview.types";

export const menuCurrentSchema = z.object({
  year: z.object({ value: z.string(), label: z.string() }),
  language: z.nativeEnum(LANGUAGE),
  faculty: z.nativeEnum(FACULTY),
  degree: z.nativeEnum(DEGREE).optional(),
  program: z.string().optional(),
});

export const menuAdditionalSchema = z.object({
  semester: z.nativeEnum(SEMESTER),
  grade: z.string().optional(),
  [OBLIGATION.COMPULSORY]: z.array(z.string()),
  [OBLIGATION.COMPULSORY_ELECTIVE]: z.array(z.string()),
  [OBLIGATION.ELECTIVE]: z.array(z.string()),
});

export const menuSchema = menuCurrentSchema.merge(menuAdditionalSchema) satisfies ZodObject<
  Record<Exclude<keyof OverviewCurrent, "language">, ZodTypeAny>
>;

export type MenuSchema = z.infer<typeof menuSchema>;
export type MenuSchemaKey = enumUtil.UnionToTupleString<keyof MenuSchema>[number];
