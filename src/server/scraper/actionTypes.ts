import type { Jsonify } from "type-fest";
import type { DataProviderTypes, FunctionReturn } from "~/server/scraper/types";

export type StudyCoursesDetailsActionReturn = Jsonify<FunctionReturn<DataProviderTypes.getStudyCoursesDetailsReturn>>;
