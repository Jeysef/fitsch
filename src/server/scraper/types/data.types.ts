import type { LectureMutator } from "~/server/scraper/lectureMutator";
import type { StudyApiTypes } from "~/server/scraper/types/api.types";
import type { Overview, OverviewPayload } from "~/server/scraper/types/overview.types";

export namespace DataProviderTypes {
  export interface getStudyOverviewConfig extends OverviewPayload {}
  export interface getStudyOverviewReturn extends Overview {}

  export type getStudyCoursesDetailsConfig = StudyApiTypes.getStudyCoursesDetailsConfig;
  export type getStudyCoursesDetailsReturn = LectureMutator.Return;
}
