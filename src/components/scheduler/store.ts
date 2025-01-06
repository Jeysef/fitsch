import { forEach, mapValues, reduce } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { hasOverlap, Time, TimeSpan } from "~/components/scheduler/time";
import type {
  CourseData,
  Data,
  DayData,
  DayEvent,
  Event,
  ICreateColumns,
  IScheduleColumn,
  ISchedulerSettings,
  LectureMetrics,
} from "~/components/scheduler/types";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture, MgetStudyCourseDetailsReturn } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types";

// TODO: test
export function createColumns(config: ICreateColumns): IScheduleColumn[] {
  // create columns from start to end with step
  const columns: IScheduleColumn[] = [];
  let start = new Time(config.start);
  const end = new Time(config.end);
  const step = new Time(config.step);
  while (start.minutes <= end.minutes) {
    const end = Time.fromMinutes(start.minutes + step.minutes);
    const duration = new TimeSpan(start, end);
    columns.push({
      title: config.getTimeHeader(start, end),
      duration,
    });
    start = end;
  }

  return columns;
}

/** for recreating columns from localStorage */
export function recreateColumns(columns: IScheduleColumn[]) {
  return columns.map((column) => ({
    title: column.title,
    duration: new TimeSpan(new Time(column.duration.start), new Time(column.duration.end)),
  }));
}

