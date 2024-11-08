import { mapValues, reduce } from 'lodash-es';
import { ObjectTyped } from "object-typed";
import { Time, TimeSpan } from '~/components/scheduler/time';
import type { CourseData, Data, DayData, DayEvent, Event, ICreateColumns, IScheduleColumn, ISchedulerSettings, LectureMetrics } from "~/components/scheduler/types";
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
  public settings: ISchedulerSettings;
  public courses: CourseData[]
  constructor(settings: ISchedulerSettings, private readonly eventFilter?: (event: MCourseLecture) => boolean) {
    this.settings = { ...SchedulerStore.defaultSettings, ...settings };
    this.courses = [];
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

    // /** using dayRows to mutate the data.dayRows only once */
    // let dayRows = 1
    // Assign rows based on the new order
    events.reduce<DayEvent[]>((acc, event) => {
      const row = this.findAvailableRow(event.event, acc)
      data.dayRows = Math.max(data.dayRows, row)
      event.row = row
      acc.push(event)
      return acc
    }, [])

    // data.dayRows = dayRows
    return data
  }

  public sortData = (data: Data) => {
    ObjectTyped.entries(data).forEach(([day, dayData]) => data[day] = this.sortDayData(dayData))
    return data
  }

  set newCourses(courses: DataProviderTypes.getStudyCoursesDetailsReturn) {
    const coursesData = courses.map(course => {
      const emptyData = this.getEmptyData()
      const data = Course.fillData(emptyData, course, this.settings, this.eventFilter)
      return data
    })
    this.courses = coursesData
  }

  get data(): Data {
    const combineData = (data: Data[]): Data => {
      return reduce(
        data,
        (acc, item) => {
          ObjectTyped.entries(item).forEach(([day, dayData]) => {
            acc[day] = dayData;
          });
          return acc;
        },
        {} as Data
      );
    };
    const data = this.courses.length ? combineData(this.courses.map(c => c.data)) : this.getEmptyData()
    return this.sortData(data)
  }

  /** returns filtered copy of data */
  get checkedData(): Data {
    return mapValues({ ...this.data }, (dayData) => ({
      ...dayData,
      dayRows: 1,
      events: dayData.events.filter(event => event.event.checked).map(event => {
        const { row } = event
        return { ...event, row }
      })
    }));
  }

  get selected(): Record<LECTURE_TYPE, number>[] {
    return this.courses.map(course => {
      const selectedHours: Record<LECTURE_TYPE, number> = {} as Record<LECTURE_TYPE, number>
      mapValues(course.data, (dayData) => {
        dayData.events.filter(event => event.event.checked).forEach(({ event: { type, timeSpan } }) => { selectedHours[type] = (selectedHours[type] || 0) + timeSpan.hours })
      })
      return selectedHours
    })
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

class Course {
  static fillData(toFillData: Data, courseData: MgetStudyCourseDetailsReturn, settings: ISchedulerSettings, filter?: (event: MCourseLecture) => boolean) {
    const { data, detail: courseDetail } = courseData
    const metrics = {} as Record<LECTURE_TYPE, LectureMetrics>
    const getMetrics = (type: LECTURE_TYPE) => metrics[type] || (metrics[type] = { weeks: 0, weeklyLectures: 0 })


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
      const metric = getMetrics(event.type)
      metric.weeklyLectures = Math.max(metric.weeklyLectures, Time.fromMinutes(linkedDuration).hours)
      metric.weeks = Math.max(metric.weeks, event.weeks.weeks.length)
      // ------------------------------

      toFillData[event.day].events.push({ ...getDayEventData(settings.columns, timeSpan), event: filledEvent })
    })
    return {
      detail: courseDetail,
      data: toFillData,
      metrics,
    }
  }
}


