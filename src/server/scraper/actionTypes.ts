import type { Jsonify } from "type-fest";
import type { DataProviderTypes } from "~/server/scraper/types";
import type { FunctionReturn } from "~/server/server-fns/utils/errorHandeler";

export type StudyCoursesDetailsActionReturn = Jsonify<FunctionReturn<DataProviderTypes.getStudyCoursesDetailsReturn>>;
