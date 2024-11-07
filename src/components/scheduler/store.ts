import { mapValues, reduce } from 'lodash-es';
import { ObjectTyped } from "object-typed";
import { Time, TimeSpan } from '~/components/scheduler/time';
import type { Data, DayData, DayEvent, Event, ICreateColumns, IScheduleColumn, ISchedulerSettings } from "~/components/scheduler/types";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture, MgetStudyCourseDetailsReturn } from '~/server/scraper/lectureMutator';
import { DataProviderTypes } from "~/server/scraper/types";

// TODO: test
export function createColumns(config: ICreateColumns): IScheduleColumn[] {
  // create columns from start to end with step
  const columns: IScheduleColumn[] = [];
  let start = new Time(config.start);
  const end = new Time(config.end);
  const step = new Time(config.step)
  while (start.minutes <= end.minutes) {
    const end = Time.fromMinutes(start.minutes + step.minutes)
    const duration = new TimeSpan(start, end)
    columns.push({
      title: config.getTimeHeader(start, end),
      duration,
    })
    start = end
  }

  return columns;
}

/** for recreating columns from localStorage */
export function recreateColumns(columns: IScheduleColumn[]) {
  return columns.map(column => ({ ...column, duration: new TimeSpan(new Time(column.duration.start), new Time(column.duration.end)) }))
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
  public readonly settings: ISchedulerSettings;
  public _courses: Course[];
  // private _courses: DataProviderTypes.getStudyCoursesDetailsReturn;
  constructor(settings: ISchedulerSettings, private readonly eventFilter?: (event: MCourseLecture) => boolean) {
    this.settings = { ...SchedulerStore.defaultSettings, ...settings };
    this._courses = [];
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
    const getDayRow = (day: DAY): number => this.settings.rows.findIndex(row => row.day === day) + 1;
    return ObjectTyped.fromEntries(Object.values(DAY).map(day => [`${day}`, { dayRow: getDayRow(day), dayRows: 1, events: [] }]))
  }

  private hasOverlap(a: TimeSpan, b: TimeSpan): boolean {
    return !(a.end.minutes <= b.start.minutes || a.start.minutes >= b.end.minutes);
  }

  private findAvailableRow(pivotEvent: Event, precedingEvents: DayEvent[]): number {
    let maxRow = 0;

    for (const event of precedingEvents) {
      if (this.hasOverlap(pivotEvent.timeSpan, event.event.timeSpan)) {
        maxRow = Math.max(maxRow, event.row);
      }
    }

    return maxRow + 1;
  }

  private sortDayData = (data: DayData) => {
    const { events } = data
    events.sort((a, b) => this.getEventTypePriority(a.event.type) - this.getEventTypePriority(b.event.type))

    /** using dayRows to mutate the data.dayRows only once */
    let dayRows = 1
    // Assign rows based on the new order
    events.reduce<DayEvent[]>((acc, event) => {
      const row = this.findAvailableRow(event.event, acc)
      dayRows = Math.max(dayRows, row)
      event.row = row
      acc.push(event)
      return acc
    }, [])

    data.dayRows = dayRows
    return data
  }

  public sortData = (data: Data) => {
    ObjectTyped.entries(data).forEach(([day, dayData]) => data[day] = this.sortDayData(dayData))
    return data
  }

  arrayToRecord = (data: Record<DAY, DayData>[]): Record<DAY, DayData> => {
    return reduce(
      data,
      (acc, item) => {
        Object.entries(item).forEach(([day, dayData]) => {
          acc[day as DAY] = dayData;
        });
        return acc;
      },
      {} as Record<DAY, DayData>
    );
  };


  set courses(courses: DataProviderTypes.getStudyCoursesDetailsReturn) {
    /**
     * Filling the data in setter to be able to persist filled, if the data is not filled, after reload the Course won't have functions
     */
    const coursesObj = courses.map(course => new Course(course, this.settings))
    this._courses = coursesObj
    this._courses.forEach(course => course.fillData(this.settings, this.eventFilter))
  }

  // get courses(): Course[] {
  //   return this._courses
  // }


  get data(): Data {
    const coursesData = this._courses.map(course => course.data)
    const data = coursesData.length ? this.arrayToRecord(coursesData) : this.getEmptyData()
    return this.sortData(data)
  }

  /** returns fitered data, !not copy */
  get checkedData(): Data {
    return mapValues(this.data, (dayData) => ({
      ...dayData,
      events: dayData.events.filter(event => event.event.checked)
    }));
  }
}

