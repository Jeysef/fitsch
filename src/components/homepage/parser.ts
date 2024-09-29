import type { IData } from "./data";
import { DayNumbers, DAYS, type IScheduleData, type ISchedulerSettings } from "~/components/scheduler/types";
import { valueToEnumValue } from "~/lib/utils";


export const formatData = (schedulerSettings: ISchedulerSettings, data: IData[]): IScheduleData => {
  const formattedData: IScheduleData = {
    [DAYS.MO]: { events: [], rows: 1, row: 1 },
    [DAYS.TU]: { events: [], rows: 1, row: 2 },
    [DAYS.WE]: { events: [], rows: 1, row: 3 },
    [DAYS.TH]: { events: [], rows: 1, row: 4 },
    [DAYS.FR]: { events: [], rows: 1, row: 5 },
  }

  for (const event of data) {
    const day = dayToDayEnum(event.day);
    const dayNumber = DayNumbers[day];
    const [startHour, startMinute] = event.start.split(":").map(Number);
    const [endHour, endMinute] = event.end.split(":").map(Number);
    const colStart = startHour - schedulerSettings.startHour + 1;
    const colEnd = endHour - schedulerSettings.startHour + 1;

    // console.table({ startHour, startMinute, endHour, endMinute, colStart, colEnd });

    const dayRows = formattedData[day].rows;
    // worst case scenario, will try to lower it later
    let eventRow = dayRows + 1;
    // check if there is a free row for the event
    for (let row = 1; row <= dayRows; row++) {
      const rowEvents = formattedData[day].events.filter(e => e.row === row);
      const hasOverlap = rowEvents.some(e =>
        (colStart >= e.colStart && colStart < e.colEnd) ||
        (colEnd > e.colStart && colEnd <= e.colEnd) ||
        (colStart <= e.colStart && colEnd >= e.colEnd)
      );
      if (!hasOverlap) {
        eventRow = row;
        break;
      }
    }
    formattedData[day].rows = Math.max(dayRows, eventRow);
    formattedData[day].events.push({
      ...event,
      dayNumber,
      row: eventRow,
      colStart,
      colEnd,
    });
  }

  return formattedData;
};

function dayToDayEnum(day: string) {
  return valueToEnumValue(day, DAYS);
}