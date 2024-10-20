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

export type ParsedEvent = Omit<CourseLecture, "start" | "end" | "room"> & TimeFrame & {
  abbreviation: string;
  name: string;
  link: string;
  id: string;
  room: string;
}

type ParsedEvents = {
  row: number;
  colStart: number;
  colEnd: number;
  paddingStart: number;
  paddingEnd: number;
  event: ParsedEvent;
}[]

interface ParsedData {
  dayRow: number;
  dayRows: number;
  events: ParsedEvents
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
    this.data = ObjectTyped.fromEntries(Object.values(DAY).map(day => [`${day}`, { dayRow: this.getDayRow(day), dayRows: 1, events: [] as ParsedEvents }])) satisfies ParsedDayData
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

  // TODO: test
  getEventColumn = (event: TimeFrame, columns: TimeFrame[]): { start: number, end: number } => {
    // const colStart = this.settings.columns.findIndex(column => {
    //       const { start, end } = column;
    //       // find in which column the event starts, not necessarily at the same time as start of the column just inside and before next column
    //       return (start.hour < startHour || (start.hour === startHour && start.minute <= startMinute)) &&
    //         (end.hour > startHour || (end.hour === startHour && end.minute > startMinute));
    //     });
    //     const colEnd = this.settings.columns.findIndex(column => {
    //       const { start, end } = column;
    //       // find in which column the event ends, not necessarily at the same time as end of the column just inside and after previous column
    //       return (start.hour < endHour || (start.hour === endHour && start.minute < endMinute)) &&
    //         (end.hour > endHour || (end.hour === endHour && end.minute >= endMinute));
    //     });
    const colStart = columns.findIndex(column => schedulerTimeToMinutes(column.start) <= schedulerTimeToMinutes(event.start) && schedulerTimeToMinutes(column.end) > schedulerTimeToMinutes(event.start))
    const colEnd = columns.findIndex(column => schedulerTimeToMinutes(column.start) < schedulerTimeToMinutes(event.end) && schedulerTimeToMinutes(column.end) >= schedulerTimeToMinutes(event.end))
    return { start: colStart, end: colEnd }
  }

  // TODO: test
  // hasOverlap = (event: TimeFrame, events: TimeFrame[]) => {
  //   return events.some(e =>
  //     schedulerTimeToMinutes(e.start) < schedulerTimeToMinutes(event.end) &&
  //     schedulerTimeToMinutes(e.end) > schedulerTimeToMinutes(event.start)
  //   )
  // }

  hasOverlap = (event: TimeFrame, e: TimeFrame) => {
    return schedulerTimeToMinutes(e.start) < schedulerTimeToMinutes(event.end) &&
      schedulerTimeToMinutes(e.end) > schedulerTimeToMinutes(event.start)
  }

  /**
   * 
   * @param event event to check for overlap
   * @param events previous events to check against
   * @returns length of the overlaps + 1
   */
  getEventRow = (event: ParsedEvent, events: ParsedEvent[]) => {
    // event and events are in the same day, check if there is an overlap, if there is, return the biggest row + 1
    // let row = 1;
    // for (const e of events) {
    //   if (this.hasOverlap(event, e.event)) {
    //     row = Math.max(row, e.row + 1)
    //   }
    // }
    const overlappingEvents = events.filter(e => this.hasOverlap(event, e))
    if (overlappingEvents.length === 0) return 1;
    const rows = overlappingEvents.length + 1
    return rows

  }

  parseTime = (time: string): ISchedulerTime => {
    const [hour, minute] = time.split(":").map(Number)
    return { hour, minute }
  }

  frameTime = (start: string, end: string): TimeFrame => ({ start: this.parseTime(start), end: this.parseTime(end) })

  getDayRow = (day: DAY): number => this.settings.rows.findIndex(row => row.day === day) + 1;

  parseCourses = (courses: DataProviderTypes.getStudyCoursesDetailsReturn) => {
    courses.map(course => this.parseCourse(course))
    return this.data
  }

