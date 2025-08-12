import { FACULTY } from "~/enums";
import { CoursesDataProvider } from "~/server/scraper/dataProviders/coursesDataProvider";
import { createStudyApi } from "~/server/scraper/services";
import type { DataProviderTypes, GetStudyCoursesDetailsFunctionConfig } from "~/server/scraper/types";

export async function getStudyCoursesDetails(
  config: GetStudyCoursesDetailsFunctionConfig
): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
  "use server";
  const { studyApi } = await createStudyApi({
    language: config.language,
    faculty: config.faculty ?? FACULTY.FIT,
  });

  const coursesProvider = new CoursesDataProvider(studyApi);

  const d = await coursesProvider.getStudyCoursesDetails(config);
  const staleCoursesData = config.staleCoursesId?.map((id) => ({ detail: { id }, isStale: true }) as const);
  return d.concat(staleCoursesData ?? []);
}
