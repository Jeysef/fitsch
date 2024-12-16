import { chain, cloneDeep, uniqBy } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { batch, createMemo } from "solid-js";
import { createMutable } from "solid-js/store";
import type { TimeSpan } from "~/components/scheduler/time";
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

const FEISTEL_ROUNDS = 4;
const FEISTEL_KEY = 0x1234567890; // Can be any 32-bit number

function feistelRound(left: number, right: number, round: number): [number, number] {
  const roundKey = FEISTEL_KEY ^ round;
  const newRight = left;
  // Simple mixing function using XOR and rotation
  const f = ((left * roundKey) >>> 0) ^ (left << (round % 16));
  const newLeft = right ^ f;
  return [newLeft >>> 0, newRight >>> 0];
}

function feistelNetwork(value: number, reverse = false): number {
  let left = value >>> 16;
  let right = value & 0xffff;

  const rounds = reverse
    ? Array.from({ length: FEISTEL_ROUNDS }, (_, i) => FEISTEL_ROUNDS - 1 - i)
    : Array.from({ length: FEISTEL_ROUNDS }, (_, i) => i);

  for (const round of rounds) {
    [left, right] = feistelRound(left, right, round);
  }

  return ((left << 16) | right) >>> 0;
}

/**
 * Value is a number between 0 and 1
 * 0 is the best time, 1 is the worst
 */
function getTimePreferenceScore(timespan: TimeSpan): number {
  if (timespan.start.hour < RATING_WEIGHTS.IDEAL_START_HOUR) {
    return ((RATING_WEIGHTS.IDEAL_START_HOUR - timespan.start.hour) * RATING_WEIGHTS.TIME_PENALTY_EARLY) / 24;
  }
  // Gradually decrease score as the day progresses after IDEAL_START_HOUR
  return (timespan.end.hour - RATING_WEIGHTS.IDEAL_START_HOUR) / (24 - RATING_WEIGHTS.IDEAL_START_HOUR);
}

