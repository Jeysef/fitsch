import { ObjectTyped } from "object-typed";
import type { Event } from "~/components/scheduler/event/types";
import { isAllowedOverlap } from "~/components/scheduler/generator/utils";
import type { LECTURE_TYPE } from "~/server/scraper/enums";

export class SchedulerEngine {
  public readonly selectedEvents: Map<string, Event>;
  private readonly completedHours: Record<string, Partial<Record<LECTURE_TYPE, number>>>;
  private readonly allCourses: readonly Course[];

  constructor(courses: readonly Course[], customEvents: readonly Event[]) {
    this.allCourses = courses;
    this.selectedEvents = new Map(customEvents.map((e) => [e.id, e]));
    this.completedHours = ObjectTyped.fromEntries(courses.map((c) => [c.detail.id, {}]));
  }

  isEventSelected(eventId: string): boolean {
    return this.selectedEvents.has(eventId);
  }

  /** Checks if a single event can be placed without considering its links. */
  canPlacePrimaryEvent(eventData: ScheduleEventData): boolean {
    const { event, courseDetail, metrics } = eventData;
    const completed = this.completedHours[courseDetail.id][event.type] || 0;
    if (completed + event.timeSpan.hours > metrics.weeklyLectures) {
      return false;
    }
    return !this.hasDisallowedOverlap(event);
  }

  /** Adds a validated group of events to the schedule state. */
  addEventGroup(group: readonly ScheduleEventData[]): void {
    for (const { event, courseDetail } of group) {
      this.selectedEvents.set(event.id, event);
      const currentHours = this.completedHours[courseDetail.id][event.type] || 0;
      this.completedHours[courseDetail.id][event.type] = currentHours + event.timeSpan.hours;
    }
  }

  hasDisallowedOverlap(event: Event): boolean {
    for (const selected of this.selectedEvents.values()) {
      if (
        selected.id !== event.id &&
        selected.day === event.day &&
        hasOverlap(selected.timeSpan, event.timeSpan) &&
        !isAllowedOverlap(event, selected)
      ) {
        return true;
      }
    }
    return false;
  }

  isComplete(): boolean {
    return this.allCourses.every((course) => {
      const courseHours = this.completedHours[course.detail.id];
      return ObjectTyped.entries(course.metrics).every(([type, metrics]) => {
        return (courseHours[type] || 0) === metrics.weeklyLectures;
      });
    });
  }

  logMissingHours(): void {
    console.warn("Could not generate a complete schedule. Missing hours:");
    for (const course of this.allCourses) {
      const courseHours = this.completedHours[course.detail.id];
      for (const [type, metrics] of ObjectTyped.entries(course.metrics)) {
        const completed = courseHours[type] || 0;
        const required = metrics.weeklyLectures;
        if (completed < required) {
          console.warn(`${course.detail.abbreviation} ${type}: ${completed}/${required}`);
        }
      }
    }
  }
}
