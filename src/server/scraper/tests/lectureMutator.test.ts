import { describe, it } from "vitest";
import { fillMissingWeeks } from "~/server/scraper/lectureMutator";
import { getWeekFromSemesterStart } from "~/server/scraper/utils";

describe("conjunctLectures", () => {
  const semesterTimeSchedule = {
    start: new Date("2024-09-16"),
    end: new Date("2025-012-13"),
  };
  const semesterWeeks = getWeekFromSemesterStart(semesterTimeSchedule.end, semesterTimeSchedule.start);
  it("should fill missing weeks", () => {
    const lectures: any = [
      {
        weeks: {
          weeks: "lichý",
          parity: "ODD",
        },
        lecturesCount: 6,
      },
    ];
    const newData = fillMissingWeeks(semesterWeeks)(lectures);
    console.log(
      "🚀 ~ newData:",
      newData.map((l) => l.weeks)
    );
  });
});
