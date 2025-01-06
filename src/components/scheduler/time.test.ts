import { describe, expect, test } from "vitest";
import type { ISchedulerTime } from "~/components/scheduler/types";
import { Time, TimeSpan, hasOverlap, hourDifference } from "./time";

describe("Time", () => {
  test("should correctly create Time instance", () => {
    const time = new Time({ hour: 14, minute: 30 });
    expect(time.hour).toBe(14);
    expect(time.minute).toBe(30);
  });

  test("should calculate total minutes", () => {
    const time = new Time({ hour: 2, minute: 30 });
    expect(time.minutes).toBe(150); // 2 * 60 + 30
  });

  test("should calculate hours rounded up", () => {
    const time1 = new Time({ hour: 2, minute: 0 });
    const time2 = new Time({ hour: 2, minute: 1 });
    expect(time1.hours).toBe(2);
    expect(time2.hours).toBe(3);
  });

  test("should create from minutes", () => {
    const time = Time.fromMinutes(150);
    expect(time.hour).toBe(2);
    expect(time.minute).toBe(30);
  });

  test("should create from string", () => {
    const time = Time.fromString("14:30");
    expect(time.hour).toBe(14);
    expect(time.minute).toBe(30);

    const timeCustomSeparator = Time.fromString("14-30", "-");
    expect(timeCustomSeparator.hour).toBe(14);
    expect(timeCustomSeparator.minute).toBe(30);
  });

  test("should format time correctly", () => {
    const time1 = new Time({ hour: 9, minute: 5 });
    const time2 = new Time({ hour: 14, minute: 30 });
    expect(time1.formatted()).toBe("09:05");
    expect(time2.formatted()).toBe("14:30");
  });
});

describe("TimeSpan", () => {
  test("should correctly create TimeSpan instance", () => {
    const start = new Time({ hour: 14, minute: 30 });
    const end = new Time({ hour: 15, minute: 45 });
    const timeSpan = new TimeSpan(start, end);

    expect(timeSpan.start).toBe(start);
    expect(timeSpan.end).toBe(end);
  });

  test("should calculate duration in minutes", () => {
    const timeSpan = new TimeSpan(new Time({ hour: 14, minute: 30 }), new Time({ hour: 15, minute: 45 }));
    expect(timeSpan.minutes).toBe(75); // (15 * 60 + 45) - (14 * 60 + 30)
  });

  test("should calculate duration in hours rounded up", () => {
    const timeSpan1 = new TimeSpan(new Time({ hour: 14, minute: 0 }), new Time({ hour: 15, minute: 0 }));
    const timeSpan2 = new TimeSpan(new Time({ hour: 14, minute: 0 }), new Time({ hour: 15, minute: 1 }));

    expect(timeSpan1.hours).toBe(1);
    expect(timeSpan2.hours).toBe(2);
  });

  test("should create from plain object", () => {
    const plainTimeSpan = {
      start: { hour: 14, minute: 30 },
      end: { hour: 15, minute: 45 },
    };
    const timeSpan = timespanFromPlain(plainTimeSpan);

    expect(timeSpan.start.hour).toBe(14);
    expect(timeSpan.start.minute).toBe(30);
    expect(timeSpan.end.hour).toBe(15);
    expect(timeSpan.end.minute).toBe(45);
  });
});

describe("hasOverlap", () => {
  test("should detect overlapping time spans", () => {
    const cases = [
      // Complete overlap
      {
        a: { start: { hour: 14, minute: 0 }, end: { hour: 16, minute: 0 } },
        b: { start: { hour: 14, minute: 0 }, end: { hour: 16, minute: 0 } },
        expected: true,
      },
      // Partial overlap
      {
        a: { start: { hour: 14, minute: 0 }, end: { hour: 16, minute: 0 } },
        b: { start: { hour: 15, minute: 0 }, end: { hour: 17, minute: 0 } },
        expected: true,
      },
      // Edge touch
      {
        a: { start: { hour: 14, minute: 0 }, end: { hour: 15, minute: 0 } },
        b: { start: { hour: 15, minute: 0 }, end: { hour: 16, minute: 0 } },
        expected: false,
      },
      // No overlap
      {
        a: { start: { hour: 14, minute: 0 }, end: { hour: 15, minute: 0 } },
        b: { start: { hour: 16, minute: 0 }, end: { hour: 17, minute: 0 } },
        expected: false,
      },
    ];

    for (const { a, b, expected } of cases) {
      const timeSpanA = timespanFromPlain(a);
      const timeSpanB = timespanFromPlain(b);
      expect(hasOverlap(timeSpanA, timeSpanB)).toBe(expected);
      // Test symmetry
      expect(hasOverlap(timeSpanB, timeSpanA)).toBe(expected);
    }
  });

  test("should detect various overlap scenarios", () => {
    const events1 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 17, minute: 0 },
    };
    const events2 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 16, minute: 50 },
    };

    const span1 = timespanFromPlain(events1);
    const span2 = timespanFromPlain(events2);
    expect(hasOverlap(span1, span2)).toBe(true);
    expect(hasOverlap(span2, span1)).toBe(true);

    const event3 = {
      start: { hour: 10, minute: 0 },
      end: { hour: 11, minute: 50 },
    };
    const event4 = {
      start: { hour: 11, minute: 0 },
      end: { hour: 12, minute: 50 },
    };

    const span3 = timespanFromPlain(event3);
    const span4 = timespanFromPlain(event4);
    expect(hasOverlap(span3, span4)).toBe(true);
  });

  test("should correctly identify multiple overlapping events", () => {
    const event1 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 17, minute: 0 },
    };
    const event2 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 16, minute: 50 },
    };
    const event3 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 17, minute: 50 },
    };

    const spans = [event1, event2, event3].map(timespanFromPlain);

    // Test that event1 overlaps with both event2 and event3
    expect(spans.slice(1).filter((e) => hasOverlap(spans[0], e)).length).toBe(2);

    // Test that event2 overlaps with both event1 and event3
    expect([spans[0], spans[2]].filter((e) => hasOverlap(spans[1], e)).length).toBe(2);

    // Test that event3 overlaps with both event1 and event2
    expect(spans.slice(0, 2).filter((e) => hasOverlap(spans[2], e)).length).toBe(2);

    // Test with different ordering
    expect([spans[2], spans[1]].filter((e) => hasOverlap(spans[0], e)).length).toBe(2);
    expect([spans[2], spans[0]].filter((e) => hasOverlap(spans[1], e)).length).toBe(2);
    expect([spans[1], spans[0]].filter((e) => hasOverlap(spans[2], e)).length).toBe(2);
  });
});

describe("hourDifference", () => {
  test("should calculate absolute hour difference", () => {
    expect(hourDifference(14, 16)).toBe(2);
    expect(hourDifference(16, 14)).toBe(2);
    expect(hourDifference(14, 14)).toBe(0);
  });
});

function timespanFromPlain(timeSpan: { start: ISchedulerTime; end: ISchedulerTime }) {
  return new TimeSpan(new Time(timeSpan.start), new Time(timeSpan.end));
}
