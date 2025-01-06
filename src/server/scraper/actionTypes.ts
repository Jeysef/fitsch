import type { Jsonify } from "type-fest";
import type { DataProviderTypes } from "~/server/scraper/types";

export type StudyCoursesDetailsActionReturn = Jsonify<DataProviderTypes.getStudyCoursesDetailsReturn>;
