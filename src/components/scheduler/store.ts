import { map, mapValues, reduce } from "lodash-es";
import { ObjectTyped } from "object-typed";
import type { StoreJson } from "~/components/menu/storeJsonValidator";
import type { CustomEvent, DayEvent, EventData, ScheduleEvent } from "~/components/scheduler/event/types";
import { hasOverlap, Time, TimeSpan } from "~/components/scheduler/time";
import type {
  Course,
  Data,
  DayData,
  IScheduleColumn,
  ISchedulerSettings,
  LectureMetrics,
} from "~/components/scheduler/types";
import { percentage } from "~/lib/utils";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type {
  LinkedLectureData,
  MCourseLecture,
  MgetStudyCourseDetailsReturnNotStale,
} from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types";

const defaultSettings: ISchedulerSettings = {
  blockDimensions: {
    width: {
      min: "5.5rem",
      max: "10rem",
    },
    height: "auto",
  },
  columns: [],
  rows: [],
};

export class SchedulerStore implements StoreJson {
  private static readonly defaultSettings: ISchedulerSettings = defaultSettings;
  public settings: ISchedulerSettings;
  public courses: Course[];
  public customEvents: CustomEvent[];
  constructor(
    settings: ISchedulerSettings,
    private readonly eventFilter?: (event: MCourseLecture) => boolean
  ) {
    this.settings = { ...SchedulerStore.defaultSettings, ...settings };
    this.courses = [];
    this.customEvents = [];
  }

  private getEventTypePriority(type: LECTURE_TYPE | "CUSTOM"): number {
    // sorted so that 0 is the highest priority
    switch (type) {
      case LECTURE_TYPE.LECTURE:
        return 0;
      case LECTURE_TYPE.SEMINAR:
        return 1;
      case LECTURE_TYPE.EXERCISE:
        return 2;
      case LECTURE_TYPE.LABORATORY:
        return 3;
      default:
        return 4; // For any other types
    }
  }

  getEmptyData(): Data {
    // TODO: lookup table
    const getDayRow = (day: DAY): number => this.settings.rows.findIndex((row) => row.day === day) + 1;
    return mapValues(DAY, (day) => ({ dayRow: getDayRow(day), dayRows: 1, events: [] }));
  }

  private findAvailableRow(pivotEvent: EventData, precedingEvents: DayEvent[]): number {
    const occupiedRows = new Set<number>();

    // Find all rows that are occupied by overlapping events
    for (const dayEvent of precedingEvents) {
      if (hasOverlap(pivotEvent.event.timeSpan, dayEvent.eventData.event.timeSpan)) {
        occupiedRows.add(dayEvent.row);
      }
    }

    // Find the first available row starting from 1
    let row = 1;
    while (occupiedRows.has(row)) {
      row++;
    }

    return row;
  }

  private sortDayData = (data: DayData) => {
    const { events } = data;
    events.sort(
      (a, b) => this.getEventTypePriority(a.eventData.event.type) - this.getEventTypePriority(b.eventData.event.type)
    );

    // /** using dayRows to mutate the data.dayRows only once */
    // let dayRows = 1
    // Assign rows based on the new order
    data.dayRows = 1;
    events.reduce<DayEvent[]>((acc, event) => {
      const row = this.findAvailableRow(event.eventData, acc);
      data.dayRows = Math.max(data.dayRows, row);
      event.row = row;
      acc.push(event);
      return acc;
    }, []);

    // data.dayRows = dayRows
    return data;
  };

  private sortData = (data: Data) => {
    for (const [day, dayData] of ObjectTyped.entries(data)) {
      data[day] = this.sortDayData(dayData);
    }
    return data;
  };

  private findExistingCourse(courseId: string) {
    return this.courses.find((course) => course.detail.id === courseId);
  }

  private cloneData(data: Data, filterEvents?: (event: DayEvent) => unknown): Data {
    return mapValues(data, (dayData) => {
      const { dayRow, events } = dayData;
      const filteredEvents = filterEvents ? events.filter(filterEvents) : events;
      return { dayRow, dayRows: 1, events: filteredEvents.map((event) => ({ ...event, row: 1 })) };
    });
  }

  public addCustomEvent(event: CustomEvent) {
    this.customEvents.push(event);
  }

  public removeCustomEvent(eventId: string): void {
    const eventIndex = this.customEvents.findIndex((event) => event.id === eventId);
    if (eventIndex === -1) return;
    this.customEvents.splice(eventIndex, 1);
  }

  public getEventData(data: LinkedLectureData): EventData | undefined {
    return this.data[data.day].events.find((event) => event.eventData.event.id === data.id)?.eventData;
  }

  public getEvent(data: LinkedLectureData): ScheduleEvent | CustomEvent | undefined {
    return this.getEventData(data)?.event;
  }

