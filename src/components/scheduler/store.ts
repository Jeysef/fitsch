
interface ISchedulerTime {
  hour: number;
  minute: number;
}

interface IScheduleRow {
  title: string;
}

interface IScheduleColumn {
  title: string;
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
  const columns: IScheduleColumn[] = [];
  let current = { ...config.start };
  while (current.hour < config.end.hour || (current.hour === config.end.hour && current.minute <= config.end.minute)) {
    columns.push({ title: config.getTimeHeader(current, config.step) });
    current.minute += config.step.minute;
    if (current.minute >= 60) {
      current.minute -= 60;
      current.hour++;
    }
  }
  return columns;
}

export class Scheduler {
  static readonly defaultSettings: ISchedulerSettings = {
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
  settings: ISchedulerSettings;
  constructor(settings: ISchedulerSettings) {
    this.settings = { ...Scheduler.defaultSettings, ...settings };
  }

  // public addEvent
}