import { ObjectTyped } from "object-typed";
import type { Data, DayData, DayEvent, Event, ICreateColumns, IScheduleColumn, ISchedulerSettings, ISchedulerTime, TimeFrame } from "~/components/scheduler/types";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import { DataProviderTypes } from "~/server/scraper/types";
import { mapValues } from 'lodash-es';

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

export class SchedulerStore {
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
  private _data: Data = this.getEmptyData()
  public readonly settings: ISchedulerSettings;
  constructor(settings: ISchedulerSettings) {
    this.settings = { ...SchedulerStore.defaultSettings, ...settings };
  }

  private getEventTypePriority(type: LECTURE_TYPE): number {
    // sorted so that 0 is the highest priority
    switch (type) {
      case LECTURE_TYPE.LECTURE: return 0;
      case LECTURE_TYPE.SEMINAR: return 1;
      case LECTURE_TYPE.EXERCISE: return 2;
      case LECTURE_TYPE.LABORATORY: return 3;
      default: return 4; // For any other types
    }
  }

  getEmptyData(): Data {
    return ObjectTyped.fromEntries(Object.values(DAY).map(day => [`${day}`, { dayRow: this.getDayRow(day), dayRows: 1, events: [] }]))
  }

  // TODO: test 0 based
  getEventColumn = (event: TimeFrame, columns: TimeFrame[]): { start: number, end: number } => {
    const colStart = columns.findIndex(column => schedulerTimeToMinutes(column.start) <= schedulerTimeToMinutes(event.start) && schedulerTimeToMinutes(column.end) > schedulerTimeToMinutes(event.start))
    const colEnd = columns.findIndex(column => schedulerTimeToMinutes(column.start) < schedulerTimeToMinutes(event.end) && schedulerTimeToMinutes(column.end) >= schedulerTimeToMinutes(event.end))
    return { start: colStart, end: colEnd }
  }

  // TODO: test and optimize
  hasOverlap = (event: TimeFrame, otherEvent: TimeFrame) => {
    // has overlap if event is in time frame of other event
    return schedulerTimeToMinutes(otherEvent.start) <= schedulerTimeToMinutes(event.start) && schedulerTimeToMinutes(otherEvent.end) > schedulerTimeToMinutes(event.start) ||
      schedulerTimeToMinutes(otherEvent.start) < schedulerTimeToMinutes(event.end) && schedulerTimeToMinutes(otherEvent.end) >= schedulerTimeToMinutes(event.end)
  }

  /**
   * 
   * @param event event to check for overlap
   * @param events previous events to check against
   * @returns biggest overlapping row + 1
   */
  getEventRow = (event: Event, events: DayEvent[]) => {
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
    return row;
  }

  public sortData = (data: Data) => {
    ObjectTyped.entries(data).forEach(([day, odata]) => data[day] = this.sortDayData(odata))
    return data
  }

  private sortDayData = (data: DayData) => {
    const { events } = data
    events.sort((a, b) => this.getEventTypePriority(a.event.type) - this.getEventTypePriority(b.event.type))

    // Assign rows based on the new order
    events.reduce<DayEvent[]>((acc, event) => {
      const row = this.getEventRow(event.event, acc)
      data.dayRows = Math.max(data.dayRows, row)
      event.row = row
      acc.push(event)
      return acc
    }, [])

    return data
  }

  // TODO: parse on server
  parseTime = (time: string): ISchedulerTime => {
    const [hour, minute] = time.split(":").map(Number)
    return { hour, minute }
  }

  frameTime = (start: string, end: string): TimeFrame => ({ start: this.parseTime(start), end: this.parseTime(end) })

  private getDayRow = (day: DAY): number => this.settings.rows.findIndex(row => row.day === day) + 1;


  fillData = (course: DataProviderTypes.getStudyCoursesDetailsReturn[number], data: Data) => {
    course.data.forEach(event => {
      const { day, start, end } = event
      const timeFrame = this.frameTime(start, end)
      const filledEvent: Event = {
        ...course.detail,
        ...event,
        start: timeFrame.start,
        end: timeFrame.end,
        checked: false,
      }
      if (this.settings.filter && !this.settings.filter(filledEvent)) return;

      const { start: colStart, end: colEnd } = this.getEventColumn(timeFrame, this.settings.columns)
      // padding in percentage
      const eventDuration = schedulerTimeDuration(filledEvent.start, filledEvent.end)
      const paddingStart = schedulerTimeDuration(this.settings.columns[colStart].start, filledEvent.start) * 100 / eventDuration
      const paddingEnd = schedulerTimeDuration(filledEvent.end, this.settings.columns[colEnd].end) * 100 / eventDuration
      const parsedEvent: DayEvent = { colStart, colEnd, event: filledEvent, paddingStart, paddingEnd, row: 1 }
      data[day].events.push(parsedEvent)
    })
  }

  parseCourses = (courses: DataProviderTypes.getStudyCoursesDetailsReturn) => {
    const data = this.getEmptyData()
    courses.forEach(course => this.fillData(course, data))
    return this.sortData(data)
  }

  set courses(courses: DataProviderTypes.getStudyCoursesDetailsReturn) {
    this._data = this.parseCourses(courses)
  }

  get data() {
    return this._data
  }

  get checkedData() {
    return mapValues(this.data, (dayData) => ({
      ...dayData,
      events: dayData.events.filter(event => event.event.checked)
    }));
  }
}

export function schedulerTimeDuration(start: ISchedulerTime, end: ISchedulerTime) {
  return schedulerTimeToMinutes(end) - schedulerTimeToMinutes(start)
}

export function schedulerTimeToMinutes(time: ISchedulerTime) {
  return time.hour * 60 + time.minute;
}
export function minutesToSchedulerTime(minutes: number): ISchedulerTime {
  return { hour: Math.floor(minutes / 60), minute: minutes % 60 }
}
