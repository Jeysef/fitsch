import type { StudyApi } from "~/server/scraper/api";
import { MutateLectureData } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types";

export class CoursesDataProvider {
  constructor(private readonly studyApi: StudyApi) {}

  public async getStudyCoursesDetails(
    config: DataProviderTypes.getStudyCoursesDetailsConfig
  ): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
    const coursesDetails = await this.studyApi.getStudyCoursesDetails(config);
    const data = MutateLectureData(coursesDetails, config.mutatorConfig ?? {});
    return data;
  }
}
