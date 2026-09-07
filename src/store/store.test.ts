import { range, zipObject } from "es-toolkit";
import { createComputed, createRoot } from "solid-js";
import { createMutable } from "solid-js/store";
import { beforeEach, describe, expect, it } from "vitest";
import type { CustomEvent, ScheduleEvent } from "~/components/scheduler/event/types";
import { days, end, start, step } from "~/config/scheduler";
import { DAY, LECTURE_TYPE } from "~/enums/enums";
import { Time, TimeSpan } from "~/lib/time/time";
import type { CourseDetail } from "~/server/scraper/types/course.types";
import type { LectureMutator } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types/data.types";
import { getRandomBoolean, getRandomEnum, getRandomId, getRandomNumber } from "~/server/scraper/tests/utils/common";
import { getRandomText } from "~/server/scraper/tests/utils/text";
import { SchedulerStore } from "~/store/store";
import type { IScheduleRows } from "~/store/store.types";
import { adaptSchedulerStore, type AdaptedSchedulerStore } from "~/store/storeAdapter";
import { createColumns } from "~/store/utils";
import { makeAutoMemoStore } from "~/utils/store/autoMemo";

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

describe("linked events", () => {
  const monId = "mon-id";
  const wedId = "wed-id";

  const lecture = (over: Partial<LectureMutator.MutatedLecture>): LectureMutator.MutatedLecture =>
    ({
      id: "id",
      day: DAY.MON,
      type: LECTURE_TYPE.LECTURE,
      timeSpan: new TimeSpan(new Time({ hour: 8, minute: 0 }), new Time({ hour: 9, minute: 0 })),
      capacity: "100",
      groups: "1",
      lectureGroup: ["01"],
      note: "",
      room: ["A01"],
      weeks: { parity: null, weeks: range(1, 15) },
      strongLinked: [],
      linked: [],
      ...over,
    }) as LectureMutator.MutatedLecture;

  const mutatedCourse = (): LectureMutator.MutatedCourse => ({
    detail: { id: "EZP", abbreviation: "EZP" } as CourseDetail,
    data: [
      lecture({ id: monId, day: DAY.MON, strongLinked: [{ id: wedId, day: DAY.WED }] }),
      lecture({ id: wedId, day: DAY.WED, strongLinked: [{ id: monId, day: DAY.MON }] }),
    ],
  });

  const getEvents = (store: AdaptedSchedulerStore) =>
    store.data.flatMap((day) => day.events.map((e) => e.event)) as ScheduleEvent[];

  /**
   * Lookups have to return objects of the reactive store, otherwise mutating a linked event
   * doesn't notify subscribers and its checkbox never updates in the UI.
   */
  it("should return linked events of the reactive store", () => {
    createRoot((dispose) => {
      const store = adaptSchedulerStore(makeAutoMemoStore(createMutable(new SchedulerStore({ columns, rows }))));
      store.newCourses = [mutatedCourse()] as unknown as DataProviderTypes.getStudyCoursesDetailsReturn;

      const events = getEvents(store);
      const mon = events.find((e) => e.id === monId)!;
      const wed = events.find((e) => e.id === wedId)!;

      expect(store.getLinkedEvent({ id: wedId, day: DAY.WED }, mon.courseId)).toBe(wed);

      let trackedWedChecked = 0;
      createComputed(() => {
        void wed.checked;
        trackedWedChecked++;
      });

      mon.checked = true;
      store.getLinkedEvent({ id: wedId, day: DAY.WED }, mon.courseId)!.checked = true;

      expect(wed.checked).toBe(true);
      expect(trackedWedChecked).toBe(2);

      dispose();
    });
  });

  it("should keep linked events resolvable after courses are reconciled", () => {
    const store = adaptSchedulerStore(makeAutoMemoStore(createMutable(new SchedulerStore({ columns, rows }))));
    store.newCourses = [mutatedCourse()] as unknown as DataProviderTypes.getStudyCoursesDetailsReturn;

    const wedBefore = getEvents(store).find((e) => e.id === wedId)!;
    store.newCourses = [mutatedCourse()] as unknown as DataProviderTypes.getStudyCoursesDetailsReturn;

    expect(store.getLinkedEvent({ id: wedId, day: DAY.WED }, "EZP")).toBe(getEvents(store).find((e) => e.id === wedId));
    expect(store.getLinkedEvent({ id: wedId, day: DAY.WED }, "EZP")).not.toBe(wedBefore);
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
    grayedOut: e.grayedOut ?? getRandomBoolean(),
    color: e.color ?? color,
    type: e.type ?? type,
  };
};