  set newCourses(courses: DataProviderTypes.getStudyCoursesDetailsReturn) {
    if (courses.length === 0) {
      this.courses = [];
      return;
    }
    const coursesData = courses.reduce((acc, newCourse) => {
      if (newCourse.isStale) {
        const existingCourse = this.findExistingCourse(newCourse.detail.id);
        if (existingCourse) acc.push(existingCourse);
        return acc;
      }

      const existingCourse = this.findExistingCourse(newCourse.detail.id);
      if (existingCourse) {
        if (newCourse.detail.link && existingCourse.detail.link !== newCourse.detail.link) {
          existingCourse.detail = newCourse.detail;
        }
        acc.push(existingCourse);
      } else {
        acc.push(createNewCourse(newCourse, this.eventFilter));
      }
      return acc;
    }, [] as Course[]);
    this.courses = coursesData;
    // this.data = this.createDataFromCourses(coursesData);
  }

  /** returns filtered copy of data */
  get checkedData(): Data {
    return this.sortData(this.cloneData(this.data, (event) => event.eventData.event.checked));
  }

  get selected(): Record<LECTURE_TYPE, number>[] {
    return map(this.courses, (course) =>
      reduce(
        course.data,
        (selectedHours, event) => {
          if (event.checked) {
            selectedHours[event.type] = (selectedHours[event.type] || 0) + event.timeSpan.hours;
          }
          return selectedHours;
        },
        {} as Record<LECTURE_TYPE, number>
      )
    );
  }

  get data(): Data {
    // First, initialize data with custom events
    const dataWithCustom = this.getEmptyData();
    for (const event of this.customEvents) {
      const dayEvent = new DayEventObject(this.settings.columns, event.timeSpan).withEventData({
        event,
      });
      dataWithCustom[event.day].events.push(dayEvent);
    }

    // Then add course events
    for (const course of this.courses) {
      for (const event of course.data) {
        const dayEvent = new DayEventObject(this.settings.columns, event.timeSpan).withEventData({
          event,
          courseDetail: course.detail,
          metrics: course.metrics[event.type],
        });
        dataWithCustom[event.day].events.push(dayEvent);
      }
    }

    // Sort the final data
    const sortedData = this.sortData(dataWithCustom);

    return sortedData;
  }
}

export function getEventColumn(event: TimeSpan, columns: IScheduleColumn[]) {
  let colStart = columns.findIndex(
    ({ duration }) => duration.start.minutes <= event.start.minutes && duration.end.minutes > event.start.minutes
  );
  let colEnd =
    colStart >= 0
      ? columns.findIndex(
          ({ duration }) => duration.start.minutes < event.end.minutes && duration.end.minutes >= event.end.minutes
        )
      : -1;
  if (colStart === -1 || colEnd === -1) {
    console.warn("Event is not in any column range", { colStart, colEnd }, event);
    if (colStart === -1) colStart = 0;
    if (colEnd === -1) colEnd = columns.length - 1;
  }
  return { colStart, colEnd };
}

function createNewCourse(
  courseData: MgetStudyCourseDetailsReturnNotStale,
  filter?: (event: MCourseLecture) => boolean
): Course {
  const { data, detail: courseDetail } = courseData;
  const metrics = {} as Record<LECTURE_TYPE, LectureMetrics>;
  const getMetrics = (type: LECTURE_TYPE) => {
    if (!metrics[type]) metrics[type] = { weeks: 0, weeklyLectures: 0 };
    return metrics[type];
  };

  for (const event of data) {
    if (filter && !filter(event)) continue;
    const metric = getMetrics(event.type);

    const timeSpan = event.timeSpan;

    const linkedDuration = event.strongLinked.reduce((acc, linked) => {
      const linkedLecture = data.find((l) => l.id === linked.id);
      if (!linkedLecture) return acc;
      const timeSpan = linkedLecture.timeSpan;
      return acc + timeSpan.minutes;
    }, timeSpan.minutes);

    metric.weeklyLectures = Math.max(metric.weeklyLectures, Time.fromMinutes(linkedDuration).hours);
    metric.weeks = Math.max(metric.weeks, event.weeks.weeks.length);
  }

  return {
    detail: courseDetail,
    metrics,
    // event is created clientside in proveder, assigning to it is safe
    data: map(data, (event) => Object.assign(event, { checked: false }) satisfies ScheduleEvent),
  };
}

export class DayEventObject {
  public readonly row: number;
  public readonly colStart: number;
  public readonly colEnd: number;
  public readonly paddingStart: number;
  public readonly paddingEnd: number;
  public eventData: EventData | undefined;

  constructor(
    public readonly columns: IScheduleColumn[],
    public readonly timeSpan: TimeSpan
    // public readonly eventData: EventData
    // public readonly eventData: EventData
  ) {
    const eventColumn = getEventColumn(timeSpan, columns);
    const startColumnStart = columns[eventColumn.colStart].duration.start;
    const endColumnEnd = columns[eventColumn.colEnd].duration.end;
    const colDurationMin = new TimeSpan(startColumnStart, endColumnEnd).minutes;

    const paddingStart = percentage(new TimeSpan(startColumnStart, timeSpan.start).minutes, colDurationMin);
    const paddingEnd = percentage(new TimeSpan(timeSpan.end, endColumnEnd).minutes, colDurationMin);
    this.row = 1;
    this.colStart = eventColumn.colStart;
    this.colEnd = eventColumn.colEnd;
    this.paddingStart = paddingStart;
    this.paddingEnd = paddingEnd;
  }

  public withEventData(eventData: EventData): DayEventObject & { eventData: EventData } {
    return Object.assign(this, { eventData });
  }
}
