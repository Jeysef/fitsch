import { uniqBy } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { batch, createMemo } from "solid-js";
import { createMutable } from "solid-js/store";
import { hasOverlap, type TimeSpan } from "~/components/scheduler/time";
import type { CourseData, DayEvent, Event } from "~/components/scheduler/types";
import { useScheduler } from "~/providers/SchedulerProvider";
import type { LECTURE_TYPE } from "~/server/scraper/enums";

interface ScheduleResult {
  selectedEvents: Map<string, Event>;
  completedHours: Record<string, Partial<Record<LECTURE_TYPE, number>>>;
}

interface SchedulerPosition {
  attempt: number;
}

const RATING_WEIGHTS = {
  // Time preferences
  IDEAL_START_HOUR: 9,
  IDEAL_END_HOUR: 17,
  TIME_PENALTY_EARLY: 20.0,
  TIME_PENALTY_LATE: 1.5,

  // Vicinity preferences
  MAX_DESIRED_GAP: 2,
  LONE_EVENT_PENALTY: 0.2,
  GAP_PENALTY: 0.01,
  MAX_HOURS_IN_ROW: 5,
  IDEAL_HOURS_A_DAY: 4,
} as const;

/**
 * Value is a number between 0 and 1
 * 0 is the best time, 1 is the worst
 */
function getTimePreferencePenalty(timespan: TimeSpan): number {
  if (timespan.start.hour < RATING_WEIGHTS.IDEAL_START_HOUR) {
    return ((RATING_WEIGHTS.IDEAL_START_HOUR - timespan.start.hour) * RATING_WEIGHTS.TIME_PENALTY_EARLY) / 24;
  }
  // Gradually decrease score as the day progresses after IDEAL_START_HOUR
  return (timespan.end.hour - RATING_WEIGHTS.IDEAL_START_HOUR) / (24 - RATING_WEIGHTS.IDEAL_START_HOUR);
}

