import { load } from "cheerio";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LANGUAGE } from "~/enums";
import { DAY, LECTURE_TYPE } from "~/enums/enums";
import { CourseDetailParser } from "~/server/scraper/parsers/course/vutFitCourseParser";
import { getLanguageSet } from "~/server/scraper/tests/mocks/languageSet.mock";

describe("CourseDetailParser", () => {
  const semesterStart = new Date("2024-09-16");

  it("parses detail, timespan, and schedule rows including colors, weeks, and notes", () => {
    const html = readFileSync(join(__dirname, "../htmls/course-281030.html"), "utf-8");
    const $ = load(html);
    const lang = getLanguageSet();
    const parser = new CourseDetailParser(lang);

    const result = parser.parse($, {
      courseUrl: "https://www.fit.vut.cz/study/course/281030/.cs",
      semesterTimeSchedule: { start: semesterStart, end: new Date("2024-12-13") },
      courseId: "281030",
    });

    expect(result.detail).toMatchObject({
      abbreviation: "IEL",
      id: "281030",
      name: "Electronics for Information Technology",
      url: "https://www.fit.vut.cz/study/course/281030/.cs",
    });

    // time span mapping by language tokens
    expect(result.detail.timeSpan.LECTURE).toBe(39);
    expect(result.detail.timeSpan.SEMINAR).toBe(6);
    expect(result.detail.timeSpan.LABORATORY).toBe(12);
    expect(result.detail.timeSpan.EXERCISE).not.toBeDefined();
    expect(result.detail.timeSpan.EXAM).not.toBeDefined();

    // first row: background color -> LECTURE, has note
    const data = result.data;
    expect(data.length).toBe(62);
    const first = data[0];
    expect(first.type).toBe(LECTURE_TYPE.LECTURE);
    console.log("🚀 ~ first:", first);
    expect(first.day).toBe(DAY.MON);
    expect(first.weeks.weeks).toEqual([1, 2, 3, 6, 8, 12, 13]);
    expect(first.note).toBe(null);
    expect(first.timeSpan.start.formatted()).toBe("10:00");
  });

  it("parses detail page", () => {
    const html = readFileSync(join(__dirname, "../htmls/cs/course-292488.html"), "utf-8");

    const $ = load(html);
    const lang = getLanguageSet(LANGUAGE.CZECH);
    const parser = new CourseDetailParser(lang);

    const result = parser.parse($, {
      courseUrl: "https://www.fit.vut.cz/study/course/292488/.cs",
      semesterTimeSchedule: { start: semesterStart, end: new Date("2024-12-13") },
      courseId: "292488",
    });

    expect(result.detail).toMatchObject({
      abbreviation: "0A9",
      id: "292488",
      name: "Angličtina C1-1",
      url: "https://www.fit.vut.cz/study/course/292488/.cs",
    });

    // time span mapping by language tokens
    expect(result.detail.timeSpan.LECTURE).not.toBeDefined();
    expect(result.detail.timeSpan.SEMINAR).not.toBeDefined();
    expect(result.detail.timeSpan.LABORATORY).not.toBeDefined();
    expect(result.detail.timeSpan.EXERCISE).toBe(26);
    expect(result.detail.timeSpan.EXAM).not.toBeDefined();

    const data = result.data;
    expect(data.length).toBe(4);
  });
});
