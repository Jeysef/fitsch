// import type { SchedulerStore } from "~/components/scheduler/store";
// import type { TimeSpan } from "~/components/scheduler/time";
// import { days } from "~/config/scheduler";
// import { LECTURE_TYPE, type DAY } from "~/server/scraper/enums";
// import { conjunctConjunctableRooms } from "~/server/scraper/utils";
// import type { ScrapedEvent, ScrapedLectureData } from "./oldAppScraper";
// import type { DayEvent, ScheduleEvent } from "~/components/scheduler/event/types";

// export interface ComparisonResult {
//   matches: boolean;
//   partialMatch: boolean;
//   oldEvent: ScrapedEvent | null;
//   newEvent: Event | null;
//   differences: EventDifferences | null;
//   source: "old" | "new"; // Add source to track which system the event came from
// }

// export interface EventDifferences {
//   time?: boolean;
//   room?: boolean;
//   type?: boolean;
//   weeks?: boolean;
// }

// export interface DayComparisonResult {
//   day: string;
//   exactMatches: number;
//   partialMatchCount: number;
//   totalCount: number;
//   mismatches: ComparisonResult[];
//   partialMatches: ComparisonResult[];
//   allComparisons: ComparisonResult[];
//   extraEvents: ComparisonResult[]; // Events present in new but not in old
//   missingEvents: ComparisonResult[]; // Events present in old but not in new
// }

// export class ScheduleComparer {
//   constructor(
//     private oldAppData: ScrapedLectureData[],
//     private schedulerData: SchedulerStore["data"]
//   ) {}

//   private weeksFormat(weeks: number[] | string): string {
//     if (typeof weeks === "string") return weeks;
//     return weeks.map((w) => `${w}.`).join(" ");
//   }

//   private formatTimeSpan(timeSpan: TimeSpan): string {
//     if (!timeSpan) return "";
//     const pad = (n: number) => n.toString().padStart(2, "0");
//     const start = timeSpan.start || timeSpan;
//     const end = timeSpan.end || timeSpan;
//     return `${pad(start.hour)}:${pad(start.minute)} - ${pad(end.hours)}:${pad(end.minute === 50 ? 0 : end.minute)}`;
//   }

//   private normalizeTime(timeStr: string): string {
//     // Extract just the start time for comparison
//     // e.g. "09:00 - 11:00" -> "09:00"
//     return timeStr.split(" - ")[0];
//   }

//   // private compareTimeSpans(oldEvent: ScrapedEvent, newEvent: any): boolean {
//   //   const oldTime = this.formatTimeSpan(oldEvent.timeSpan);
//   //   const newTime = this.formatTimeSpan(newEvent.event.timeSpan);

//   //   // Compare just start times since end times differ between systems
//   //   return this.normalizeTime(oldTime) === this.normalizeTime(newTime);
//   // }

//   // private compareBasicProperties(oldEvent: ScrapedEvent, newEvent: any): boolean {
//   //   return newEvent.event.room === oldEvent.room && newEvent.event.type === oldEvent.type;
//   // }

//   // private compareWeeks(oldEvent: ScrapedEvent, newEvent: any): boolean {
//   //   const oldWeeks = oldEvent.weeks || this.weeksFormat(newEvent.event.weeks.weeks);
//   //   const newWeeks = this.weeksFormat(newEvent.event.weeks.weeks);
//   //   return oldWeeks === newWeeks;
//   // }

//   // private findMatchingEvent(oldEvent: ScrapedEvent, events: any[]): { exactMatch: any; partialMatch: any } {
//   //   let exactMatch = null;
//   //   let partialMatch = null;

//   //   for (const event of events) {
//   //     const isTimeMatch = this.compareTimeSpans(oldEvent, event);
//   //     if (!isTimeMatch) continue;

//   //     const isBasicMatch = this.compareBasicProperties(oldEvent, event);
//   //     const isWeekMatch = this.compareWeeks(oldEvent, event);

//   //     if (isTimeMatch && isBasicMatch && isWeekMatch) {
//   //       exactMatch = event;
//   //       break;
//   //     }
//   //     if (!partialMatch) {
//   //       partialMatch = event;
//   //     }
//   //   }

//   //   return { exactMatch, partialMatch };
//   // }

//   // private getDifferences(oldEvent: ScrapedEvent, newEvent: any): EventDifferences | null {
//   //   if (!newEvent) return null;
//   //   return {
//   //     time: newEvent.event.timeSpan.toString() !== oldEvent.timeSpan.toString(),
//   //     room: newEvent.event.room !== oldEvent.room,
//   //     type: newEvent.event.type !== oldEvent.type,
//   //     weeks:
//   //       this.weeksFormat(newEvent.event.weeks.weeks) !== (oldEvent.weeks || this.weeksFormat(newEvent.event.weeks.weeks)),
//   //   };
//   // }

//   public logEventDetails<T extends "old" | "new">(event: T extends "old" ? ScrapedEvent : DayEvent, type: T, day?: DAY) {
//     const base = type === "old" ? (event as ScrapedEvent) : ((event as DayEvent).eventData.event as ScheduleEvent);
//     return {
//       time: `${this.formatTimeSpan(base.timeSpan)} ${day}`,
//       room: base.room,
//       type: base.type,
//       weeks:
//         type === "old"
//           ? base.weeks
//           : this.weeksFormat(base.weeks.weeks) + (base.weeks.parity ? ` (${base.weeks.parity})` : ""),
//       courseId:
//         type === "old"
//           ? `${base.courseId} ${base.courseName}`
//           : `${event.courseDetail.id} ${event.courseDetail.abbreviation}`,
//     };
//   }

