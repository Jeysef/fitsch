import { describe, expect, it } from "vitest";
import { parseStoreJson } from "~/components/menu/storeJsonValidator";
import { ClassRegistry } from "~/components/scheduler/classRegistry";
import { createColumns, SchedulerStore } from "~/components/scheduler/store";
import { days, end, start, step } from "~/config/scheduler";
import { type DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";
import validSchedule from "./validSchedule.json";

describe("Test schedule parsing", () => {
  it("should parse schedule", () => {
    const stringifiedData = JSON.stringify(validSchedule);
    const parsedData = JSON.parse(stringifiedData, ClassRegistry.reviver);
    const schedule = parseStoreJson(parsedData);
    expect(schedule.error).toBeUndefined();
    expect(schedule.success).toBe(true);
    expect(schedule.data).toBeDefined();
  });
  it("should parse schedule store", () => {
    const formatTime = (start: { hour: number; minute: number }, end: { hour: number; minute: number }) =>
      `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}\u00A0- ${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;
    const formatDay = (day: DAY) => ({ day });
    const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);
    const store = new SchedulerStore(
      {
        columns: createColumns({
          start: start,
          step: step,
          end: end,
          getTimeHeader: formatTime,
        }),
        rows: days.map(formatDay),
      },
      filter
    );
    const schedule = parseStoreJson(store);
    expect(schedule.error).toBeUndefined();
    expect(schedule.success).toBe(true);
    expect(schedule.data).toBeDefined();
  });
});
