export enum DAYS {
  MO = "Po",
  TU = "Út",
  WE = "St",
  TH = "Čt",
  FR = "Pá",
}

export const days = Object.values(DAYS);

export const DayNumbers = {
  [DAYS.MO]: 1,
  [DAYS.TU]: 2,
  [DAYS.WE]: 3,
  [DAYS.TH]: 4,
  [DAYS.FR]: 5,
} as const satisfies Record<DAYS, number>;

export interface ISchedulerSettings {
  startHour: number;
  hourStep: number;
  endHour: number;
  columns: number;
  rows: number;
  timeBlocks: string[];
}

export type IScheduleData = Record<DAYS, IScheduleDay>;

export interface IScheduleDay {
  events: IScheduleEvent[];
  rows: number;
  row: number;
}

export interface IScheduleEvent {
  name: string;
  link: string;
  dayNumber: number;
  room: string | undefined;
  start: string; // "07:00"
  end: string;
  type: string;
  row: number;
  colStart: number;
  colEnd: number;
}

interface SchedulerConfig {
  data: {
    type: string;
    color: string;
    togglable: boolean;
    events: {
      start: string;
      end: string;
      day: DAYS;
      name: string;
      link: string;
      room: string;
    }[]
  }[]
}