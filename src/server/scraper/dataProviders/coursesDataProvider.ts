import { MutateLectureData } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types";
import type { IStudyApi } from "../api/interface";

export class CoursesDataProvider {
  constructor(private readonly studyApi: IStudyApi) {}

  public async getStudyCoursesDetails(
    config: DataProviderTypes.getStudyCoursesDetailsConfig
  ): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
    const coursesDetails = await this.studyApi.getStudyCoursesDetails(config);
    const data = MutateLectureData(coursesDetails, config.mutatorConfig ?? {});
    return data;
  }
}
