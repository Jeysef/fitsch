import { ObjectTyped } from "object-typed";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import { DataProviderTypes, type CourseLecture } from "~/server/scraper/types";

interface ISchedulerTime {
  hour: number;
  minute: number;
}

interface IScheduleRow {
  title: string;
  day: DAY;
}

interface IScheduleColumn {
  title: string;
  start: ISchedulerTime;
  end: ISchedulerTime;
}

interface IScheduleDimensions {
  width: {
    min: string | "auto"
    max: string | "auto"
  } | string
  height: {
    min: string | "auto"
    max: string | "auto"
  } | string
}

export interface ISchedulerSettings {
  blockDimensions?: Partial<IScheduleDimensions>;
  columns: IScheduleColumn[];
  rows: IScheduleRow[];
}

interface ICreateColumns {
  start: ISchedulerTime;
  step: ISchedulerTime;
  /**
   * if end is less than last closest step, the end of the step will be used
   */
  end: ISchedulerTime;
  getTimeHeader: (start: ISchedulerTime, end: ISchedulerTime) => string;
}




// TODO: test
export function createColumns(config: ICreateColumns): IScheduleColumn[] {
  // create columns from start to end with step
  const columns: IScheduleColumn[] = [];
  let start = config.start;
  let end = config.end;
  while (schedulerTimeToMinutes(start) <= schedulerTimeToMinutes(end)) {
    const end = minutesToSchedulerTime(schedulerTimeToMinutes(start) + schedulerTimeToMinutes(config.step))
    columns.push({
      title: config.getTimeHeader(start, end),
      start,
      end
    })
    start = columns[columns.length - 1].end
  }

  return columns;
}

export type Event = Omit<CourseLecture, "start" | "end" | "room"> & TimeFrame & {
  abbreviation: string;
  name: string;
  link: string;
  id: string;
  room: string;
}


interface ParsedEvent {
  row: number;
  colStart: number;
  colEnd: number;
  paddingStart: number;
  paddingEnd: number;
  event: Event;
}

interface ParsedData {
  dayRow: number;
  dayRows: number;
  events: ParsedEvent[];
}

export type ParsedDayData = Record<DAY, ParsedData>


interface TimeFrame {
  start: ISchedulerTime;
  end: ISchedulerTime;
}

export class SchedulerStore {
  test: string = "test"
  private static readonly defaultSettings: ISchedulerSettings = {
    blockDimensions: {
      width: {
        min: "5.5rem",
        max: "10rem",
      },
      height: "auto"
    },
    columns: [],
    rows: [],
  }
  public data: ParsedDayData;
  public readonly settings: ISchedulerSettings;
  constructor(settings: ISchedulerSettings) {
    this.settings = { ...SchedulerStore.defaultSettings, ...settings };
    this.data = this.getEmptyData()
  }

  private getEventTypePriority(type: LECTURE_TYPE): number {
    switch (type) {
      case LECTURE_TYPE.LECTURE: return 0;
      case LECTURE_TYPE.SEMINAR: return 1;
      case LECTURE_TYPE.EXERCISE: return 2;
      case LECTURE_TYPE.LABORATORY: return 3;
      default: return 4; // For any other types
    }
  }

  getEmptyData(): ParsedDayData {
    return ObjectTyped.fromEntries(Object.values(DAY).map(day => [`${day}`, { dayRow: this.getDayRow(day), dayRows: 1, events: [] }]))
  }

  // TODO: test 0 based
  getEventColumn = (event: TimeFrame, columns: TimeFrame[]): { start: number, end: number } => {
    const colStart = columns.findIndex(column => schedulerTimeToMinutes(column.start) <= schedulerTimeToMinutes(event.start) && schedulerTimeToMinutes(column.end) > schedulerTimeToMinutes(event.start))
    const colEnd = columns.findIndex(column => schedulerTimeToMinutes(column.start) < schedulerTimeToMinutes(event.end) && schedulerTimeToMinutes(column.end) >= schedulerTimeToMinutes(event.end))
    return { start: colStart, end: colEnd }
  }

  hasOverlap = (event: TimeFrame, otherEvent: TimeFrame) => {
    // return schedulerTimeToMinutes(otherEvent.start) < schedulerTimeToMinutes(event.end) &&
    //   schedulerTimeToMinutes(otherEvent.end) > schedulerTimeToMinutes(event.start)
    // has overlap if event is in time frame of other event
    return schedulerTimeToMinutes(otherEvent.start) <= schedulerTimeToMinutes(event.start) && schedulerTimeToMinutes(otherEvent.end) > schedulerTimeToMinutes(event.start) ||
      schedulerTimeToMinutes(otherEvent.start) < schedulerTimeToMinutes(event.end) && schedulerTimeToMinutes(otherEvent.end) >= schedulerTimeToMinutes(event.end)
  }

