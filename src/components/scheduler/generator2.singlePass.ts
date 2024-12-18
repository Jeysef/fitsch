import { chain, uniqBy } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { batch, createMemo } from "solid-js";
import { createMutable } from "solid-js/store";
import { hasOverlap, type TimeSpan } from "~/components/scheduler/time";
import type { CourseData, Event } from "~/components/scheduler/types";
import { useScheduler } from "~/providers/SchedulerProvider";
import type { LECTURE_TYPE } from "~/server/scraper/enums";

interface ScheduleResult {
  selectedEvents: Map<string, Event>;
  completedHours: Record<string, Partial<Record<LECTURE_TYPE, number>>>;
}

const RATING_WEIGHTS = {
  // Time preferences
  IDEAL_START_HOUR: 9,
  IDEAL_END_HOUR: 17,
  TIME_PENALTY_EARLY: 4,
} as const;

/**
 * Value is a number between 0 and 1
 * 0 is the best time, 1 is the worst
 */
function getTimePreferencePenalty(timespan: TimeSpan): number {
  if (timespan.start.hour < RATING_WEIGHTS.IDEAL_START_HOUR) {
    return ((RATING_WEIGHTS.IDEAL_START_HOUR - timespan.start.hour) * (24 - RATING_WEIGHTS.TIME_PENALTY_EARLY)) / 24;
  }
  // Gradually decrease score as the day progresses after IDEAL_START_HOUR
  return (timespan.end.hour - RATING_WEIGHTS.IDEAL_START_HOUR) / (24 - RATING_WEIGHTS.IDEAL_START_HOUR);
}

export default function SchedulerGenerator() {
  const { store } = useScheduler();
  const currentPosition = createMutable({
    attempt: 0,
    isGenerating: false,
  });

  // precalculate type counts,... using solid primitives
  const courseTypeCounts = createMemo(() => {
    const counts = new Map<string, number>();
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
    const data = store.data;
    console.log("orderedEvents", data);
    if (!data) return [];
    return chain(data)
      .values()
      .flatMap((d) => d.events)
      .map(({ event }) => ({
        event: event,
        score: rateEvent(event, undefined, currentPosition.attempt),
      }))
      .orderBy(["score"], ["asc"])
      .value();
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
    const perturbation = getPerturbation(event, attempt);

    // // Logs
    // batch(() => {
    //   // @ts-ignore
    //   event.Pr = Math.round(Pr * 100) / 100;
    //   // @ts-ignore
    //   event.Tr = Math.round(Tr * 100) / 100;
    // });

    return Pr + Tr + perturbation;
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

  async function generateSchedule(courses: CourseData[], attempt: number): Promise<ScheduleResult | null> {
    console.log(`Generating schedule for attempt ${attempt}`);

    const state: ScheduleResult = {
      selectedEvents: new Map<string, Event>(),
      completedHours: getEmptyCompletedHours(),
    };

    let processedCount = 0;
    for (const { event } of orderedEvents()) {
      // Yield every 100 iterations to prevent blocking
      if (++processedCount % 100 === 0) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

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

      if (canAddAllLinks) {
        state.selectedEvents.set(event.id, event);
        state.completedHours[courseId][type] = completedHours + event.timeSpan.hours;

        for (const linkedEventData of allLinkedEvents) {
          const linkedEvent = linkedEventDataMap.get(linkedEventData.id)!;
          state.selectedEvents.set(linkedEvent.id, linkedEvent);
          state.completedHours[linkedEvent.courseDetail.id][linkedEvent.type] =
            (state.completedHours[linkedEvent.courseDetail.id][linkedEvent.type] || 0) + linkedEvent.timeSpan.hours;
        }
      }
      // Check if all courses have required hours
      const allCoursesComplete = courses.every((course) => {
        const courseHours = state.completedHours[course.detail.id];
        return ObjectTyped.entries(course.metrics).every(([type, requiredHours]) => {
          const completed = courseHours[type] || 0;
          return completed === requiredHours.weeklyLectures;
        });
      });

      if (allCoursesComplete) {
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

    console.warn("Not all courses have required hours, could not generate schedule");
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

  async function tryGenerateSchedule(forward: boolean): Promise<void> {
    if (currentPosition.isGenerating) return;

    currentPosition.isGenerating = true;
    const maxAttempts = 10000;

    try {
      while (currentPosition.attempt >= 0 && currentPosition.attempt < maxAttempts) {
        currentPosition.attempt += forward ? 1 : -1;

        if (currentPosition.attempt < 0 || currentPosition.attempt >= maxAttempts) {
          console.warn("Attempt out of bounds");
          break;
        }

        const result = await generateSchedule(store.courses, currentPosition.attempt);
        if (result) {
          applyScheduleToStore(result);
          break;
        }

        // Yield every 10 attempts to prevent blocking
        if (currentPosition.attempt % 10 === 0) {
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
      }
    } finally {
      currentPosition.isGenerating = false;
    }
  }

  async function generateNext(): Promise<void> {
    await tryGenerateSchedule(true);
  }

  async function generatePrevious(): Promise<void> {
    await tryGenerateSchedule(false);
  }

  const canGeneratePrevious = createMemo(() => currentPosition.attempt > 0);

  return {
    generateNext,
    generatePrevious,
    canGeneratePrevious,
    isGenerating: () => currentPosition.isGenerating,
  };
}
