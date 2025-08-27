import type { CustomEvent, Event } from "~/components/scheduler/event/types";
import type { DAY } from "~/server/scraper/enums";
import { DayEventStore } from "~/store/dayEventStore";
import { DayStore } from "~/store/dayStore";
import type { SchedulerStore } from "~/store/store";
import type { Course, Data } from "~/store/store.types";

export class DataStore {
  data: Data;
  constructor(private readonly store: SchedulerStore) {
    this.data = this.getEmptyData();
    return this;
  }

  private getEmptyData = () => Object.values(this.store.settings.rows).map((dayNumber) => new DayStore(dayNumber));

  public withCustomEvents = (customEvents: CustomEvent[]) => {
    for (const event of customEvents) {
      this.addEvent(event);
    }
    return this;
  };

  public fromCourses = (courses: Course[]) => {
    for (const course of courses) {
      for (const event of course.data) {
        this.addEvent(event);
      }
    }
    return this;
  };

  private getDayRow = (day: DAY) => this.store.settings.rows[day];

  private addEvent = (event: Event) => {
    const dayEvent = new DayEventStore(event, this.store.settings.columns);
    const row = this.getDayRow(event.day);
    if (row === undefined) return;
    this.data[row - 1].addEvent(dayEvent);
  };

  public sort = () => {
    for (const dayData of this.data) {
      dayData.sort();
    }
    return this;
  };

  private withData = (data: Data) => {
    this.data = data;
    return this;
  };

  public clone(filterEvents?: (event: DayEventStore) => unknown): DataStore {
    return new DataStore(this.store).withData(this.data.map((dayStore) => dayStore.clone(filterEvents)));
  }
}
