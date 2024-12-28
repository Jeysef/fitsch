import { describe, expect, test } from "vitest";
import { getWeekNumber, getWeekOfMonth } from "./date";

describe("date utilities", () => {
  describe("getWeekNumber", () => {
    test("returns correct week numbers for specific dates", () => {
      // Test cases based on the comments in the implementation
      expect(getWeekNumber(new Date("2014-12-29"))).toBe(1); // Week 1 of 2015
      expect(getWeekNumber(new Date("2012-01-01"))).toBe(52); // Week 52 of 2011

      // Additional test cases
      expect(getWeekNumber(new Date("2023-01-01"))).toBe(52);
      expect(getWeekNumber(new Date("2023-01-02"))).toBe(1);
      expect(getWeekNumber(new Date("2023-07-15"))).toBe(28);
    });
  });

  describe("getWeekOfMonth", () => {
    test("returns correct week of month", () => {
      // Beginning of month
      expect(getWeekOfMonth(new Date("2023-07-01"))).toBe(1);

      // Middle of month
      expect(getWeekOfMonth(new Date("2023-07-15"))).toBe(3);

      // End of month
      expect(getWeekOfMonth(new Date("2023-07-31"))).toBe(6);

      // Sunday edge cases
      expect(getWeekOfMonth(new Date("2023-07-02"))).toBe(1);
      expect(getWeekOfMonth(new Date("2023-07-09"))).toBe(2);

      // Month starting with Sunday
      expect(getWeekOfMonth(new Date("2023-10-01"))).toBe(1);
      expect(getWeekOfMonth(new Date("2023-10-08"))).toBe(2);
    });
  });
});
