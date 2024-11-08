import type { ISchedulerTime } from "~/components/scheduler/types";


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
  static fromPlain(timeSpan: TimeSpan) {
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
}