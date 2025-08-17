import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { LANGUAGE } from "~/enums";
import { VutFitApi } from "~/server/scraper/api/vutFitApi";
import { DEGREE } from "~/server/scraper/enums";
import { CourseDetailParser } from "~/server/scraper/parsers/course/vutFitCourseParser";
import { ProgramCoursesParser } from "~/server/scraper/parsers/programCourses/vutFitProgramCoursesParser";
import { ProgramsParser } from "~/server/scraper/parsers/programs/vutFitProgramsParser";
import { TimeScheduleParser } from "~/server/scraper/parsers/timeSchedule/vutFitTimeScheduleParser";
import { createHttpFetcherMock } from "~/server/scraper/tests/mocks/httpFetcher.mock";
import { getLanguageSet } from "~/server/scraper/tests/mocks/languageSet.mock";

describe("VutFitApi", () => {
  const cheerioDocs: Record<string, string> = {};
  const httpFetcher = createHttpFetcherMock(cheerioDocs);
  const langSet = getLanguageSet();
  const api = new VutFitApi(
    LANGUAGE.ENGLISH,
    httpFetcher,
    new ProgramsParser(),
    new CourseDetailParser(langSet),
    new TimeScheduleParser(langSet),
    new ProgramCoursesParser(langSet)
  );
  beforeEach(() => {
    // Reset the mock before each test
    // @ts-expect-error getDocument is a mock function
    httpFetcher.getDocument.mockClear();
    // vi.spyOn(httpFetcher, "getDocument").mockClear();
  });
  it("builds programs URL with degree/year and delegates to parser", async () => {
    const base = "https://www.fit.vut.cz/study/";
    const langSuffix = ".en";

    const programsHtml = readFileSync(join(__dirname, "../htmls/programs.html"), "utf-8");
    const programsUrl = `${base}programs/${langSuffix}?degree=B&year=2024`;

    cheerioDocs[programsUrl] = programsHtml;
    const res = await api.getStudyPrograms({ degree: DEGREE.BACHELOR, year: "2024" });

    expect(httpFetcher.getDocument).toHaveBeenCalledWith(programsUrl);
    expect(res.programs.BACHELOR.length).toBeGreaterThan(0);
  });

  it("getTimeSchedule caches results via wrapper and hits expected URL", async () => {
    const base = "https://www.fit.vut.cz/study/";
    const langSuffix = ".en";
    const calUrl = `${base}calendar/2024/${langSuffix}`;

    const timeHtml = readFileSync(join(__dirname, "../htmls/calendar.en.html"), "utf-8");
    cheerioDocs[calUrl] = timeHtml;

    const a = await api.getTimeSchedule({ year: "2024" });

    // The second call should not trigger an extra fetch if cache wrapper is working.
    expect(httpFetcher.getDocument).toHaveBeenCalledTimes(1);
    expect(httpFetcher.getDocument).toHaveBeenCalledWith(calUrl);
    expect(a.WINTER.start instanceof Date).toBe(true);
  });

  it("getStudyCourseDetails builds course URL and parses data", async () => {
    const base = "https://www.fit.vut.cz/study/";
    const langSuffix = ".en";
    const url = `${base}course/281030/${langSuffix}`;

    const html = readFileSync(join(__dirname, "../htmls/course-281030.html"), "utf-8");
    cheerioDocs[url] = html;

    const res = await api.getStudyCourseDetails({
      courseId: "281030",
      // the parser requires semesterTimeSchedule, provide minimal
      semesterTimeSchedule: { start: new Date("2024-09-16"), end: new Date("2024-12-20") },
    });

    expect(httpFetcher.getDocument).toHaveBeenCalledWith(url);
    expect(res.detail.id).toBe("281030");
  });
});
