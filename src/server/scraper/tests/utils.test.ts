import { describe, expect, test } from "vitest";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import {
  conjunctConjunctableRooms,
  constructGradeLabel,
  createStudyId,
  getParityOfWeeks,
  getWeekFromSemesterStart,
  parseWeek,
  removeSpaces,
} from "~/server/scraper/utils";
import { LANGUAGE } from "../../../enums";
import { WEEK_PARITY } from "../enums";

describe("utils", () => {
  test("should remove spaces", async () => {
    const text = "sdsd\n\n           ds";
    const result = removeSpaces(text);
    expect(result).toBe("sdsd ds");
  });

  test("should construct grade label", async () => {
    const grade = "1";
    const programAbbreviation = "BIT";
    const result = constructGradeLabel(grade, programAbbreviation);
    expect(result).toBe("1BIT");
  });
  test("should construct ALL grade label", async () => {
    const grade = "ALL";
    const programAbbreviation = "BIT";
    const result = constructGradeLabel(grade, programAbbreviation);
    expect(result).toBe("ALL-BIT");
  });
  test.each([
    ["https://www.fit.vut.cz/study/program/9229/.cs", "program-9229"],
    ["https://www.fit.vut.cz/study/field/17280/.cs", "field-17280"],
    ["https://www.fit.vut.cz/study/program/8954/.cs", "program-8954"],
  ])("should create study id", async (url, expected) => {
    const result = createStudyId(url);
    expect(result).toEqual(expected);
  });
});

describe("week parsing", () => {
  const languageProvider = new LanguageProvider(LANGUAGE.ENGLISH);

  const commonTestCases: [string, { weeks: number[] | string; parity: WEEK_PARITY | null }][] = [
    ["1., 2., 3., 4., 5., 6. of lectures", { weeks: [1, 2, 3, 4, 5, 6], parity: null }],
    ["odd week", { weeks: "odd week", parity: WEEK_PARITY.ODD }],
    ["even week", { weeks: "even week", parity: WEEK_PARITY.EVEN }],
  ];

  const semesterStarts = [
    { date: "2024-09-16", type: "winter", firstWeekParity: WEEK_PARITY.EVEN },
    { date: "2025-02-10", type: "summer", firstWeekParity: WEEK_PARITY.ODD },
    { date: "2025-09-15", type: "winter", firstWeekParity: WEEK_PARITY.EVEN },
    { date: "2026-02-09", type: "summer", firstWeekParity: WEEK_PARITY.ODD },
  ] as const;

  for (const { date, type, firstWeekParity } of semesterStarts) {
    describe(`${type} semester starting ${date}`, () => {
      const startDate = new Date(date);
      const secondWeekParity = firstWeekParity === WEEK_PARITY.EVEN ? WEEK_PARITY.ODD : WEEK_PARITY.EVEN;

      test.each([
        ...commonTestCases,
        [new Date(startDate).toISOString().split("T")[0], { weeks: [1], parity: firstWeekParity }],
        [
          new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          { weeks: [2], parity: secondWeekParity },
        ],
        ["1., 3., 5., 7., 9., 11. of lectures", { weeks: [1, 3, 5, 7, 9, 11], parity: firstWeekParity }],
        ["2., 4., 6., 8., 10., 12. of lectures", { weeks: [2, 4, 6, 8, 10, 12], parity: secondWeekParity }],
      ])("should parse week %s", async (input, expected) => {
        const result = parseWeek(input, startDate, await languageProvider.languageSet);
        expect(result).toEqual(expected);
      });
    });
  }
});

describe("week calculations", () => {
  const startDate = new Date("2024-09-16T00:00:00.000Z");

  test.each([
    [new Date("2024-09-17"), 1],
    [new Date("2024-09-24"), 2],
    [new Date("2024-10-01"), 3],
    [new Date("2024-10-08"), 4],
  ])("should calculate week number from semester start for %s", (date, expected) => {
    const result = getWeekFromSemesterStart(date, startDate);
    expect(result).toBe(expected);
  });

  test.each([
    [[1, 3, 5, 7], WEEK_PARITY.EVEN],
    [[2, 4, 6, 8], WEEK_PARITY.ODD],
    [[1, 2, 3, 4], null],
    [[1], WEEK_PARITY.EVEN],
    [[2], WEEK_PARITY.ODD],
  ])("should determine parity for weeks %s", (weeks, expected) => {
    const result = getParityOfWeeks(weeks, startDate);
    expect(result).toBe(expected);
  });
});

describe("room utils", () => {
  test("should get conjuncted rooms", async () => {
    let roomsInput = ["E104", "E112", "D0206"];
    const courses = conjunctConjunctableRooms(roomsInput);
    expect(courses).toBe("E112+4 D0206");

    roomsInput = ["E104", "E112", "D0206", "D0207"];
    const courses2 = conjunctConjunctableRooms(roomsInput);
    expect(courses2).toBe("E112+4 D0206 D0207");

    roomsInput = ["E104", "E105", "E112"];
    const courses3 = conjunctConjunctableRooms(roomsInput);
    expect(courses3).toBe("E112+4,5");

    roomsInput = ["D0206", "D105"];
    const courses4 = conjunctConjunctableRooms(roomsInput);
    expect(courses4).toBe("D105+6");

    roomsInput = ["N103", "N104", "N105"];
    const courses5 = conjunctConjunctableRooms(roomsInput);
    expect(courses5).toBe("N103+4,5");
  });
});