export function getEventColumn(event: TimeSpan, columns: TimeSpan[]) {
  const colStart = columns.findIndex(column => column.start.minutes <= event.start.minutes && column.end.minutes > event.start.minutes)
  const colEnd = columns.findIndex(column => column.start.minutes < event.end.minutes && column.end.minutes >= event.end.minutes)
  return { colStart, colEnd }
}

export const columnDuration = (columns: IScheduleColumn[], colStart: number, colEnd: number) => new TimeSpan(columns[colStart].duration.start, columns[colEnd].duration.end)

export function getDayEventData(columns: IScheduleColumn[], timeSpan: TimeSpan): Omit<DayEvent, "event"> {
  const { colStart, colEnd } = getEventColumn(timeSpan, columns.map(column => column.duration))
  const paddingStart = new TimeSpan(columns[colStart].duration.start, timeSpan.start).minutes * 100 / columnDuration(columns, colStart, colEnd).minutes
  const paddingEnd = new TimeSpan(timeSpan.end, columns[colEnd].duration.end).minutes * 100 / columnDuration(columns, colStart, colEnd).minutes
  return { colStart, colEnd, paddingStart, paddingEnd, row: 1 }
}

interface LectureMetrics {
  weeks: number;
  weeklyLectures: number;
}
export class Course {
  private _courseMetrics: Record<LECTURE_TYPE, LectureMetrics>;
  public data: Data;
  /** settings are not saved to save space, rather they are passed */
  constructor(private courseData: MgetStudyCourseDetailsReturn, settings: ISchedulerSettings) {
    this._courseMetrics = mapValues(LECTURE_TYPE, () => ({ weeks: 0, weeklyLectures: 0 }))
    this.data = this.getEmptyData(settings)
  }

  private getEmptyData(settings: ISchedulerSettings): Data {
    const getDayRow = (day: DAY): number => settings.rows.findIndex(row => row.day === day) + 1;
    return ObjectTyped.fromEntries(Object.values(DAY).map(day => [`${day}`, { dayRow: getDayRow(day), dayRows: 1, events: [] }]))
  }

  public fillData(settings: ISchedulerSettings, filter?: (event: MCourseLecture) => boolean) {
    const { data, detail: courseDetail } = this.courseData
    data.forEach(event => {
      if (filter && !filter(event)) return;
      const timeSpan = new TimeSpan(new Time(event.start), new Time(event.end))
      // TODO: strip unnecessary data
      const filledEvent: Event = {
        ...event,
        courseDetail,
        timeSpan,
        checked: false,
      }
      // timespan data ----------------
      const linkedDuration = event.strongLinked.reduce((acc, linked) => {
        const linkedLecture = data.find((l) => l.id === linked.id)
        if (!linkedLecture) return acc
        const timeSpan = new TimeSpan(new Time(linkedLecture.start), new Time(linkedLecture.end))
        return acc + timeSpan.minutes
      }, timeSpan.minutes)
      this._courseMetrics[event.type].weeklyLectures = Math.max(this._courseMetrics[event.type].weeklyLectures, Time.fromMinutes(linkedDuration).hours)
      this._courseMetrics[event.type].weeks = Math.max(this._courseMetrics[event.type].weeks, event.weeks.weeks.length)

      // ------------------------------

      this.data[event.day].events.push({ ...getDayEventData(settings.columns, timeSpan), event: filledEvent })
    })
    return this.data
  }

  get detail() {
    return this.courseData.detail
  }

  get courseMetrics() {
    const filterLectureData = <T>(data: Record<LECTURE_TYPE, LectureMetrics>) => ObjectTyped.entries(data).reduce((acc, [key, value]) => {
      if (value.weeklyLectures === 0 || value.weeks === 0) return acc
      return { ...acc, [key]: value }
    }, {} as Record<LECTURE_TYPE, LectureMetrics>)
    return filterLectureData(this._courseMetrics)
  }

  get selected() {
    const selected: Record<LECTURE_TYPE, number> = Object.values(this.data).reduce((acc, dayData) => {
      dayData.events.forEach(event => {
        if (event.event.checked) {
          acc[event.event.type] += Math.ceil(event.event.timeSpan.minutes / 60)
        }
      })
      return acc
    }, ObjectTyped.fromEntries(Object.values(LECTURE_TYPE).map(t => [t, 0])))
    return selected
  }
}


