import type { WritableKeys } from "ts-essentials";
import type { ISchedulerTime } from "~/components/scheduler/types";

// getters are readonly
type ExcludeReadonlyDeep<T extends object> = {
  [P in WritableKeys<T>]: T[P] extends object ? ExcludeReadonlyDeep<T[P]> : T[P];
};

export class TimeSpan {
  public start: Time;
  public end: Time;
  constructor(start: Time, end: Time) {
    this.start = start;
    this.end = end;
  }
  get minutes() {
    return this.end.minutes - this.start.minutes;
  }
  get hours() {
    return Math.ceil(this.minutes / 60);
  }
  static fromPlain(timeSpan: ExcludeReadonlyDeep<TimeSpan>) {
    return new TimeSpan(new Time(timeSpan.start), new Time(timeSpan.end));
  }
}

export class Time {
  public hour: number;
  public minute: number;
  constructor(time: ISchedulerTime) {
    this.hour = time.hour;
    this.minute = time.minute;
  }
  get minutes() {
    return this.hour * 60 + this.minute;
  }

  get hours() {
    return Math.ceil(this.minutes / 60);
  }

  static fromMinutes(minutes: number) {
    return new Time({ hour: Math.floor(minutes / 60), minute: minutes % 60 });
  }

  static fromString(time: string, separator = ":") {
    const [hour, minute] = time.split(separator).map(Number);
    return new Time({ hour, minute });
  }

  public formatted(separator = ":") {
    return `${this.hour.toString().padStart(2, "0")}${separator}${this.minute.toString().padStart(2, "0")}`;
  }
}

export function hourDifference(start: number, end: number) {
  return Math.abs(start - end);
}

export function hasOverlap(a: TimeSpan, b: TimeSpan): boolean {
  return !(a.end.minutes <= b.start.minutes || a.start.minutes >= b.end.minutes);
}