export default function SchedulerGenerator() {
  const { store } = useScheduler();
  const currentPosition: SchedulerPosition = createMutable({ attempt: 0 });

  // precalculate type counts,... using solid primitives
  const courseTypeCounts = createMemo(() => {
    const counts = new Map<string, number>();
    console.log("🚀 ~ file: generator2.singlePass.ts:54 ~ courseTypeCounts ~ store.data:", Object.hasOwn(store, "data"));
    const storeDayData = Object.hasOwn(store, "data") ? Object.values(store.data) : [];
    for (const day of storeDayData) {
      for (const dayEvent of day.events) {
        const event = dayEvent.event;
        const key = `${event.courseDetail.id}-${event.type}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return counts;
  });

  const orderedEvents = createMemo(() => {
    if (!Object.hasOwn(store, "data")) {
      return [];
    }
    return Object.values(store.data)
      .flatMap((day) => day.events.map((e) => e.event))
      .map((e) => ({
        event: e,
        score: rateEvent(e, undefined, currentPosition.attempt),
      }))
      .sort((a, b) => a.score - b.score);
  });

  const getEmptyCompletedHours = () => {
    return ObjectTyped.fromEntries(store.courses.map((c) => [c.detail.id, {}]));
  };

  function hasTimeOverlap(event: Event, events: Iterable<Event>): boolean {
    const eventSpan = event.timeSpan;
    for (const selected of events) {
      if (selected.id !== event.id && selected.day === event.day && hasOverlap(selected.timeSpan, eventSpan)) {
        return true;
      }
    }
    return false;
  }

  function rateEvent(event: Event, state?: ScheduleResult, attempt = 0): number {
    const typeCount = courseTypeCounts().get(`${event.courseDetail.id}-${event.type}`) || 0;
    const Pr = 1 - 1 / (typeCount + 1);
    const Tr = getTimePreferencePenalty(event.timeSpan);
    const Vr = state ? getVicinityPenalty(event, state) : 0;
    const perturbation = getPerturbation(event, attempt);

    // Logs
    batch(() => {
      // @ts-ignore
      event.Pr = Math.round(Pr * 100) / 100;
      // @ts-ignore
      event.Tr = Math.round(Tr * 100) / 100;
      // @ts-ignore
      event.Vr = Math.round(Vr * 100) / 100;
    });

    return Pr + Tr + Vr + perturbation;
  }

  function getPerturbation(event: Event, attempt: number): number {
    const seed = hashCode(`${event.id}_${attempt}`);
    const random = (Math.sin(seed) + 1) / 2; // Range [0, 1]
    const magnitude = 1.0; // Increased magnitude for greater variation
    return (random - 0.5) * magnitude; // Range [-0.5, 0.5]
  }

  function hashCode(str: string): number {
    let hash = 0;
    for (const char of str) {
      hash = (hash << 5) - hash + char.charCodeAt(0);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  }

  function getVicinityPenalty(event: Event, state: ScheduleResult): number {
    const dayEvents = Array.from(state.selectedEvents.values()).filter((e) => e.day === event.day);
    const dayEventsHours = dayEvents.reduce((acc, e) => acc + e.timeSpan.hours, 0);

    return dayEventsHours <= RATING_WEIGHTS.IDEAL_HOURS_A_DAY
      ? 1 - dayEventsHours / RATING_WEIGHTS.IDEAL_HOURS_A_DAY
      : 1 - 1 / (dayEventsHours - RATING_WEIGHTS.IDEAL_HOURS_A_DAY);
  }

  function rerateEvent(
    rating: number,
    event: Event,
    index: number,
    collection: { event: Event; score: number }[],
    typeCounts: Map<string, number>
  ): number {
    const precedingEvents = collection.slice(0, index + 1).map((e) => e.event);
    function getLinkedScore(event: Event): number {
      const linkedEvents = uniqBy([...event.strongLinked, ...event.linked], (e) => e.id)
        .map((link) => store.data[link.day].events.find((e) => e.event.id === link.id))
        .filter((e) => e) as DayEvent[];

      const linkedScore = linkedEvents.reduce(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        (acc, { event }) => acc + collection.find((e) => e.event.id === event.id)!.score,
        0
      );
      // rate is mean of all linked events
      return (rating + linkedScore) / (linkedEvents.length + 1);
    }
    /**
     * Value is a number between 0 and 1
     * 0 is the best time, 1 is the worst
     */
    function getPriorityScore(event: Event): number {
      // check store.data for count of events with event.type type
      const eventTypesCount = Object.values(store.data)
        .flatMap((day) => day.events)
        .filter((e) => e.event.courseDetail.id === event.courseDetail.id && e.event.type === event.type).length;
      console.log(`Event: ${event.courseDetail.abbreviation} ${event.type} count: ${eventTypesCount}`);
      return 1 - 1 / (eventTypesCount + 1);
    }
    function getVicinityScore(event: Event): number {
      // the more events are in a day except event time, the better
      const dayEvents: Event[] = precedingEvents.filter((e) => e.day === event.day);

      const dayEventsHours = dayEvents.reduce((acc, e) => acc + e.timeSpan.hours, 0);
      /**
       * Value is a number between 0 and 1
       * 0 is the best time, 1 is the worst
       */
      const selectedInDayScore =
        (dayEventsHours <= RATING_WEIGHTS.IDEAL_HOURS_A_DAY
          ? 1 - dayEventsHours / RATING_WEIGHTS.IDEAL_HOURS_A_DAY
          : 1 - 1 / (dayEventsHours - RATING_WEIGHTS.IDEAL_HOURS_A_DAY)) * 0.5;
      // gap and lone event penalty
      // Calculate gaps between events
      let gapPenalty = 0;
      let loneEventPenalty = 0;

      if (dayEvents.length > 0) {
        const sortedDayEvents = [...dayEvents].sort((a, b) => a.timeSpan.start.hour - b.timeSpan.start.hour);

        // Find gaps before and after current event
        const eventStart = event.timeSpan.start.hour;
        const eventEnd = event.timeSpan.end.hour;

        // Check gap with previous event
        const prevEvent = sortedDayEvents.findLast((e) => e.timeSpan.end.hour <= eventStart);
        if (prevEvent) {
          const gap = eventStart - prevEvent.timeSpan.end.hour;
          if (gap > RATING_WEIGHTS.MAX_DESIRED_GAP) {
            gapPenalty += gap * RATING_WEIGHTS.GAP_PENALTY;
          }
        }

        // Check gap with next event
        const nextEvent = sortedDayEvents.find((e) => e.timeSpan.start.hour >= eventEnd);
        if (nextEvent) {
          const gap = nextEvent.timeSpan.start.hour - eventEnd;
          if (gap > RATING_WEIGHTS.MAX_DESIRED_GAP) {
            gapPenalty += gap * RATING_WEIGHTS.GAP_PENALTY;
          }
        }

        // Check if event is lone (gap > 4 hours from others)
        if (
          prevEvent &&
          eventStart - prevEvent.timeSpan.end.hour > 4 &&
          nextEvent &&
          nextEvent.timeSpan.start.hour - eventEnd > 4
        ) {
          loneEventPenalty = RATING_WEIGHTS.LONE_EVENT_PENALTY;
        }
      }

      return selectedInDayScore + gapPenalty + loneEventPenalty;
    }
    const Tr = getTimePreferencePenalty(event.timeSpan);
    const Pr = getPriorityScore(event);
    const Ls = getLinkedScore(event);
    const Vr = getVicinityScore(event);
    // const Vr = 0;

    // Logs ----------------
    batch(() => {
      // @ts-ignore
      event.Pr = Math.round(Pr * 100) / 100;
      // @ts-ignore
      event.Tr = Math.round(Tr * 100) / 100;
      // @ts-ignore
      event.Vr = Math.round(Vr * 100) / 100;
    });
    // Logs ----------------
    return Pr + Tr + Ls + Vr;
    // return rating;
  }

  function generateSchedule(courses: CourseData[], attempt: number): ScheduleResult | null {
    console.log(`Generating schedule for attempt ${attempt}`);

    const state: ScheduleResult = {
      selectedEvents: new Map<string, Event>(),
      completedHours: getEmptyCompletedHours(),
    };

    for (const { event } of orderedEvents()) {
      if (hasTimeOverlap(event, state.selectedEvents.values())) continue;

      const type = event.type;
      const courseId = event.courseDetail.id;
      const requiredHours = event.metrics.weeklyLectures;
      const completedHours = state.completedHours[courseId][type] || 0;

      // if does not fit, skip
      if (completedHours + event.timeSpan.hours > requiredHours) continue;

      const allLinkedEvents = uniqBy([...event.strongLinked, ...event.linked], (e) => e.id);

      let canAddAllLinks = true;
      const linkedEventDataMap = new Map<string, Event>();

      for (const linkedEventData of allLinkedEvents) {
        const linkedEvent = store.data[linkedEventData.day].events.find((e) => e.event.id === linkedEventData.id)?.event;
        if (!linkedEvent) {
          canAddAllLinks = false;
          break;
        }
        if (hasTimeOverlap(linkedEvent, state.selectedEvents.values())) {
          canAddAllLinks = false;
          break;
        }

        const linkedType = linkedEvent.type;
        const linkedCourseId = linkedEvent.courseDetail.id;
        const linkedRequiredHours = linkedEvent.metrics.weeklyLectures;
        const linkedCompletedHours = state.completedHours[linkedCourseId][linkedType] || 0;

        if (linkedCompletedHours + linkedEvent.timeSpan.hours > linkedRequiredHours) {
          canAddAllLinks = false;
          break;
        }
        linkedEventDataMap.set(linkedEvent.id, linkedEvent);
      }

      console.log("🚀 ~ file: generator2.singlePass.ts:286 ~ generateSchedule ~ canAddAllLinks:", canAddAllLinks);
      if (canAddAllLinks) {
        state.selectedEvents.set(event.id, event);
        state.completedHours[courseId][type] = completedHours + event.timeSpan.hours;
        // logging
        console.log(`Event ${event.id} type ${event.type} day ${event.day} Added.`);

        for (const linkedEventData of allLinkedEvents) {
          const linkedEvent = linkedEventDataMap.get(linkedEventData.id)!;
          state.selectedEvents.set(linkedEvent.id, linkedEvent);
          state.completedHours[linkedEvent.courseDetail.id][linkedEvent.type] =
            (state.completedHours[linkedEvent.courseDetail.id][linkedEvent.type] || 0) + linkedEvent.timeSpan.hours;
          console.log(`Linked event ${event.id} type ${event.type} day ${event.day} Added.`);
        }
      }
      // Check if all courses have required hours
      const allCoursesComplete = courses.every((course) => {
        const courseHours = state.completedHours[course.detail.id];
        return ObjectTyped.entries(course.metrics).every(([type, requiredHours]) => {
          const completed = courseHours[type] || 0;
          console.log(
            "🚀 ~ file: generator2.singlePass.ts:305 ~ returnObjectTyped.entries ~ completed:",
            completed,
            requiredHours.weeklyLectures
          );
          return completed === requiredHours.weeklyLectures;
        });
      });

      if (allCoursesComplete) {
        console.log("All courses have required hours");
        return state;
      }
    }

    // log missing hours
    console.warn("Missing hours:");
    for (const course of store.courses) {
      const courseHours = state.completedHours[course.detail.id];
      for (const [type, metrics] of ObjectTyped.entries(course.metrics)) {
        const completed = courseHours[type] || 0;
        const required = metrics.weeklyLectures;
        if (completed < required) {
          console.warn(`${course.detail.abbreviation} ${type}: ${completed}/${required}`);
        }
      }
    }

    console.warn("Not all courses have required hours");
    return null;
  }

  function applyScheduleToStore(result: ScheduleResult) {
    batch(() => {
      for (const dayData of Object.values(store.data)) {
        for (const e of dayData.events) {
          e.event.checked = result.selectedEvents.has(e.event.id);
        }
      }
    });
  }

  function tryGenerateSchedule(forward: boolean): void {
    const maxAttempts = 10000;
    while (currentPosition.attempt >= 0 && currentPosition.attempt < maxAttempts) {
      currentPosition.attempt += forward ? 1 : -1;

      // Ensure attempt stays within valid bounds
      if (currentPosition.attempt < 0 || currentPosition.attempt >= maxAttempts) {
        console.warn("Attempt out of bounds");
        break;
      }

      const result = generateSchedule(store.courses, currentPosition.attempt);
      if (result) {
        applyScheduleToStore(result);
        break;
      }
    }
  }

  function generateNext(): void {
    tryGenerateSchedule(true);
  }

  function generatePrevious(): void {
    tryGenerateSchedule(false);
  }

  const canGeneratePrevious = createMemo(() => currentPosition.attempt > 0);

  return {
    generateNext,
    generatePrevious,
    canGeneratePrevious,
  };
}
