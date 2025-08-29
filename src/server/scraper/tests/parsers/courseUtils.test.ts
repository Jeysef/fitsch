import { describe, expect, it, test } from "vitest";
import { LANGUAGE } from "~/enums";
import { LECTURE_TYPE, WEEK_PARITY } from "~/server/scraper/enums";
import { parseCourseTimeSpan, parseWeek } from "~/server/scraper/parsers/course/utils";
import { getLanguageSet } from "~/server/scraper/tests/mocks/languageSet.mock";

describe("Course parser utils", () => {
  const languageSet = getLanguageSet(LANGUAGE.CZECH);
  const semesterStart = new Date("2024-09-16T00:00:00.000Z");

  test.each([
    [
      "1., 2., 3., 6., 8., 12., 13. výuky",
      {
        parity: null,
        weeks: [1, 2, 3, 6, 8, 12, 13],
      },
    ],
    [
      "2024-12-09",
      {
        parity: WEEK_PARITY.EVEN,
        weeks: [13],
      },
    ],
    ["3., 5., 8., 10. výuky", { parity: null, weeks: [3, 5, 8, 10] }],
    ["3., 5., 7., 9., 11., 13. výuky", { parity: WEEK_PARITY.EVEN, weeks: [3, 5, 7, 9, 11, 13] }],
    [
      "lichý",
      {
        parity: WEEK_PARITY.ODD,
        weeks: "lichý",
      },
    ],
    ["3. 5. 7. 9. 11. 13", { parity: WEEK_PARITY.EVEN, weeks: [3, 5, 7, 9, 11, 13] }],
    ["výuky", { parity: null, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }],
  ])("parses week", (weeks, expected) => {
    const result = parseWeek(weeks, semesterStart, languageSet);
    expect(result).toEqual(expected);
  });

  it("should parseCourseTimeSpan", () => {
    const timeSpan = ["26 hod. přednášky", "26 hod. cvičení"];
    const result = parseCourseTimeSpan(timeSpan, languageSet);
    expect(result).toEqual({
      [LECTURE_TYPE.LECTURE]: 26,
      [LECTURE_TYPE.EXERCISE]: 26,
    });
  });
});
