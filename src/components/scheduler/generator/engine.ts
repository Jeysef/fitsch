import { ObjectTyped } from "object-typed";
import type { Event, ScheduleEvent } from "~/components/scheduler/event/types";
import { isAllowedOverlap } from "~/components/scheduler/generator/utils";
import type { LECTURE_TYPE } from "~/enums/enums";
import { hasOverlap } from "~/lib/time/time";
import type { Course, LectureMetrics } from "~/store/store.types";

/**
 * Encapsulates the state and logic for a single schedule generation attempt.
 * This class is temporary and created for each run.
 */
export class SchedulerEngine {
  public readonly selectedEvents: Map<string, Event>;
  private readonly completedHours: Record<string, Partial<Record<LECTURE_TYPE, number>>>;

  constructor(
    private readonly courses: readonly Course[],
    customEvents: readonly Event[]
  ) {
    this.selectedEvents = new Map(customEvents.map((e) => [e.id, e]));
    this.completedHours = ObjectTyped.fromEntries(courses.map((c) => [c.detail.id, {}]));
  }

  isEventSelected(eventId: string): boolean {
    return this.selectedEvents.has(eventId);
  }

  getMetrics(event: ScheduleEvent): LectureMetrics {
    const course = this.courses.find((c) => c.detail.id === event.courseId)!;
    return course.metrics[event.type]!;
  }

  /** Checks if a single event can be placed without considering its links. */
  canPlacePrimaryEvent(event: ScheduleEvent): boolean {
    // const { event, courseDetail, metrics } = eventData;
    const completed = this.completedHours[event.courseId][event.type] || 0;
    const metrics = this.getMetrics(event);
    if (completed + event.timeSpan.hours > metrics.weeklyLectures) {
      return false;
    }
    return !this.hasDisallowedOverlap(event);
  }

  /** Adds a validated group of events to the schedule state. */
  addEventGroup(group: readonly ScheduleEvent[]): void {
    for (const event of group) {
      this.selectedEvents.set(event.id, event);
      const currentHours = this.completedHours[event.courseId][event.type] || 0;
      this.completedHours[event.courseId][event.type] = currentHours + event.timeSpan.hours;
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
    return this.courses.every((course) => {
      const courseHours = this.completedHours[course.detail.id];
      return Object.entries(course.metrics).every(([type, metrics]) => {
        return (courseHours[type as LECTURE_TYPE] || 0) === metrics.weeklyLectures;
      });
    });
  }

  logMissingHours(): void {
    console.warn("Could not generate a complete schedule. Missing hours:");
    for (const course of this.courses) {
      const courseHours = this.completedHours[course.detail.id];
      for (const [type, metrics] of Object.entries(course.metrics)) {
        const completed = courseHours[type as LECTURE_TYPE] || 0;
        const required = metrics.weeklyLectures;
        if (completed < required) {
          console.warn(`${course.detail.abbreviation} ${type}: ${completed}/${required}`);
        }
      }
    }
  }
}
