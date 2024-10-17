// import { ObjectTyped } from "object-typed";
// import { subjectTypeColors } from "~/config/colors";
// import { CourseSubject, DataProviderTypes, DAY } from "~/server/scraper/types";

// interface ISchedulerTime {
//   hour: number;
//   minute: number;
// }

// interface IScheduleRow {
//   title: string;
//   day: DAY;
// }

// interface IScheduleColumn {
//   title: string;
//   start: ISchedulerTime;
//   end: ISchedulerTime;
// }

// interface IScheduleDimensions {
//   width: {
//     min: string | "auto"
//     max: string | "auto"
//   } | string
//   height: {
//     min: string | "auto"
//     max: string | "auto"
//   } | string
// }

// export interface ISchedulerSettings {
//   blockDimensions?: Partial<IScheduleDimensions>;
//   columns: IScheduleColumn[];
//   rows: IScheduleRow[];
// }

// interface ICreateColumns {
//   start: ISchedulerTime;
//   step: ISchedulerTime;
//   /**
//    * if end is less than last closest step, the end of the step will be used
//    */
//   end: ISchedulerTime;
//   getTimeHeader: (start: ISchedulerTime, end: ISchedulerTime) => string;
// }

// interface CourseEvent extends CourseSubject {
//   abbreviation: string;
//   name: string;
//   link: string;
// }

// interface ParsedEvent extends CourseEvent {
//   colStart: number;
//   colEnd: number;
//   colSpan: number;
//   startPadding: number;
//   endPadding: number;
//   color: string;
// }

// interface SchedulerEvent {
//   dayRow: number;
//   dayRows: number;
//   rowInDay: number;
//   event: ParsedEvent;
// }

// interface Course {
//   abbreviation: string;
//   name: string;
//   link: string;
//   timeSpan: Record<string, number>;
// }

// // TODO: test
// export function createColumns(config: ICreateColumns): IScheduleColumn[] {
//   const columns: IScheduleColumn[] = [];
//   let current = { ...config.start };
//   while (current.hour < config.end.hour || (current.hour === config.end.hour && current.minute <= config.end.minute)) {
//     const start = { ...current };
//     current.minute += config.step.minute;
//     if (current.minute >= 60) {
//       current.minute -= 60;
//       current.hour++;
//     }
//     columns.push({
//       title: config.getTimeHeader(start, config.step),
//       start,
//       end: current
//     });
//   }
//   return columns;
// }



// export class SchedulerStore {
//   public static readonly defaultSettings: ISchedulerSettings = {
//     blockDimensions: {
//       width: {
//         min: "5.5rem",
//         max: "10rem",
//       },
//       height: "auto"
//     },
//     columns: [],
//     rows: [],
//   }
//   settings: ISchedulerSettings;
//   private _events: Record<DAY, ParsedEvent> = Object.fromEntries(ObjectTyped.entries(DAY).map(day => [day, [] as ParsedEvent[]]));
//   private _courses: Course[] = [];
//   constructor(settings: ISchedulerSettings) {
//     this.settings = { ...SchedulerStore.defaultSettings, ...settings };
//   }

//   public addCourse(course: DataProviderTypes.getStudyCoursesDetailsReturn[number]) {
//     this.parseCourse(course);
//   }

//   private parseCourse(course: DataProviderTypes.getStudyCoursesDetailsReturn[number]) {
//     const { name, abbreviation, link, timeSpan, id } = course.detail;
//     const courses: Course[] = []
//     const events = ObjectTyped.fromEntries(course.data.map((subject) => {
//       const course = {
//         abbreviation,
//         name,
//         link,
//         id,
//         timeSpan
//       }
//       courses.push(course);
//       const event: CourseEvent = {
//         name,
//         abbreviation,
//         link,
//         ...subject
//       }
//       const parsedEvent = this.parseEvent(event);
//       return parsedEvent;
//     }))
//     this._courses.push(...courses);
//     this._events = { ...this._events, ...events };
//   }

//   private parseEvent(event: CourseEvent) {
//     const { day, start, end } = event;
//     const [startHour, startMinute] = start.split(":").map(Number);
//     const [endHour, endMinute] = end.split(":").map(Number);

//     const colStart = this.settings.columns.findIndex(column => {
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
//     const colSpan = colEnd - colStart + 1;
//     const eventColLength = schedulerTimeToMinutes(this.settings.columns[colEnd].end) - schedulerTimeToMinutes(this.settings.columns[colStart].start);

//     // now, the event may not be the same length as the column, so we need to find the paddings of the event in percentage relative to its size
//     // ex: event starts at 7:30 and ends at 8:30, column starts at 7:00 and ends at 8:00, next starts at 8:00 and ends at 9:00
//     // -> we will span the event over 2 columns, left padding will be (30 / 2*60)% = 25%, right padding will be (30 / 2*60)% = 25%
//     const startPadding = (startHour - this.settings.columns[colStart].start.hour) * eventColLength
//     const endPadding = (this.settings.columns[colEnd].end.hour - endHour) * eventColLength

//     // get color based on course type
//     const color = subjectTypeColors[event.type];

//     const data: ParsedEvent = {
//       ...event,
//       colStart,
//       colEnd,
//       colSpan,
//       startPadding,
//       endPadding,
//       color,
//     }

//     return [day, data] as [DAY, ParsedEvent];

//   }

//   public get events(): Record<DAY, OrganizedEvent> {
//   }

//   private organizeDayEvents(events: Record<DAY, ParsedEvent>): SchedulerEvent[] {
//     // to get row in day we must check event overlaping
//     const hasOverlap = (event: ParsedEvent, events: ParsedEvent[]) => {
//       return events.some(e =>
//         (event.colStart >= e.colStart && event.colStart < e.colEnd) ||
//         (event.colEnd > e.colStart && event.colEnd <= e.colEnd) ||
//         (event.colStart <= e.colStart && event.colEnd >= e.colEnd)
//       );
//     }


//     const getDayRow = (day: DAY): number => {
//       return this.settings.rows.findIndex(row => row.day === day);
//     }


//     ObjectTyped.entries(events).map(([day, event]) => {
//       const rowEvents = events[day];
//       // get row in day
//       const row = 1
//       for (let i = 0; i < row; i++) {
//         if (hasOverlap(event, rowEvents)) {
//           row++;
//         } else {
//           break;
//         }
//       }
//     })

//   }
// }

// function schedulerTimeToMinutes(time: ISchedulerTime) {
//   return time.hour * 60 + time.minute;
// }