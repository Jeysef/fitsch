import type { Jsonify } from "type-fest";
import { ClassRegistry } from "~/components/scheduler/classRegistry";
import type { ISchedulerTime } from "~/components/scheduler/types";

type NoClassTypeType<T> = T extends Time | TimeSpan
  ? T
  : T extends (infer U)[]
    ? NoClassTypeType<U>[]
    : T extends Record<string, any>
      ? { [K in Exclude<keyof T, "__type">]: NoClassTypeType<T[K]> }
      : T;

export class TimeSpan {
  static readonly __type = "TimeSpan";
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

  static fromPlain(data: NoClassTypeType<Jsonify<ReturnType<TimeSpan["toJSON"]>>>) {
    return new TimeSpan(Time.fromJSON(data.start), Time.fromJSON(data.end));
  }

  toJSON() {
    return {
      __type: TimeSpan.__type,
      start: this.start,
      end: this.end,
    };
  }

  // when deserializing, inner classes are deserialized sooner, we can use them directly
  static fromJSON(json: NoClassTypeType<ReturnType<TimeSpan["toJSON"]>>) {
    return new TimeSpan(json.start, json.end);
  }
}

export class Time {
  static readonly __type = "Time";
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

  toJSON() {
    return {
      __type: Time.__type,
      hour: this.hour,
      minute: this.minute,
    };
  }

  static fromJSON(json: NoClassTypeType<Jsonify<ReturnType<Time["toJSON"]>>>) {
    return new Time({ hour: json.hour, minute: json.minute });
  }
}

export function hourDifference(start: number, end: number) {
  return Math.abs(start - end);
}

export function hasOverlap(a: TimeSpan, b: TimeSpan): boolean {
  return !(a.end.minutes <= b.start.minutes || a.start.minutes >= b.end.minutes);
}

ClassRegistry.register(Time.__type, Time);
ClassRegistry.register(TimeSpan.__type, TimeSpan);
