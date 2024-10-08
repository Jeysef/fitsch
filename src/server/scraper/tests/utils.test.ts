import { describe, expect, test } from 'vitest';
import { SEMESTER } from '~/server/scraper/types';
import { conjunctRooms, constructGradeLabel, createStudyId, parseWeek, removeSpaces } from "~/server/scraper/utils";

describe('utils', () => {
  test("should get conjuncted rooms", async () => {
    let roomsInput = ["E104", "E112", "D0206"];
    const courses = conjunctRooms(roomsInput);
    expect(courses).toBe("E112+4 D0206");

    roomsInput = ["E104", "E112", "D0206", "D0207"];
    const courses2 = conjunctRooms(roomsInput);
    expect(courses2).toBe("E112+4 D0206 D0207");

    roomsInput = ["E104", "E105", "E112"];
    const courses3 = conjunctRooms(roomsInput);
    expect(courses3).toBe("E112+4,5");

    roomsInput = ["D0206", "D105"];
    const courses4 = conjunctRooms(roomsInput);
    expect(courses4).toBe("D105+6");
  })

  test("should remove spaces", async () => {
    const text = "sdsd\n\n           ds";
    const result = removeSpaces(text);
    expect(result).toBe("sdsd ds");
  })

  test("should construct grade label", async () => {
    const grade = "1";
    const programAbbreviation = "BIT";
    const result = constructGradeLabel(grade, programAbbreviation);
    expect(result).toBe("1BIT");
  })
  test("should construct ALL grade label", async () => {
    const grade = "ALL";
    const programAbbreviation = "BIT";
    const result = constructGradeLabel(grade, programAbbreviation);
    expect(result).toBe("ALL-BIT");
  })
  test.each([
    ["https://www.fit.vut.cz/study/program/9229/.cs", "program-9229"],
    ["https://www.fit.vut.cz/study/field/17280/.cs", "field-17280"],
    ["https://www.fit.vut.cz/study/program/8954/.cs", "program-8954"],
  ])("should create study id", async (url, expected) => {
    const result = createStudyId(url);
    expect(result).toEqual(expected);
  })

  test.each([
    ["1., 2., 3., 4., 5., 6. výuky", "1. 2. 3. 4. 5. 6."],
    ["7., 8., 10., 11., 12., 13. výuky", "7. 8. 10. 11. 12. 13."],
    ["2024-09-17", "1."],
    ["2024-09-24", "2."],
    ["výuky", ""],
    ["6., 10. výuky", "6. 10."],
    ["1., 2., 6., 7., 8., 9., 10., 12., 13. výuky", "1. 2. 6. 7. 8. 9. 10. 12. 13."],
    ["1., 2., 3., 4., 5., 6., 8., 9., 10., 11., 12., 13. výuky", "1. 2. 3. 4. 5. 6. 8. 9. 10. 11. 12. 13."],
    ["lichý", "lichý"],
    ["sudý", "sudý"],
    ["2024-09-15", null],
    ["2025-04-15", "10."],
  ])("should get weeks", async (weeksText, expected) => {
    const startDates = {
      [SEMESTER.WINTER]: new Date('2024-09-16T00:00:00.000Z'),
      [SEMESTER.SUMMER]: new Date('2025-02-10T00:00:00.000Z')
    }
    const result = parseWeek(weeksText, startDates);
    expect(result).toBe(expected);
  })

})