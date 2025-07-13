import { uniqBy } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { batch, createMemo } from "solid-js";
import { createMutable } from "solid-js/store";
import { toast } from "solid-sonner";
import { isCustomEvent, isCustomEventData } from "~/components/scheduler/event/Event";
import type { Event, EventData, ScheduleEvent, ScheduleEventData } from "~/components/scheduler/event/types";
import { hasOverlap } from "~/components/scheduler/time";
import type { Course } from "~/components/scheduler/types";
import { useI18n } from "~/i18n";
import { useScheduler } from "~/providers/SchedulerProvider";
import type { LECTURE_TYPE } from "~/server/scraper/enums";

// --- Configuration Constants ---
const RATING_WEIGHTS = {
  IDEAL_START_HOUR: 9,
  IDEAL_END_HOUR: 17,
  TIME_PENALTY_EARLY: 4,
  OVERLAP_PREFERENCE_WEIGHT: 0.25,
} as const;

const GENERATOR_CONFIG = {
  MAX_ATTEMPTS: 10000,
  MAX_REPEATED_ATTEMPTS: 50, // Max attempts in one go (next/prev) before showing a toast
  YIELD_INTERVAL: 100, // Yield to the main thread every N events processed
} as const;

// --- Pure Helper Functions ---

function hashCode(str: string): number {
  let hash = 0;
  for (const char of str) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return hash;
}

function getPerturbation(event: ScheduleEvent, attempt: number): number {
  if (attempt === 0) return 0;
  const seed = hashCode(`${event.id}_${attempt}`);
  const random = (Math.sin(seed) + 1) / 2;
  return (random - 0.5) * 1.0; // Range [-0.5, 0.5]
}

function isAllowedOverlap(eventA: Event, eventB: Event): boolean {
  if (isCustomEvent(eventA) || isCustomEvent(eventB)) return false;
  const { parity: parityA } = eventA.weeks;
  const { parity: parityB } = eventB.weeks;
  return !!(parityA && parityB && parityA !== parityB);
}

/**
 * Encapsulates the state and logic for a single schedule generation attempt.
 * This class is temporary and created for each run.
 */
