import { describe, expect, it } from "vitest";
import { end, rows, start, step } from "~/config/scheduler";
import { SchedulerStore } from "~/store/store";
import { parseStoreJsonSync } from "~/store/storeSchema";
import { createColumns, filter, formatTime } from "~/store/utils";

describe("Test schedule parsing", () => {
  // it("should parse schedule", () => {
  //   const stringifiedData = JSON.stringify(validSchedule);
  //   const parsedData = JSON.parse(stringifiedData, ClassRegistry.reviver);
  //   const schedule = parseStoreJsonSync(parsedData);
  //   console.log("err", schedule.error);
  //   expect(schedule.error).toBeUndefined();
  //   expect(schedule.success).toBe(true);
  //   expect(schedule.data).toBeDefined();
  // });
  it("should parse schedule store", () => {
    const store = new SchedulerStore(
      {
        columns: createColumns({
          start: start,
          step: step,
          end: end,
          getTimeHeader: formatTime,
        }),
        rows,
      },
      filter
    );
    const schedule = parseStoreJsonSync(store);
    expect(schedule.error).toBeUndefined();
    expect(schedule.success).toBe(true);
    expect(schedule.data).toBeDefined();
  });
});
