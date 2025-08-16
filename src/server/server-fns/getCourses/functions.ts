import { FACULTY } from "~/enums";
import { CoursesDataProvider } from "~/server/scraper/dataProviders/coursesDataProvider";
import { createStudyApi } from "~/server/scraper/services";
import type { DataProviderTypes } from "~/server/scraper/types/data.types";
import type { GetStudyCoursesDetailsFunctionConfig } from "~/server/server-fns/getCourses/getStudyCoursesDetails.types";

export async function getStudyCoursesDetails(
  config: GetStudyCoursesDetailsFunctionConfig
): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
  "use server";
  const { studyApi } = await createStudyApi({
    language: config.language,
    faculty: config.faculty ?? FACULTY.FIT,
  });

  const coursesProvider = new CoursesDataProvider(studyApi);

  const details = await coursesProvider.getStudyCoursesDetails(config);
  return details;
}