class SchedulerEngine {
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

export function SchedulerGenerator() {
  const { store } = useScheduler();
  const { t } = useI18n();
  const currentPosition = createMutable({
    attempt: -1,
    isGenerating: false,
  });

  // --- Reactive Data Preparation (using createMemo for caching) ---

  const filterEvent = (eventData: EventData): eventData is ScheduleEventData =>
    !isCustomEventData(eventData) && eventData.event.hidden !== true;

  const validScheduleEventData = createMemo(() =>
    Object.values(store.data).flatMap(({ events }) => events.map((dayEvent) => dayEvent.eventData).filter(filterEvent))
  );

  const courseTypeCounts = createMemo(() => {
    const counts = new Map<string, number>();
    for (const eventData of validScheduleEventData()) {
      const key = `${eventData.courseDetail.id}-${eventData.event.type}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  });

  const eventOverlapBonuses = createMemo(() => {
    const bonuses = new Map<string, number>();
    const allEvents = validScheduleEventData().map((d) => d.event);
    for (const eventA of allEvents) {
      let potentialOverlaps = 0;
      for (const eventB of allEvents) {
        if (
          eventA.id !== eventB.id &&
          eventA.day === eventB.day &&
          hasOverlap(eventA.timeSpan, eventB.timeSpan) &&
          isAllowedOverlap(eventA, eventB)
        ) {
          potentialOverlaps++;
        }
      }
      if (potentialOverlaps > 0) {
        bonuses.set(eventA.id, -RATING_WEIGHTS.OVERLAP_PREFERENCE_WEIGHT * potentialOverlaps);
      }
    }
    return bonuses;
  });

  const baseEventScores = createMemo(() => {
    const counts = courseTypeCounts();
    const bonuses = eventOverlapBonuses();
    return validScheduleEventData().map((eventData) => {
      const { courseDetail, event } = eventData;
      const typeCount = counts.get(`${courseDetail.id}-${event.type}`) || 1;
      const Pr = 1 - 1 / (typeCount + 1);
      const Tr =
        (event.timeSpan.start.hours < RATING_WEIGHTS.IDEAL_START_HOUR
          ? (RATING_WEIGHTS.IDEAL_START_HOUR - event.timeSpan.start.hour) * (24 - RATING_WEIGHTS.TIME_PENALTY_EARLY)
          : event.timeSpan.end.hours - RATING_WEIGHTS.IDEAL_START_HOUR) /
          (24 - RATING_WEIGHTS.IDEAL_START_HOUR) || 0;
      const bonus = bonuses.get(event.id) || 0;
      return { eventData, baseScore: Pr + Tr + bonus };
    });
  });

  const selectedCustomEvents = createMemo(() => store.customEvents.filter((e) => e.checked));

  // --- Core Generation Logic ---

  /**
   * For a given event, finds all linked events and checks if the entire group can be placed in the schedule.
   * This is a pure function; it does not modify the engine.
   */
  function findViableLinkedGroup(
    primaryEventData: ScheduleEventData,
    engine: SchedulerEngine
  ): { success: boolean; eventsToAdd: ScheduleEventData[] } {
    const { event } = primaryEventData;
    const allLinkedIds = uniqBy([...event.strongLinked, ...event.linked], (e) => e.id);
    if (allLinkedIds.length === 0) {
      return { success: true, eventsToAdd: [primaryEventData] };
    }

    const eventsToAdd: ScheduleEventData[] = [primaryEventData];
    for (const linkedId of allLinkedIds) {
      // Don't re-check the primary event if it's somehow in its own linked list
      if (linkedId.id === event.id) continue;

      const linkedEventData = store.getEventData(linkedId) as ScheduleEventData | undefined;

      if (!linkedEventData || !filterEvent(linkedEventData) || !engine.canPlacePrimaryEvent(linkedEventData)) {
        return { success: false, eventsToAdd: [] };
      }
      eventsToAdd.push(linkedEventData);
    }
    return { success: true, eventsToAdd };
  }

  async function generateSchedule(attempt: number): Promise<Map<string, Event> | null> {
    const engine = new SchedulerEngine(store.courses, selectedCustomEvents());

    // PERF: Add perturbation and sort. This is much faster than re-calculating all scores.
    const eventsToTry = baseEventScores()
      .map(({ eventData, baseScore }) => ({
        eventData,
        score: baseScore + getPerturbation(eventData.event, attempt),
      }))
      .sort((a, b) => a.score - b.score);

    for (let i = 0; i < eventsToTry.length; i++) {
      if (i > 0 && i % GENERATOR_CONFIG.YIELD_INTERVAL === 0) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      const { eventData } = eventsToTry[i];
      if (engine.isEventSelected(eventData.event.id)) continue;
      if (!engine.canPlacePrimaryEvent(eventData)) continue;

      const linkedGroup = findViableLinkedGroup(eventData, engine);
      if (linkedGroup.success) {
        engine.addEventGroup(linkedGroup.eventsToAdd);
        if (engine.isComplete()) {
          return engine.selectedEvents;
        }
      }
    }

    engine.logMissingHours();
    return null;
  }

  // --- UI Interaction and Control Flow ---

  function applyScheduleToStore(selectedEvents: Map<string, Event>) {
    batch(() => {
      for (const dayData of Object.values(store.data)) {
        for (const e of dayData.events) {
          e.eventData.event.checked = selectedEvents.has(e.eventData.event.id);
        }
      }
    });
  }

  async function tryGenerateSchedule(forward: boolean): Promise<void> {
    if (currentPosition.isGenerating) return;
    currentPosition.isGenerating = true;

    try {
      let success = false;
      for (let i = 0; i < GENERATOR_CONFIG.MAX_REPEATED_ATTEMPTS; i++) {
        if (forward) {
          if (currentPosition.attempt >= GENERATOR_CONFIG.MAX_ATTEMPTS) break;
          currentPosition.attempt++;
        } else {
          if (currentPosition.attempt <= 0) break;
          currentPosition.attempt--;
        }

        const result = await generateSchedule(currentPosition.attempt);
        if (result) {
          applyScheduleToStore(result);
          success = true;
          break;
        }
      }

      if (!success) {
        toast.error(t("menu.actions.generate.couldNotGenerate"));
      }
    } finally {
      currentPosition.isGenerating = false;
    }
  }

  const canGeneratePrevious = createMemo(() => currentPosition.attempt > 0);

  return {
    generateNext: () => tryGenerateSchedule(true),
    generatePrevious: () => tryGenerateSchedule(false),
    canGeneratePrevious,
    isGenerating: () => currentPosition.isGenerating,
  };
}
