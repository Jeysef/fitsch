import { load } from "cheerio";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TimeScheduleParser } from "~/server/scraper/parsers/timeSchedule/vutFitTimeScheduleParser";
import { getLanguageSet } from "~/server/scraper/tests/mocks/languageSet.mock";

describe("TimeScheduleParser", () => {
  it("parses semester start/end using language labels", () => {
    const html = readFileSync(join(__dirname, "../htmls/calendar.en.html"), "utf-8");
    const $ = load(html);
    const lang = getLanguageSet();
    const parser = new TimeScheduleParser(lang);

    const result = parser.parse($);

    expect(result.WINTER.start.toISOString().slice(0, 10)).toBe("2024-09-16");
    expect(result.WINTER.end.toISOString().slice(0, 10)).toBe("2024-12-13");
    expect(result.SUMMER.start.toISOString().slice(0, 10)).toBe("2025-02-10");
    expect(result.SUMMER.end.toISOString().slice(0, 10)).toBe("2025-05-09");
  });
});
