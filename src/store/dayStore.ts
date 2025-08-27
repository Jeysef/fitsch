import { sortBy } from "es-toolkit";
import type { DayEvent } from "~/components/scheduler/event/types";
import type { DayEventStore } from "~/store/dayEventStore";
import { findAvailableRow, getEventTypePriority } from "~/store/utils";

export class DayStore {
  public dayRows: number;
  public events: DayEventStore[];
  constructor(public readonly dayRow: number) {
    this.dayRows = 1;
    this.events = [];
  }

  private assignEventsRows() {
    let dayRows = 1;
    const eventsWRow = this.events.reduce<DayEvent[]>((acc, dayEvent) => {
      const row = findAvailableRow(dayEvent.event, acc);
      dayRows = Math.max(dayRows, row);

      dayEvent.row = row;

      acc.push(dayEvent);
      return acc;
    }, []);

    return { dayRows, eventsWRow };
  }

  private getSortedEvents = () => {
    this.events = sortBy(this.events, [(dayEvent) => getEventTypePriority(dayEvent.event.type)]);
    const dayRows = this.assignEventsRows().dayRows;

    this.dayRows = dayRows;
  };

  public addEvent = (event: DayEventStore) => {
    this.events.push(event);
  };

  public sort = () => {
    this.getSortedEvents();
    return this;
  };

  private withEvents = (events: DayEventStore[]) => {
    this.events = events;
    return this;
  };

  public clone(filterEvents?: (event: DayEventStore) => unknown) {
    const { events } = this;
    const filteredEvents = (filterEvents ? events.filter(filterEvents) : events).map((event) => ({ ...event, row: 1 }));
    return new DayStore(this.dayRow).withEvents(filteredEvents);
  }
}
