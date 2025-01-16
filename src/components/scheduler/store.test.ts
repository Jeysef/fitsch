import { beforeEach, describe, expect, test } from "vitest";
import type { DayEvent, EventData } from "~/components/scheduler/event/types";
import { SchedulerStore, createColumns } from "~/components/scheduler/store";
import { Time, TimeSpan } from "~/components/scheduler/time";
import { days } from "~/config/scheduler";

describe("scheduler store", () => {
  let store: SchedulerStore;
  beforeEach(() => {
    const formatTime = (start: { hour: number; minute: number }, end: { hour: number; minute: number }) =>
      `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")} - ${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;

    store = new SchedulerStore({
      columns: createColumns({
        start: new Time({ hour: 7, minute: 0 }),
        step: new Time({ hour: 1, minute: 0 }),
        end: new Time({ hour: 20, minute: 0 }),
        getTimeHeader: formatTime,
      }),
      rows: days.map((day) => ({ title: day, day })),
    });
  });

  test("findAvailableRow should return 1 for first event", () => {
    const pivotEvent: EventData = {
      // @ts-expect-error not all needed
      event: {
        timeSpan: new TimeSpan(new Time({ hour: 10, minute: 0 }), new Time({ hour: 11, minute: 0 })),
      },
    };
    const precedingEvents = [] as const;

    // @ts-ignore
    expect(store.findAvailableRow(pivotEvent, precedingEvents)).toBe(1);
  });

  test("findAvailableRow should return next available row for overlapping events", () => {
    const pivotEvent: EventData = {
      // @ts-expect-error not all needed
      event: {
        timeSpan: new TimeSpan(new Time({ hour: 10, minute: 0 }), new Time({ hour: 11, minute: 0 })),
      },
    };
    const precedingEvents: DayEvent[] = [
      {
        row: 1,
        eventData: {
          // @ts-expect-error not all needed
          event: {
            timeSpan: new TimeSpan(new Time({ hour: 10, minute: 30 }), new Time({ hour: 11, minute: 30 })),
          },
        },
      },
    ];

    // @ts-ignore
    expect(store.findAvailableRow(pivotEvent, precedingEvents)).toBe(2);
  });

  test("findAvailableRow should reuse row for non-overlapping events", () => {
    const pivotEvent: EventData = {
      // @ts-expect-error not all needed
      event: {
        timeSpan: new TimeSpan(new Time({ hour: 12, minute: 0 }), new Time({ hour: 13, minute: 0 })),
      },
    };
    const precedingEvents: DayEvent[] = [
      {
        row: 1,
        eventData: {
          // @ts-expect-error not all needed
          event: {
            timeSpan: new TimeSpan(new Time({ hour: 10, minute: 0 }), new Time({ hour: 11, minute: 0 })),
          },
        },
      },
    ];

    // @ts-ignore
    expect(store.findAvailableRow(pivotEvent, precedingEvents)).toBe(1);
  });

  test("findAvailableRow should find first available gap", () => {
    const pivotEvent: EventData = {
      // @ts-expect-error not all needed
      event: {
        timeSpan: new TimeSpan(new Time({ hour: 10, minute: 0 }), new Time({ hour: 11, minute: 0 })),
      },
    };
    const precedingEvents: DayEvent[] = [
      {
        row: 1,
        eventData: {
          // @ts-expect-error not all needed
          event: {
            timeSpan: new TimeSpan(new Time({ hour: 10, minute: 0 }), new Time({ hour: 11, minute: 0 })),
          },
        },
      },
      {
        row: 2,
        eventData: {
          // @ts-expect-error not all needed
          event: {
            timeSpan: new TimeSpan(new Time({ hour: 10, minute: 0 }), new Time({ hour: 11, minute: 0 })),
          },
        },
      },
      {
        row: 4,
        eventData: {
          // @ts-expect-error not all needed
          event: {
            timeSpan: new TimeSpan(new Time({ hour: 10, minute: 0 }), new Time({ hour: 11, minute: 0 })),
          },
        },
      },
    ];

    // @ts-ignore
    expect(store.findAvailableRow(pivotEvent, precedingEvents)).toBe(3);
  });

  test("findAvailableRow should fit 30 min event in gap", () => {
    const pivotEvent: EventData = {
      // @ts-expect-error not all needed
      event: {
        timeSpan: new TimeSpan(new Time({ hour: 10, minute: 0 }), new Time({ hour: 10, minute: 30 })),
      },
    };
    const precedingEvents: DayEvent[] = [
      {
        row: 1,
        eventData: {
          // @ts-expect-error not all needed
          event: {
            timeSpan: new TimeSpan(new Time({ hour: 9, minute: 0 }), new Time({ hour: 10, minute: 0 })),
          },
        },
      },
      {
        row: 1,
        eventData: {
          // @ts-expect-error not all needed
          event: {
            timeSpan: new TimeSpan(new Time({ hour: 10, minute: 30 }), new Time({ hour: 11, minute: 30 })),
          },
        },
      },
    ];

    // @ts-ignore
    expect(store.findAvailableRow(pivotEvent, precedingEvents)).toBe(1);
  });
});
