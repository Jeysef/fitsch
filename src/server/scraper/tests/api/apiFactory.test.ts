import { describe, expect, it } from "vitest";
import { FACULTY, LANGUAGE } from "~/enums";
import { ApiFactory } from "~/server/scraper/api/factory";
import { createEmptyHttpFetcherMock } from "~/server/scraper/tests/mocks/httpFetcher.mock";

describe("ApiFactory", () => {
  const httpFetcher = createEmptyHttpFetcherMock();
  it("creates VutFitApi for FIT and wires parsers", async () => {
    const factory = new ApiFactory(httpFetcher);

    const api = await factory.create(FACULTY.FIT, LANGUAGE.ENGLISH);

    expect(api).toBeDefined();
    expect(typeof api.getStudyPrograms).toBe("function");
    expect(typeof api.getTimeSchedule).toBe("function");
  });

  it("throws for unsupported faculty", async () => {
    const factory = new ApiFactory(httpFetcher);

    await expect(factory.create("UNSUPPORTED" as FACULTY, LANGUAGE.ENGLISH)).rejects.toThrow(/Unsupported faculty/);
  });
});
