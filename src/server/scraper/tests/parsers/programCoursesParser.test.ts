import { load } from "cheerio";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ProgramCoursesParser } from "~/server/scraper/parsers/programCourses/vutFitProgramCoursesParser";
import { getLanguageSet } from "~/server/scraper/tests/mocks/languageSet.mock";

describe("ProgramCoursesParser", () => {
  it("parses courses split by semester and detects obligation by text and color", () => {
    const html = readFileSync(join(__dirname, "../htmls/program-8953.html"), "utf-8");
    const $ = load(html);
    const lang = getLanguageSet();
    const parser = new ProgramCoursesParser(lang);

    const program = parser.parse($, { programUrl: "https://program.example" });

    expect(program.detail.name).toBe("Information Technology");
    expect(program.detail.abbreviation).toBe("BIT");

    const year1 = program.data["1"];
    expect(year1).toBeDefined();

    // First table -> WINTER
    const winter = year1.WINTER;
    expect(winter.length).toBe(34);
    expect(winter).toContainEqual({
      abbreviation: "IDM",
      id: "281068",
      name: "Discrete Mathematics",
      obligation: "COMPULSORY",
      url: "https://www.fit.vut.cz/study/course/281068/",
    });

    // Second table -> SUMMER (same caption, parser toggles semester)
    const summer = year1.SUMMER;
    expect(summer.length).toBe(42);
    expect(summer).toContainEqual({
      abbreviation: "IMA1",
      id: "281065",
      name: "Mathematical Analysis 1",
      obligation: "COMPULSORY",
      url: "https://www.fit.vut.cz/study/course/281065/",
    });
  });
});
