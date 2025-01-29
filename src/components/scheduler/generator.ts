import { uniqBy } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { batch, createMemo } from "solid-js";
import { createMutable } from "solid-js/store";
import { toast } from "solid-sonner";
import { isCustomEventData } from "~/components/scheduler/event/Event";
import type { Event, ScheduleEvent, ScheduleEventData } from "~/components/scheduler/event/types";
import { hasOverlap, type TimeSpan } from "~/components/scheduler/time";
import type { Course } from "~/components/scheduler/types";
import { useI18n } from "~/i18n";
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
  if (timespan.start.hours < RATING_WEIGHTS.IDEAL_START_HOUR) {
    return ((RATING_WEIGHTS.IDEAL_START_HOUR - timespan.start.hour) * (24 - RATING_WEIGHTS.TIME_PENALTY_EARLY)) / 24;
  }
  // Gradually decrease score as the day progresses after IDEAL_START_HOUR
  return (timespan.end.hours - RATING_WEIGHTS.IDEAL_START_HOUR) / (24 - RATING_WEIGHTS.IDEAL_START_HOUR);
}

function getPerturbation(event: ScheduleEvent, attempt: number): number {
  if (attempt === 0) return 0;
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

export function SchedulerGenerator() {
  const { store } = useScheduler();
  const { t } = useI18n();
  const currentPosition = createMutable({
    attempt: -1,
    isGenerating: false,
  });

  const storeDayData = createMemo(() => Object.values(store.data));

  // precalculate type counts,... using solid primitives
  // in the form: `<courseId>-<eventType>`
  const courseTypeCounts = createMemo(() => {
    const counts = new Map<string, number>();
    for (const day of storeDayData()) {
      for (const dayEvent of day.events) {
        const event = dayEvent.eventData;
        if (isCustomEventData(event)) continue;
        const courseDetailId = event.courseDetail.id;
        const key = `${courseDetailId}-${event.event.type}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return counts;
  });

  const selectedCustomEvents = createMemo(() => store.customEvents.filter((e) => e.checked));

  // events sorted based on their score
  const orderedEvents = createMemo(() => {
    return storeDayData()
      .flatMap((day) => day.events)
      .filter((dayEvent) => !isCustomEventData(dayEvent.eventData))
      .map((dayEvent) => {
        const eventData = dayEvent.eventData as ScheduleEventData;
        return {
          eventData,
          score: rateEvent(eventData, currentPosition.attempt),
        };
      })
      .sort((a, b) => a.score - b.score);
  });

  const getEmptyCompletedHours = () => ObjectTyped.fromEntries(store.courses.map((c) => [c.detail.id, {}]));

  function hasTimeOverlap(event: ScheduleEvent, events: Iterable<Event>): boolean {
    const eventSpan = event.timeSpan;
    for (const selected of [...events, ...selectedCustomEvents()]) {
      if (selected.id !== event.id && selected.day === event.day && hasOverlap(selected.timeSpan, eventSpan)) {
        return true;
      }
    }
    return false;
  }

  function rateEvent(eventData: ScheduleEventData, attempt = 0): number {
    const { courseDetail, event } = eventData;
    const typeCount = courseTypeCounts().get(`${courseDetail.id}-${event.type}`) || 0;
    const Pr = 1 - 1 / (typeCount + 1);
    const Tr = getTimePreferencePenalty(event.timeSpan);
    const perturbation = getPerturbation(event, attempt);

    return Pr + Tr + perturbation;
  }

  async function generateSchedule(courses: Course[], attempt: number): Promise<ScheduleResult | null> {
    console.log(`Generating schedule for attempt ${attempt}`);

    const state: ScheduleResult = {
      selectedEvents: new Map<string, Event>(selectedCustomEvents().map((e) => [e.id, e])),
      completedHours: getEmptyCompletedHours(),
    };

    let processedCount = 0;
    for (const { eventData } of orderedEvents()) {
      const { event, courseDetail, metrics } = eventData;
      // Yield every 100 iterations to prevent blocking
      if (++processedCount % 100 === 0) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      if (hasTimeOverlap(event, state.selectedEvents.values())) continue;

      const type = event.type;
      const courseId = courseDetail.id;
      const requiredHours = metrics.weeklyLectures;
      const completedHours = state.completedHours[courseId][type] || 0;

      // if does not fit, skip
      if (completedHours + event.timeSpan.hours > requiredHours) continue;

      const allLinkedEvents = uniqBy([...event.strongLinked, ...event.linked], (e) => e.id);

      let canAddAllLinks = true;
      const linkedEventDataMap = new Map<string, ScheduleEventData>();

      const addLinked = (map: Map<string, ScheduleEventData>) => {
        for (const linkedLectureData of allLinkedEvents) {
          const linkedEventData = store.getEventData(linkedLectureData) as ScheduleEventData | undefined;
          if (!linkedEventData) {
            canAddAllLinks = false;
            break;
          }
          const le = linkedEventData.event;
          if (hasTimeOverlap(le, state.selectedEvents.values())) {
            canAddAllLinks = false;
            break;
          }

          const linkedType = le.type;
          const linkedCourseId = linkedEventData.courseDetail.id;
          const linkedRequiredHours = linkedEventData.metrics.weeklyLectures;
          const linkedCompletedHours = state.completedHours[linkedCourseId][linkedType] || 0;

          if (linkedCompletedHours + le.timeSpan.hours > linkedRequiredHours) {
            canAddAllLinks = false;
            break;
          }
          map.set(le.id, linkedEventData);
        }
      };

      addLinked(linkedEventDataMap);

      if (canAddAllLinks) {
        state.selectedEvents.set(event.id, event);
        state.completedHours[courseId][type] = completedHours + event.timeSpan.hours;

        for (const linkedEventData of allLinkedEvents) {
          const linkedEvent = linkedEventDataMap.get(linkedEventData.id)!;
          state.selectedEvents.set(linkedEvent.event.id, linkedEvent.event);
          state.completedHours[linkedEvent.courseDetail.id][linkedEvent.event.type] =
            (state.completedHours[linkedEvent.courseDetail.id][linkedEvent.event.type] || 0) +
            linkedEvent.event.timeSpan.hours;
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
      for (const dayData of storeDayData()) {
        for (const e of dayData.events) {
          e.eventData.event.checked = result.selectedEvents.has(e.eventData.event.id);
        }
      }
    });
  }

  async function tryGenerateSchedule(forward: boolean): Promise<void> {
    if (currentPosition.isGenerating) return;

    currentPosition.isGenerating = true;
    const maxAttempts = 10000;
    const maxRepeatedAttempts = 50;
    let repeatedAttempts = 0;
    let success = false;

    try {
      const generateForDirection = async (condition: () => boolean, updateAttempt: () => void): Promise<void> => {
        while (condition() && repeatedAttempts < maxRepeatedAttempts) {
          updateAttempt();
          repeatedAttempts++;

          const result = await generateSchedule(store.courses, currentPosition.attempt);
          if (result) {
            applyScheduleToStore(result);
            success = true;
            break;
          }

          // Yield every 10 attempts to prevent blocking
          if (currentPosition.attempt % 10 === 0) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
          }
        }
      };

      switch (forward) {
        case true:
          await generateForDirection(
            () => currentPosition.attempt < maxAttempts,
            () => currentPosition.attempt++
          );
          break;
        case false:
          await generateForDirection(canGeneratePrevious, () => currentPosition.attempt--);
          break;
      }

      if (!success) {
        toast.error(t("menu.actions.generate.couldNotGenerate"));
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
