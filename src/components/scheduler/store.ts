import { chain, flow, map, mapValues, reduce } from "lodash-es";
import { ObjectTyped } from "object-typed";
import type { StrictOmit } from "ts-essentials";
import type { CustomEvent, DayEvent, EventData, ScheduleEvent } from "~/components/scheduler/event/types";
import { hasOverlap, Time, TimeSpan } from "~/components/scheduler/time";
import type {
  Course,
  Data,
  DayData,
  ICreateColumns,
  IScheduleColumn,
  ISchedulerSettings,
  LectureMetrics,
} from "~/components/scheduler/types";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type { LinkedLectureData, MCourseLecture, MgetStudyCourseDetailsReturn } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types";

// TODO: test
export function createColumns(config: ICreateColumns): IScheduleColumn[] {
  // create columns from start to end with step
  const columns: IScheduleColumn[] = [];
  let start = new Time(config.start);
  const end = new Time(config.end);
  const step = new Time(config.step);
  while (start.minutes <= end.minutes) {
    const end = start.add(step);
    columns.push({
      title: config.getTimeHeader(start, end),
      duration: new TimeSpan(start, end),
    });
    start = end;
  }

  return columns;
}

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

export class SchedulerStore {
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
    const coursesData = courses.map<Course>((course) => {
      const existingCourse = this.findExistingCourse(course.detail.id);
      if (existingCourse) {
        let { detail } = existingCourse;
        // is same language. link ends .cs or .en
        if (detail.link !== course.detail.link) detail = course.detail;
        // data is inherently proxied, so we need to copy it
        return existingCourse;
      }
      return createNewCourse(course, this.eventFilter);
    });
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
    // const dataWithCustom = this.customEvents.reduce<Data>((acc, event) => {
    //   const dayEvent = this.fillCustomEvent(event);
    //   acc[event.day].events.push(dayEvent);
    //   return acc;
    // }, this.getEmptyData());

    // const data = this.sortData(
    //   this.courses.reduce<Data>((acc, course) => {
    //     return course.data.reduce((acc, event) => {
    //       const dayEvent: DayEvent = {
    //         ...getDayEventData(this.settings.columns, event.timeSpan),
    //         eventData: {
    //           event,
    //           courseDetail: course.detail,
    //           metrics: course.metrics[event.type],
    //         },
    //       };
    //       acc[event.day].events.push(dayEvent);
    //       return acc;
    //     }, acc);
    //   }, dataWithCustom)
    // );

    const fillCustomEvent = (event: CustomEvent) => {
      // TODO: think about automatically infering dayData using getters
      const dayEvent: DayEvent = {
        ...getDayEventData(this.settings.columns, event.timeSpan),
        eventData: { event },
      };
      return dayEvent;
    };

    return chain(this.getEmptyData())
      .tap((data) => {
        reduce(
          this.customEvents,
          (acc, event) => {
            acc[event.day].events.push(fillCustomEvent(event));
            return acc;
          },
          data
        );
      })
      .thru(
        flow(
          (data) =>
            // for each course
            reduce(
              this.courses,
              (acc, course) =>
                // and each event in the course
                reduce(
                  course.data,
                  (acc, event) => {
                    // add the event to data
                    acc[event.day].events.push({
                      ...getDayEventData(this.settings.columns, event.timeSpan),
                      eventData: {
                        event,
                        courseDetail: course.detail,
                        metrics: course.metrics[event.type],
                      },
                    });
                    return acc;
                  },
                  acc
                ),
              data
            ),
          // then sort the data
          this.sortData
        )
      )
      .value();
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

export const columnDuration = (columns: IScheduleColumn[], colStart: number, colEnd: number) =>
  new TimeSpan(columns[colStart].duration.start, columns[colEnd].duration.end);

export function getDayEventData(columns: IScheduleColumn[], timeSpan: TimeSpan): StrictOmit<DayEvent, "eventData"> {
  const { colStart, colEnd } = getEventColumn(timeSpan, columns);
  const colDuration = columnDuration(columns, colStart, colEnd);
  const paddingStart = (new TimeSpan(columns[colStart].duration.start, timeSpan.start).minutes * 100) / colDuration.minutes;
  const paddingEnd = (new TimeSpan(timeSpan.end, columns[colEnd].duration.end).minutes * 100) / colDuration.minutes;
  // row is set later
  return { colStart, colEnd, paddingStart, paddingEnd, row: 1 };
}

function createNewCourse(courseData: MgetStudyCourseDetailsReturn, filter?: (event: MCourseLecture) => boolean): Course {
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