export class SchedulerStore {
  private static readonly defaultSettings: ISchedulerSettings = {
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
  public settings: ISchedulerSettings;
  public courses: CourseData[];
  // data: Data;
  constructor(
    settings: ISchedulerSettings,
    private readonly eventFilter?: (event: MCourseLecture) => boolean
  ) {
    this.settings = { ...SchedulerStore.defaultSettings, ...settings };
    this.courses = [];
    this.data = this.getEmptyData();
  }

  private getEventTypePriority(type: LECTURE_TYPE): number {
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

  private findAvailableRow(pivotEvent: Event, precedingEvents: DayEvent[]): number {
    const occupiedRows = new Set<number>();

    // Find all rows that are occupied by overlapping events
    for (const event of precedingEvents) {
      if (hasOverlap(pivotEvent.timeSpan, event.event.timeSpan)) {
        occupiedRows.add(event.row);
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
    events.sort((a, b) => this.getEventTypePriority(a.event.type) - this.getEventTypePriority(b.event.type));

    // /** using dayRows to mutate the data.dayRows only once */
    // let dayRows = 1
    // Assign rows based on the new order
    data.dayRows = 1;
    events.reduce<DayEvent[]>((acc, event) => {
      const row = this.findAvailableRow(event.event, acc);
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
    const found = this.courses.find((course) => course.detail.id === courseId);
    forEach(found?.data, (dayData) => {
      for (const event of dayData.events) event.row = 1;
    });
    return found;
  }

  /**
   *
   * Combines data from multiple courses into one and sorts it
   * @param data array of UnfilledData
   * @returns Data
   */
  public combineData(data: Data[]): Data {
    return this.sortData(
      reduce(
        data,
        (acc, item) => {
          forEach(item, (dayData, day) => {
            acc[day as DAY] = {
              dayRow: dayData.dayRow,
              dayRows: 1,
              events: [...(acc[day as DAY]?.events || []), ...dayData.events],
            };
          });
          return acc;
        },
        this.getEmptyData()
      )
    );
  }

  private cloneData(data: Data, filterEvents?: (event: DayEvent) => unknown): Data {
    return mapValues(data, (dayData) => {
      const { dayRow, events } = dayData;
      const filteredEvents = filterEvents ? events.filter(filterEvents) : events;
      return { dayRow, dayRows: 1, events: filteredEvents.map((event) => ({ ...event, row: 1 })) };
    });
  }

  private resetCourses() {
    this.courses = [];
    this.data = this.getEmptyData();
  }

  set newCourses(courses: DataProviderTypes.getStudyCoursesDetailsReturn) {
    if (courses.length === 0) {
      this.resetCourses();
      return;
    }
    const coursesData = courses.map((course) => {
      const existingCourse = this.findExistingCourse(course.detail.id);
      if (existingCourse) {
        let { data, detail, metrics } = existingCourse;
        // is same language. link ends .cs or .en
        if (detail.link !== course.detail.link) detail = course.detail;
        // data is inherently proxied, so we need to copy it
        const dataCopy = this.cloneData(data);
        return { data: dataCopy, detail, metrics };
      }
      const newCourse = fillData(this.getEmptyData(), course, this.settings, this.eventFilter);
      return newCourse;
    });
    this.courses = coursesData;
    this.data = this.combineData(coursesData.map((c) => c.data));
  }

  /** returns filtered copy of data */
  get checkedData(): Data {
    return this.sortData(this.cloneData(this.data, (event) => event.event.checked));
  }

  // this will allow us to set and get data, but not persist it
  set data(_: Data) {}

  get selected(): Record<LECTURE_TYPE, number>[] {
    return this.courses.map((course) => {
      return reduce(
        course.data,
        (selectedHours, dayData) => {
          for (const event of dayData.events) {
            if (event.event.checked) {
              selectedHours[event.event.type] = (selectedHours[event.event.type] || 0) + event.event.timeSpan.hours;
            }
          }
          return selectedHours;
        },
        {} as Record<LECTURE_TYPE, number>
      );
    });
  }
}

export function getEventColumn(event: TimeSpan, columns: TimeSpan[]) {
  let colStart = columns.findIndex(
    (column) => column.start.minutes <= event.start.minutes && column.end.minutes > event.start.minutes
  );
  let colEnd = columns.findIndex(
    (column) => column.start.minutes < event.end.minutes && column.end.minutes >= event.end.minutes
  );
  if (colStart === -1 || colEnd === -1) {
    console.warn("Event is not in any column range", { colStart, colEnd }, event);
    if (colStart === -1) colStart = 0;
    if (colEnd === -1) colEnd = columns.length - 1;
  }
  return { colStart, colEnd };
}

export const columnDuration = (columns: IScheduleColumn[], colStart: number, colEnd: number) =>
  new TimeSpan(columns[colStart].duration.start, columns[colEnd].duration.end);

export function getDayEventData(columns: IScheduleColumn[], timeSpan: TimeSpan): Omit<DayEvent, "event"> {
  const { colStart, colEnd } = getEventColumn(
    timeSpan,
    columns.map((column) => column.duration)
  );
  const colDuration = columnDuration(columns, colStart, colEnd);
  const paddingStart = (new TimeSpan(columns[colStart].duration.start, timeSpan.start).minutes * 100) / colDuration.minutes;
  const paddingEnd = (new TimeSpan(timeSpan.end, columns[colEnd].duration.end).minutes * 100) / colDuration.minutes;
  return { colStart, colEnd, paddingStart, paddingEnd, row: 1 };
}

function fillData(
  toFillData: Data,
  courseData: MgetStudyCourseDetailsReturn,
  settings: ISchedulerSettings,
  filter?: (event: MCourseLecture) => boolean
) {
  const { data, detail: courseDetail } = courseData;
  const metrics = {} as Record<LECTURE_TYPE, LectureMetrics>;
  const getMetrics = (type: LECTURE_TYPE) => {
    if (!metrics[type]) metrics[type] = { weeks: 0, weeklyLectures: 0 };
    return metrics[type];
  };

  for (const event of data) {
    if (filter && !filter(event)) continue;
    const timeSpan = event.timeSpan;
    const metric = getMetrics(event.type);
    const filledEvent: Event = {
      ...event,
      courseDetail,
      timeSpan,
      metrics: metric,
      checked: false,
    };

    const linkedDuration = event.strongLinked.reduce((acc, linked) => {
      const linkedLecture = data.find((l) => l.id === linked.id);
      if (!linkedLecture) return acc;
      const timeSpan = linkedLecture.timeSpan;
      return acc + timeSpan.minutes;
    }, timeSpan.minutes);

    metric.weeklyLectures = Math.max(metric.weeklyLectures, Time.fromMinutes(linkedDuration).hours);
    metric.weeks = Math.max(metric.weeks, event.weeks.weeks.length);

    toFillData[event.day].events.push({ ...getDayEventData(settings.columns, timeSpan), event: filledEvent });
  }

  return {
    detail: courseDetail,
    data: toFillData,
    metrics,
  };
}
