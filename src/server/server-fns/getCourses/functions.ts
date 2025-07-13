import { FACULTY } from "~/enums";
import { createAppServices } from "~/server/scraper/services";
import type { DataProviderTypes, GetStudyCoursesDetailsFunctionConfig } from "~/server/scraper/types";

export async function getStudyCoursesDetails(
  config: GetStudyCoursesDetailsFunctionConfig
): Promise<DataProviderTypes.getStudyCoursesDetailsReturn> {
  "use server";
  const { coursesProvider } = await createAppServices({
    language: config.language,
    faculty: config.faculty ?? FACULTY.FIT,
  });

  const d = await coursesProvider.getStudyCoursesDetails(config);
  const staleCoursesData = config.staleCoursesId?.map((id) => ({ detail: { id }, isStale: true }) as const);
  return d.concat(staleCoursesData ?? []);
}
