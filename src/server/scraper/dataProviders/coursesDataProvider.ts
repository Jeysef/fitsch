import { MutateLectureData } from "~/server/scraper/lectureMutator";
import type { IStudyApi } from "../api/interface";
import type { DataProviderTypes } from "~/server/scraper/types/data.types";

export class CoursesDataProvider {
  constructor(private readonly studyApi: IStudyApi) {}

  public async getStudyCoursesDetails(
    config: DataProviderTypes.getStudyCoursesDetailsConfig
  ): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
    const coursesDetails = await this.studyApi.getStudyCoursesDetails(config);
    const data = MutateLectureData(coursesDetails);
    return data;
  }
}
