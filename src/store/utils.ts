import type { Event } from "~/components/scheduler/event/types";
import { LECTURE_TYPE } from "~/enums/enums";
import { hasOverlap, TimeSpan, type Time } from "~/lib/time/time";
import { percentage } from "~/lib/utils";
import type { LectureMutator } from "~/server/scraper/lectureMutator";
import type { AnyEventType, ICreateColumns, IScheduleColumn } from "~/store/store.types";

export function getEventTypePriority(type: AnyEventType): number {
  const priorityMap: Record<AnyEventType, number> = {
    [LECTURE_TYPE.LECTURE]: 0,
    [LECTURE_TYPE.SEMINAR]: 1,
    [LECTURE_TYPE.EXERCISE]: 2,
    [LECTURE_TYPE.LABORATORY]: 3,
    [LECTURE_TYPE.EXAM]: 4,
    CUSTOM: 4,
  };
  return priorityMap[type] ?? 4;
}

export function findAvailableRow(pivotEvent: Event, precedingEvents: { event: Event; row: number }[]): number {
  const occupiedRows = new Set<number>();

  // Find all rows that are occupied by overlapping events
  for (const dayEvent of precedingEvents) {
    if (hasOverlap(pivotEvent.timeSpan, dayEvent.event.timeSpan)) {
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

/**
 * Mutates the events array
 */
export function assignEventsRows(events: Event[]) {
  let dayRows = 1;
  const eventsWRow = events.reduce(
    (acc, event) => {
      const row = findAvailableRow(event, acc);
      dayRows = Math.max(dayRows, row);

      acc.push({
        event,
        row,
      });
      return acc;
    },
    [] as { event: Event; row: number }[]
  );

  return { dayRows, eventsWRow };
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

export function timespanPercentage(part: TimeSpan, total: TimeSpan, decimals = 2) {
  return percentage(part.minutes, total.minutes, decimals);
}

export function getEventPlacement(timeSpan: TimeSpan, columns: IScheduleColumn[]) {
  const eventColumn = getEventColumn(timeSpan, columns);
  const { colStart, colEnd } = eventColumn;
  const startColumnStart = columns[colStart].duration.start;
  const endColumnEnd = columns[colEnd].duration.end;
  const colTimeSpan = new TimeSpan(startColumnStart, endColumnEnd);
  const diffStartTimeSpan = new TimeSpan(timeSpan.start, startColumnStart);
  const diffEndTimeSpan = new TimeSpan(timeSpan.end, endColumnEnd);

  const paddingStart = timespanPercentage(diffStartTimeSpan, colTimeSpan);
  const paddingEnd = timespanPercentage(diffEndTimeSpan, colTimeSpan);

  return { colStart, colEnd, paddingStart, paddingEnd };
}

// Helper function to generate the time column headers for the scheduler grid
export function createColumns(config: ICreateColumns): IScheduleColumn[] {
  // create columns from start to end with step
  const columns: IScheduleColumn[] = [];
  const step = config.step;
  const end = config.end;
  let spanStart = config.start;
  let spanEnd = spanStart.add(step);
  while (spanEnd.minutes <= end.minutes) {
    columns.push({
      title: config.getTimeHeader(spanStart, spanEnd),
      duration: new TimeSpan(spanStart, spanEnd),
    });
    spanStart = spanEnd;
    spanEnd = spanEnd.add(step);
  }

  return columns;
}

// Formatter for time headers in the scheduler columns (e.g., "08:00–08:50")
export const formatTime = (start: Time, end: Time) =>
  `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}–${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;

// Filter function to exclude certain lecture types (e.g., exams, notes) from the main schedule display
export const filter = (event: LectureMutator.MutatedLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);
