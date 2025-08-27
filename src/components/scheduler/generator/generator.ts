import { uniqBy } from "es-toolkit/compat";
import { batch, createMemo } from "solid-js";
import { createMutable } from "solid-js/store";
import { toast } from "solid-sonner";
import { isCustomEvent } from "~/components/scheduler/event/Event";
import type { Event, ScheduleEvent } from "~/components/scheduler/event/types";
import { SchedulerEngine } from "~/components/scheduler/generator/engine";
import { getPerturbation, isAllowedOverlap } from "~/components/scheduler/generator/utils";
import { useI18n } from "~/i18n";
import { hasOverlap } from "~/lib/time/time";
import { useScheduler } from "~/providers/SchedulerProvider";

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

export function SchedulerGenerator() {
  const { store } = useScheduler();
  const { t } = useI18n();
  const currentPosition = createMutable({
    attempt: -1,
    isGenerating: false,
  });

  // --- Reactive Data Preparation (using createMemo for caching) ---

  const filterEvent = (event: Event): event is ScheduleEvent => !isCustomEvent(event) && event.hidden !== true;

  const validScheduleEventData = createMemo(() =>
    Object.values(store.data).flatMap(({ events }) => events.map((dayEvent) => dayEvent.event).filter(filterEvent))
  );

  const courseTypeCounts = createMemo(() => {
    const counts = new Map<string, number>();
    for (const event of validScheduleEventData()) {
      const key = `${event.courseId}-${event.type}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  });

  const eventOverlapBonuses = createMemo(() => {
    const bonuses = new Map<string, number>();
    const allEvents = validScheduleEventData();
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
    return validScheduleEventData().map((event) => {
      const typeCount = counts.get(`${event.courseId}-${event.type}`) || 1;
      const Pr = 1 - 1 / (typeCount + 1);
      const Tr =
        (event.timeSpan.start.hours < RATING_WEIGHTS.IDEAL_START_HOUR
          ? (RATING_WEIGHTS.IDEAL_START_HOUR - event.timeSpan.start.hour) * (24 - RATING_WEIGHTS.TIME_PENALTY_EARLY)
          : event.timeSpan.end.hours - RATING_WEIGHTS.IDEAL_START_HOUR) /
          (24 - RATING_WEIGHTS.IDEAL_START_HOUR) || 0;
      const bonus = bonuses.get(event.id) || 0;
      return { event, baseScore: Pr + Tr + bonus };
    });
  });

  const selectedCustomEvents = createMemo(() => store.customEvents.filter((e) => e.checked));

  // --- Core Generation Logic ---

  /**
   * For a given event, finds all linked events and checks if the entire group can be placed in the schedule.
   * This function does not modify the engine.
   */
  function findViableLinkedGroup(
    primaryEvent: ScheduleEvent,
    engine: SchedulerEngine
  ): { success: boolean; eventsToAdd: ScheduleEvent[] } {
    const allLinkedIds = uniqBy([...primaryEvent.strongLinked, ...primaryEvent.linked], (e) => e.id);
    if (allLinkedIds.length === 0) {
      return { success: true, eventsToAdd: [primaryEvent] };
    }

    const eventsToAdd: ScheduleEvent[] = [primaryEvent];
    for (const linkedId of allLinkedIds) {
      // Don't re-check the primary event if it's somehow in its own linked list
      if (linkedId.id === primaryEvent.id) continue;

      const linkedEventData = store.getLinkedEvent(linkedId, primaryEvent.courseId);

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
      .map(({ event, baseScore }) => ({
        event,
        score: baseScore + getPerturbation(event, attempt),
      }))
      .sort((a, b) => a.score - b.score);

    for (let i = 0; i < eventsToTry.length; i++) {
      if (i > 0 && i % GENERATOR_CONFIG.YIELD_INTERVAL === 0) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      const { event } = eventsToTry[i];
      if (engine.isEventSelected(event.id)) continue; // Skip linked selected events
      if (!engine.canPlacePrimaryEvent(event)) continue;

      const linkedGroup = findViableLinkedGroup(event, engine);
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
        for (const dayEvent of dayData.events) {
          dayEvent.event.checked = selectedEvents.has(dayEvent.event.id);
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
