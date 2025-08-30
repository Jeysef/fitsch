import { range, zipObject } from "es-toolkit";
import { beforeEach, describe, expect, it } from "vitest";
import type { CustomEvent } from "~/components/scheduler/event/types";
import { days, end, start, step } from "~/config/scheduler";
import { DAY } from "~/enums/enums";
import { Time, TimeSpan } from "~/lib/time/time";
import { createColumns } from "~/providers/SchedulerProvider";
import { getRandomBoolean, getRandomEnum, getRandomId, getRandomNumber } from "~/server/scraper/tests/utils/common";
import { getRandomText } from "~/server/scraper/tests/utils/text";
import { SchedulerStore } from "~/store/store";
import type { IScheduleRows } from "~/store/store.types";
import { adaptSchedulerStore, type AdaptedSchedulerStore } from "~/store/storeAdapter";

// Formatter for time headers in the scheduler columns (e.g., "08:00–08:50")
const formatTime = (start: Time, end: Time) =>
  `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}–${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;

// Filter function to exclude certain lecture types (e.g., exams, notes) from the main schedule display

// Define the rows for the scheduler grid, mapping days to row numbers
const rows = zipObject(days, range(1, days.length + 1)) as IScheduleRows;

// Generate the columns based on configured start/end times and step duration
const columns = createColumns({
  start,
  step,
  end,
  getTimeHeader: formatTime,
});

describe("TestSchedulerStore", () => {
  let store: AdaptedSchedulerStore;

  beforeEach(() => {
    store = adaptSchedulerStore(new SchedulerStore({ columns, rows }));
  });

  it("should be created with settings", () => {
    expect(store.settings.columns).toEqual(columns);
    expect(store.settings.rows).toEqual(rows);
  });

  it("should be created with empty data", () => {
    expect(store.data.length).toBe(5);
    expect(store.data[0].dayRow).toBe(1);
    expect(store.data[1].dayRow).toBe(2);
    expect(store.data[2].dayRow).toBe(3);
    expect(store.data[3].dayRow).toBe(4);
    expect(store.data[4].dayRow).toBe(5);
  });

  it("should be able to add custom events", () => {
    const event = getRandomEvent();
    store.addCustomEvent(event);
    expect(store.customEvents.length).toBe(1);
    expect(store.customEvents.find((e) => e.id === event.id)).toBeDefined();
  });

  it("should be able to add custom events and have data", () => {
    store.addCustomEvent(getRandomEvent({ day: DAY.MON }));

    const data = store.data;
    expect(data.length).toBe(5);
    expect(data[0].events.length).toBe(1);
  });

  it("should be able to sort data", () => {
    store.addCustomEvent(getRandomEvent({ day: DAY.MON }));
    store.addCustomEvent(getRandomEvent({ day: DAY.MON }));
  });
});

const getRandomEvent = (e: Partial<CustomEvent> = {}): CustomEvent => {
  const id = getRandomId().toString();
  const day = getRandomEnum(DAY);
  const timeSpan = new TimeSpan(
    new Time({ hour: getRandomNumber(0, 23), minute: getRandomNumber(0, 59) }),
    new Time({ hour: getRandomNumber(0, 23), minute: getRandomNumber(0, 59) })
  );
  const title = getRandomText(3);
  const info = getRandomText(4);
  const color = "red";
  const type = "CUSTOM";

  return {
    id: e.id ?? id,
    day: e.day ?? day,
    timeSpan: e.timeSpan ?? timeSpan,
    title: e.title ?? title,
    info: e.info ?? info,
    checked: e.checked ?? getRandomBoolean(),
    hidden: e.hidden ?? getRandomBoolean(),
    collapsed: e.collapsed ?? getRandomBoolean(),
    color: e.color ?? color,
    type: e.type ?? type,
  };
};
