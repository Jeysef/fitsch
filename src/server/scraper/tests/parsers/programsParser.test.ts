import { load } from "cheerio";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ProgramsParser } from "~/server/scraper/parsers/programs/vutFitProgramsParser";

describe("ProgramsParser", () => {
  it("parses programs list, specializations, and years", () => {
    const html = readFileSync(join(__dirname, "../htmls/programs.html"), "utf-8");
    const $ = load(html);
    const parser = new ProgramsParser();

    const result = parser.parse($);

    // degree bucket populated
    expect(result.programs.BACHELOR.length).toBe(2);
    expect(result.programs.MASTER.length).toBe(2);
    expect(result.programs.DOCTORAL.length).toBe(7);
    // program core fields
    const p = result.programs.BACHELOR[0];
    expect(p.name).toBe("Information Technology");
    expect(p.url).toBe("https://www.fit.vut.cz/study/program/8953/");
    expect(p.abbreviation).toBe("BIT");
    expect(p.specializations.length).toBe(0);
    // specialization captured
    const ps = result.programs.MASTER[1];
    expect(ps.specializations.length).toBe(17);
    expect(ps.specializations[0].abbreviation).toBe("NADE");
    expect(ps.specializations[0].name).toBe("Application Development");
    // year select parsed
    expect(result.currentYear.value).toBe("2024");
    expect(result.currentYear.label).toBe("2024/2025");
    expect(result.years.map((y) => y.value)).toEqual(expect.arrayContaining(["2024", "2023"]));
  });
});