export default function SchedulerGenerator() {
  const { store } = useScheduler();
  const currentPosition: SchedulerPosition = createMutable({ attempt: -1 });

  function getTypeCounts(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const day of Object.values(store.data)) {
      for (const { event } of day.events) {
        const key = `${event.courseDetail.id}-${event.type}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return counts;
  }

  function hasTimeOverlap(event: Event, events: Iterable<Event>): boolean {
    const eventSpan = event.timeSpan;
    for (const selected of events) {
      if (selected.id !== event.id && selected.day === event.day && store.hasOverlap(selected.timeSpan, eventSpan)) {
        return true;
      }
    }
    return false;
  }

  function rateEvent(event: Event, typeCounts: Map<string, number>, state?: ScheduleResult): number {
    const typeCount = typeCounts.get(`${event.courseDetail.id}-${event.type}`) || 0;
    const Pr = 1 - 1 / (typeCount + 1);
    const Tr = getTimePreferenceScore(event.timeSpan);
    const Vr = state ? getVicinityScore(event, state) : 0;

    // Logs
    batch(() => {
      // @ts-ignore
      event.Pr = Math.round(Pr * 100) / 100;
      // @ts-ignore
      event.Tr = Math.round(Tr * 100) / 100;
      // @ts-ignore
      event.Vr = Math.round(Vr * 100) / 100;
    });

    return Pr + Tr + Vr;
  }

  function getVicinityScore(event: Event, state: ScheduleResult): number {
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
    const Tr = getTimePreferenceScore(event.timeSpan);
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

    const events = Object.values(store.data).flatMap((day) => day.events);
    const typeCounts = getTypeCounts();

    const orderedEvents = chain(events.map((e) => e.event))
      .map((e) => ({
        event: e,
        score: rateEvent(e, typeCounts),
      }))
      .map(({ event, score }, index, collection) => ({
        event,
        score: rerateEvent(score, event, index, collection as { event: Event; score: number }[], typeCounts),
      }))
      .sortBy("score")
      .value();

    console.log("🚀 ~ file: generator2.singlePass.ts:171 ~ generateSchedule ~ orderedEvents:", orderedEvents);
    // Use Feistel network for deterministic shuffling
    const shuffledEvents = orderedEvents
      .map((e, idx) => ({
        event: e.event,
        // position: feistelNetwork((attempt * orderedEvents.length + idx) >>> 0),
      }))
      // .sort((a, b) => a.position - b.position)
      .map((e) => e.event);

    const state: ScheduleResult = {
      selectedEvents: new Map<string, Event>(),
      completedHours: ObjectTyped.fromEntries(courses.map((c) => [c.detail.id, {}])),
    };

    for (const event of shuffledEvents) {
      if (hasTimeOverlap(event, state.selectedEvents.values())) continue;

      // check if event can be added to schedule
      const type = event.type;
      const requiredHours = event.metrics.weeklyLectures;
      const completedHours = state.completedHours[event.courseDetail.id][type] || 0;

      console.log(`\nEvent: ${event.id} ${event.courseDetail.abbreviation} ${type}`);
      console.log(`- Required: ${requiredHours} hours`);
      console.log(`- Completed: ${completedHours} hours`);

      if (completedHours === requiredHours) {
        console.log(`✓ Required hours met for ${type}`);
        continue;
      }
      if (completedHours > requiredHours) {
        console.error(`✗ Completed hours exceed required for ${type}`);
        continue;
      }
      if (completedHours + event.timeSpan.hours > requiredHours) {
        console.log(`✗ Adding event exceeds required hours for ${type}`);
        continue;
      }

      const allLinkedEvents = uniqBy([...event.strongLinked, ...event.linked], (e) => e.id)
        .map((link) => store.data[link.day].events.find((e) => e.event.id === link.id))
        .filter((e) => e && !state.selectedEvents.has(e.event.id)) as DayEvent[];

      const completedHoursCopy = cloneDeep(state.completedHours);
      // const completedHoursCopy = { ...state.completedHours };
      // expect candidate to be added
      completedHoursCopy[event.courseDetail.id][type] = completedHours + event.timeSpan.hours;

      const canAddAllLinks = allLinkedEvents.every(({ event }) => {
        if (hasTimeOverlap(event, state.selectedEvents.values())) return false;

        const eventType = event.type;
        const eventCourseId = event.courseDetail.id;
        const currentHours = completedHoursCopy[eventCourseId][eventType] || 0;
        const additionalHours = event.timeSpan.hours;
        const courseRequiredHours = event.metrics.weeklyLectures;

        completedHoursCopy[eventCourseId][eventType] = currentHours + additionalHours;
        return completedHoursCopy[eventCourseId][eventType] <= courseRequiredHours;
      });

      if (canAddAllLinks) {
        state.selectedEvents.set(event.id, event);
        state.completedHours[event.courseDetail.id][type] = completedHours + event.timeSpan.hours;
        console.log(`✓ Added ${event.id}`);

        for (const { event } of allLinkedEvents) {
          state.selectedEvents.set(event.id, event);
          const linkedType = event.type;
          const linkedCourseId = event.courseDetail.id;
          state.completedHours[linkedCourseId][linkedType] =
            (state.completedHours[linkedCourseId][linkedType] || 0) + event.timeSpan.hours;
          console.log(`✓ Added linked ${linkedType}: ${event.id}`);
        }
      }
    }

    // check if all courses have required hours
    const allCoursesComplete = courses.every((course) => {
      const courseHours = state.completedHours[course.detail.id];
      return ObjectTyped.entries(course.metrics).every(([type, requiredHours]) => {
        const completedHours = courseHours[type] || 0;
        return completedHours === requiredHours.weeklyLectures;
      });
    });
    if (allCoursesComplete) {
      console.log("All courses have required hours");
      return state;
    }
    console.warn("Not all courses have required hours");
    return null;
  }

  function applyScheduleToStore(result: ScheduleResult) {
    batch(() => {
      // Clear and apply all selections
      for (const e of Object.values(store.data).flatMap((day) => day.events)) {
        // Apply new selections
        e.event.checked = result.selectedEvents.has(e.event.id);
      }
    });
  }

  function generateNext(): void {
    currentPosition.attempt++;
    const result = generateSchedule(store.courses, currentPosition.attempt);
    if (result) {
      applyScheduleToStore(result);
    }
  }

  function generatePrevious(): void {
    if (currentPosition.attempt <= 0) return;
    currentPosition.attempt--;
    const result = generateSchedule(store.courses, currentPosition.attempt);
    if (result) {
      applyScheduleToStore(result);
    }
  }

  const canGeneratePrevious = createMemo(() => currentPosition.attempt > 0);

  return {
    generateNext,
    generatePrevious,
    canGeneratePrevious,
  };
}
