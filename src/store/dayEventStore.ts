import type { Event } from "~/components/scheduler/event/types";
import type { IScheduleColumn } from "~/store/store.types";
import { getEventPlacement } from "~/store/utils";

export class DayEventStore<T extends Event = Event> {
  public readonly colStart: number;
  public readonly colEnd: number;
  public readonly paddingStart: number;
  public readonly paddingEnd: number;
  public row: number;

  constructor(
    public readonly event: T,
    columns: IScheduleColumn[]
  ) {
    const { colStart, colEnd, paddingStart, paddingEnd } = getEventPlacement(event.timeSpan, columns);
    this.colStart = colStart;
    this.colEnd = colEnd;
    this.paddingStart = paddingStart;
    this.paddingEnd = paddingEnd;
    this.row = 1;
  }
}
