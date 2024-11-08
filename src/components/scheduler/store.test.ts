import { beforeEach, describe, expect, test } from "vitest";
import { days } from "~/components/scheduler/constants";
import { createColumns, SchedulerStore } from "~/components/scheduler/store";

describe("scheduler store", () => {
  let store: SchedulerStore
  beforeEach(() => {
    const formatTime = (start: { hour: number, minute: number }, end: { hour: number, minute: number }) =>
      `${start.hour.toString().padStart(2, '0')}:${start.minute.toString().padStart(2, '0')} - ${end.hour.toString().padStart(2, '0')}:${end.minute.toString().padStart(2, '0')}`

    store = new SchedulerStore({
      columns: createColumns({ start: { hour: 7, minute: 0 }, step: { hour: 1, minute: 0 }, end: { hour: 20, minute: 0 }, getTimeHeader: formatTime }),
      rows: days.map(day => ({ title: day, day })),
    })
  })

  test("should have overlap", () => {
    const events1 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 17, minute: 0 }
    }
    const events2 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 16, minute: 50 }
    }
    expect(store.hasOverlap(events1, events2)).toBe(true)
    expect(store.hasOverlap(events2, events1)).toBe(true)
  });

  test("should not have overlaps", () => {
    const event1 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 17, minute: 0 }
    }
    const event2 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 16, minute: 50 }
    }
    const event3 = {
      start: { hour: 16, minute: 0 },
      end: { hour: 17, minute: 50 }
    }
    expect([event2, event3].filter(e => store.hasOverlap(event1, e)).length).toBe(2)
    expect([event1, event3].filter(e => store.hasOverlap(event2, e)).length).toBe(2)
    expect([event1, event2].filter(e => store.hasOverlap(event3, e)).length).toBe(2)

    expect([event3, event2].filter(e => store.hasOverlap(event1, e)).length).toBe(2)
    expect([event3, event1].filter(e => store.hasOverlap(event2, e)).length).toBe(2)
    expect([event2, event1].filter(e => store.hasOverlap(event3, e)).length).toBe(2)
  });
})