  parseCourse(course: DataProviderTypes.getStudyCoursesDetailsReturn[number]) {
    const { timeSpan: _, ...courseDetail } = course.detail

    // even though this day may not have any events, it will still have atleast 1 row
    const data = ObjectTyped.fromEntries(Object.values(DAY).map(day => [`${day}`, { events: [] as Omit<ParsedEvents[number], "row">[] }]))
    course.data.forEach(event => {
      const { day, start, end } = event
      const timeFrame = this.frameTime(start, end)
      const { start: colStart, end: colEnd } = this.getEventColumn(timeFrame, this.settings.columns)
      const ParsedEvent: ParsedEvent = {
        ...courseDetail,
        ...event,
        start: this.parseTime(start),
        end: this.parseTime(end),
      }
      // padding in percentage
      const eventDuration = schedulerTimeToMinutes(ParsedEvent.end) - schedulerTimeToMinutes(ParsedEvent.start)
      const paddingStart = (schedulerTimeToMinutes(ParsedEvent.start) - schedulerTimeToMinutes(this.settings.columns[colStart].start)) / eventDuration * 100
      const paddingEnd = (schedulerTimeToMinutes(this.settings.columns[colEnd].end) - schedulerTimeToMinutes(ParsedEvent.end)) / eventDuration * 100
      const parsedEvents: Omit<ParsedEvents[number], "row"> = { colStart, colEnd, event: ParsedEvent, paddingStart, paddingEnd }
      data[day].events.push(parsedEvents)
    })

    // transform data to ParsedDayData with prioritised events
    ObjectTyped.entries(data).forEach(([day, { events }]) => {
      events.sort((a, b) => {
        const priorityDiff = this.getEventTypePriority(a.event.type) - this.getEventTypePriority(b.event.type)
        if (priorityDiff !== 0) return priorityDiff
        // If priority is the same, sort by start time
        return schedulerTimeToMinutes(a.event.start) - schedulerTimeToMinutes(b.event.start)
      })

      let dayRows = 1
      // Assign rows based on the new order
      const parsedEvents = events.reduce((acc, eventData) => {
        const row = this.getEventRow(eventData.event, acc.map(e => e.event))
        dayRows = Math.max(dayRows, row)
        acc.push({ row, ...eventData } satisfies ParsedEvents[number])
        return acc
      }, [] as ParsedEvents)

      this.data[day].dayRows = dayRows
      this.data[day].events = parsedEvents
    })

    // course.data.forEach(event => {
    //   const { day, start, end } = event
    //   const timeFrame = this.frameTime(start, end)
    //   const { start: colStart, end: colEnd } = this.getEventColumn(timeFrame, this.settings.columns)
    //   const ParsedEvent: ParsedEvent = {
    //     ...courseDetail,
    //     start: this.parseTime(start),
    //     end: this.parseTime(end),
    //     room: event.room,
    //     type: event.type,
    //   }
    //   const row = this.getEventRow(ParsedEvent, this.data[day].events)
    //   const parsedEvents: ParsedEvents[number] = { row, colStart, colEnd, event: ParsedEvent }
    //   console.log("🚀 ~ file: store2.ts:182 ~ SchedulerStore ~ parseCourse ~ row:", row)

    //   this.data[day].dayRows = Math.max(this.data[day].dayRows, row)
    //   this.data[day].events.push(parsedEvents)
    // })

    // Object.values(DAY).forEach(day => {
    //   this.data[day].events.sort((a, b) => {
    //     const priorityDiff = this.getEventTypePriority(a.event.type) - this.getEventTypePriority(b.event.type)
    //     if (priorityDiff !== 0) return priorityDiff
    //     // If priority is the same, sort by start time
    //     return schedulerTimeToMinutes(a.event.start) - schedulerTimeToMinutes(b.event.start)
    //   })

    //   // Assign rows based on the new order
    //   let currentRow = 1
    //   this.data[day].events.forEach(eventData => {
    //     if (currentRow > 1 && !this.hasOverlap(eventData.event, this.data[day].events[currentRow - 2].event)) {
    //       currentRow = 1
    //     }
    //     eventData.row = currentRow
    //     currentRow++
    //   })

    //   this.data[day].dayRows = Math.max(...this.data[day].events.map(e => e.row))
    // })

    return this.data
  }
}

function schedulerTimeToMinutes(time: ISchedulerTime) {
  return time.hour * 60 + time.minute;
}
function minutesToSchedulerTime(minutes: number): ISchedulerTime {
  return { hour: Math.floor(minutes / 60), minute: minutes % 60 }
}