  /**
   * 
   * @param event event to check for overlap
   * @param events previous events to check against
   * @returns length of the overlaps + 1
   */
  getEventRow = (event: Event, events: ParsedEvent[]) => {
    // event and events are in the same day, check if there is an overlap, if there is, return the biggest row + 1
    // let row = 1;
    // for (const e of events) {
    //   if (this.hasOverlap(event, e.event)) {
    //     row = Math.max(row, e.row + 1)
    //   }
    // }
    // const overlappingEvents =
    // const rows = overlappingEvents.length + 1

    // if there is event spanning 2 rows and there are 2 events spanning row 1 and row 2 in the same time, the event should be in row 2
    // if there is not continuous series of rows, ex: 2,3 then 1,2,3, the event should be in row 1
    const occupiedRows = new Set<number>();
    events.forEach(e => {
      if (this.hasOverlap(event, e.event)) {
        occupiedRows.add(e.row);
      }
    });

    let row = 1;
    while (occupiedRows.has(row)) {
      row++;
    }

    return row

  }

  private computeData = (data: ParsedDayData) => {
    ObjectTyped.entries(data).forEach(([day, { events }]) => {
      events.sort((a, b) => this.getEventTypePriority(a.event.type) - this.getEventTypePriority(b.event.type))

      let dayRows = 1
      // Assign rows based on the new order
      const parsedEvents = events.reduce((acc, eventData) => {
        const row = this.getEventRow(eventData.event, acc)
        dayRows = Math.max(dayRows, row)
        acc.push({ ...eventData, row } satisfies ParsedEvent)
        return acc
      }, [] as ParsedEvent[])

      data[day].dayRows = dayRows
      data[day].events = parsedEvents
    })
    return data
  }

  parseTime = (time: string): ISchedulerTime => {
    const [hour, minute] = time.split(":").map(Number)
    return { hour, minute }
  }

  frameTime = (start: string, end: string): TimeFrame => ({ start: this.parseTime(start), end: this.parseTime(end) })

  getDayRow = (day: DAY): number => this.settings.rows.findIndex(row => row.day === day) + 1;

  filterCourse = (courseData: DataProviderTypes.getStudyCourseDetailsReturn["data"]) => {
    return courseData.filter(event => !event.note)
  }

  parseCourses = (courses: DataProviderTypes.getStudyCoursesDetailsReturn) => {
    const data = this.getEmptyData()
    courses.forEach(course => {
      const { timeSpan: _, ...courseDetail } = course.detail
      this.filterCourse(course.data).forEach(event => {
        const { day, start, end } = event
        const timeFrame = this.frameTime(start, end)
        const { start: colStart, end: colEnd } = this.getEventColumn(timeFrame, this.settings.columns)
        const filledEvent: Event = {
          ...courseDetail,
          ...event,
          start: this.parseTime(start),
          end: this.parseTime(end),
        }
        // padding in percentage
        const eventDuration = schedulerTimeToMinutes(filledEvent.end) - schedulerTimeToMinutes(filledEvent.start)
        const paddingStart = Math.round((schedulerTimeToMinutes(filledEvent.start) - schedulerTimeToMinutes(this.settings.columns[colStart].start)) * 100) / eventDuration
        const paddingEnd = Math.round((schedulerTimeToMinutes(this.settings.columns[colEnd].end) - schedulerTimeToMinutes(filledEvent.end)) * 100) / eventDuration
        const parsedEvents: ParsedEvent = { colStart, colEnd, event: filledEvent, paddingStart, paddingEnd, row: 1 }
        data[day].events.push(parsedEvents)
      })
    })
    return this.computeData(data)
  }

  parseCourse(course: DataProviderTypes.getStudyCoursesDetailsReturn[number], data: ParsedDayData = this.getEmptyData()): ParsedDayData {
    const { timeSpan: _, ...courseDetail } = course.detail

    // even though this day may not have any events, it will still have atleast 1 row
    // const data: ParsedDayData = this.getEmptyData()
    this.filterCourse(course.data).forEach(event => {
      const { day, start, end } = event
      const timeFrame = this.frameTime(start, end)
      const { start: colStart, end: colEnd } = this.getEventColumn(timeFrame, this.settings.columns)
      const filledEvent: Event = {
        ...courseDetail,
        ...event,
        start: this.parseTime(start),
        end: this.parseTime(end),
      }
      // padding in percentage
      const columnsDuration = schedulerTimeToMinutes(this.settings.columns[colEnd].end) - schedulerTimeToMinutes(this.settings.columns[colStart].start)
      const paddingStart = Math.round(schedulerTimeToMinutes(filledEvent.start) - schedulerTimeToMinutes(this.settings.columns[colStart].start) * 100) / columnsDuration
      const paddingEnd = Math.round(schedulerTimeToMinutes(this.settings.columns[colEnd].end) - schedulerTimeToMinutes(filledEvent.end) * 100) / columnsDuration
      const parsedEvents: ParsedEvent = { colStart, colEnd, event: filledEvent, paddingStart, paddingEnd, row: 1 }
      data[day].events.push(parsedEvents)
    })

    return this.computeData(data)
  }
}

export function schedulerTimeToMinutes(time: ISchedulerTime) {
  return time.hour * 60 + time.minute;
}
export function minutesToSchedulerTime(minutes: number): ISchedulerTime {
  return { hour: Math.floor(minutes / 60), minute: minutes % 60 }
}
