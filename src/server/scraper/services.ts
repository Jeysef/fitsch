import type { FACULTY, LANGUAGE } from "~/enums";
import { fromURL } from "~/server/utils/fetcher";
import { ApiFactory } from "./api/factory";
import { HttpFetcher } from "./httpFetcher";

export async function createStudyApi(config: { language: LANGUAGE; faculty: FACULTY }) {
  const httpFetcher = new HttpFetcher(fromURL);

  const apiFactory = new ApiFactory(httpFetcher);
  const studyApi = await apiFactory.create(config.faculty, config.language);

  return { studyApi };
}
