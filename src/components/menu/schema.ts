import * as v from "valibot";
import { FACULTY, LANGUAGE } from "~/enums";
import { DEGREE, OBLIGATION, SEMESTER } from "~/enums/enums";

export const menuCurrentSchema = v.object({
  year: v.object({ value: v.string(), label: v.string() }),
  language: v.enum(LANGUAGE),
  faculty: v.enum(FACULTY),
  degree: v.optional(v.enum(DEGREE)),
  program: v.optional(v.string()),
});

export const menuAdditionalSchema = v.object({
  semester: v.enum(SEMESTER),
  grade: v.optional(v.string()),
  selected: v.optional(
    v.record(
      v.enum(DEGREE),
      v.optional(
        v.record(
          v.string(),
          v.optional(v.record(v.string(), v.optional(v.record(v.enum(OBLIGATION), v.optional(v.array(v.string()))))))
        )
      )
    )
  ),
});

export const menuSchema = v.object({
  ...menuCurrentSchema.entries,
  ...menuAdditionalSchema.entries,
});

export type MenuSchema = v.InferOutput<typeof menuSchema>;
export type MenuSchemaKey = keyof MenuSchema;
