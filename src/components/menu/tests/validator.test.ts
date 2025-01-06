import { describe, expect, it } from "vitest";
import { parseStoreJson } from "~/components/menu/storeJsonValidator";
import { ClassRegistry } from "~/components/scheduler/classRegistry";
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
});