//   // private compareEvents(oldEvent: ScrapedEvent, currentDayData: DayEvent[]): ComparisonResult {
//   //   const matchingEvents = currentDayData.filter((e: any) => e.event.courseDetail.id === oldEvent.courseId);
//   //   const { exactMatch, partialMatch } = this.findMatchingEvent(oldEvent, matchingEvents);

//   //   return {
//   //     matches: !!exactMatch,
//   //     partialMatch: !!partialMatch && !exactMatch,
//   //     oldEvent,
//   //     newEvent: exactMatch || partialMatch,
//   //     differences: !exactMatch && partialMatch ? this.getDifferences(oldEvent, partialMatch) : null,
//   //     source: "old",
//   //   };
//   // }

//   private getNewEventsForDay(day: DAY): DayEvent[] {
//     const dayData = this.schedulerData[day];
//     return dayData?.events || [];
//   }

//   private getOldEventsForDay(day: DAY): ScrapedEvent[] {
//     const dayData = this.oldAppData.find((d) => d.day === day);
//     return dayData?.events || [];
//   }

//   private getEventKey(event: any, type: "old" | "new"): string {
//     const timeSpan = type === "old" ? event.timeSpan : event.event.timeSpan;
//     const room = type === "old" ? conjunctConjunctableRooms(event.room.split(" ")) : event.event.room;
//     const weeksExact =
//       type === "old"
//         ? event.weeks.split(" ").length > 1 || event.weeks.split(" ").includes(".")
//         : typeof event.event.weeks.weeks !== "string";
//     // const eventType = type === "old" ? event.type : event.event.type;
//     // oldEvent.weeks.split(" ").length > 1 &&
//     //       typeof newEvent.event.weeks.weeks !== "string"

//     // Use only start time in the key

//     // log
//     return `${this.normalizeTime(this.formatTimeSpan(timeSpan))}-${room}-${+weeksExact}`;
//   }

//   private compareDay(day: DAY): DayComparisonResult {
//     const oldEvents = this.getOldEventsForDay(day);
//     const newEvents = this.getNewEventsForDay(day);

//     const eventComparisons: ComparisonResult[] = [];
//     const processedNewEvents = new Set<string>();

//     // Compare old events against new
//     for (const oldEvent of oldEvents) {
//       const oldEventKey = this.getEventKey(oldEvent, "old");
//       let foundMatch = false;

//       for (const newEvent of newEvents) {
//         const newEventKey = this.getEventKey(newEvent, "new");

//         if (oldEventKey === newEventKey) {
//           // if weeks don't match console log the event
//           if (
//             // old scheduler does not differentiate between seminar and exercise
//             newEvent.eventData.event.type === oldEvent.type ||
//             (newEvent.eventData.event.type === LECTURE_TYPE.SEMINAR && oldEvent.type === LECTURE_TYPE.EXERCISE)
//           ) {
//             const differences: EventDifferences = {};

//             if (oldEvent.weeks !== this.weeksFormat(newEvent.eventData.event.weeks.weeks)) {
//               differences.weeks = true;
//               console.log(
//                 "Weeks don't match",
//                 "Expected (old): ",
//                 this.logEventDetails(oldEvent, "old", day),
//                 "\n",
//                 "Recieved (new): ",
//                 this.logEventDetails(newEvent, "new", day),
//                 "Suggested weeks:",
//                 newEvent.eventData.metrics.weeks
//               );
//             }
//             foundMatch = true;
//             if (!processedNewEvents.has(newEventKey)) {
//               processedNewEvents.add(newEventKey);
//               eventComparisons.push({
//                 matches: true,
//                 partialMatch: Object.keys(differences).length > 0,
//                 oldEvent,
//                 newEvent: newEvent.eventData.event,
//                 differences: differences,
//                 source: "old",
//               });
//             }
//             break;
//           }
//         }
//       }

//       if (!foundMatch) {
//         eventComparisons.push({
//           matches: false,
//           partialMatch: false,
//           oldEvent,
//           newEvent: null,
//           differences: null,
//           source: "old",
//         });
//       }
//     }

//     // Find extra events in new that weren't matched
//     for (const newEvent of newEvents) {
//       const newEventKey = this.getEventKey(newEvent, "new");
//       if (!processedNewEvents.has(newEventKey)) {
//         eventComparisons.push({
//           matches: false,
//           partialMatch: false,
//           oldEvent: null,
//           newEvent: newEvent.event,
//           differences: null,
//           source: "new",
//         });
//       }
//     }

//     const result = {
//       day,
//       exactMatches: eventComparisons.filter((c) => c.matches).length,
//       partialMatchCount: eventComparisons.filter((c) => c.partialMatch).length,
//       totalCount: eventComparisons.length,
//       mismatches: eventComparisons.filter((c) => !c.matches && !c.partialMatch && c.source === "old"),
//       partialMatches: eventComparisons.filter((c) => c.partialMatch),
//       extraEvents: eventComparisons.filter((c) => c.source === "new" && !c.matches && !c.partialMatch),
//       missingEvents: eventComparisons.filter((c) => c.source === "old" && !c.matches && !c.partialMatch),
//       allComparisons: eventComparisons,
//     };

//     return result;
//   }

//   compare(): DayComparisonResult[] {
//     const allDays = days;
//     const results: DayComparisonResult[] = [];

//     for (const day of allDays) {
//       const dayComparison = this.compareDay(day);
//       results.push(dayComparison);
//     }

//     return results;
//   }
// }
