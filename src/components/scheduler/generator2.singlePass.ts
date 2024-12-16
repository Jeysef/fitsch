import { chain, cloneDeep, uniqBy } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { batch } from "solid-js";
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
  IDEAL_START_HOUR: 8,
  IDEAL_END_HOUR: 17,
  TIME_PENALTY_EARLY: 2.0,
  TIME_PENALTY_LATE: 1.5,

  // Vicinity preferences
  MAX_DESIRED_GAP: 2,
  LONE_EVENT_PENALTY: 0.7,
  GAP_PENALTY: 0.5,
  MAX_HOURS_IN_ROW: 4,
  IDEAL_HOURS_A_DAY: 6,
} as const;

const FEISTEL_ROUNDS = 4;
const FEISTEL_KEY = 0x1234567890; // Can be any 32-bit number

interface GeneratorPosition {
  attempt: number;
  direction: "forward" | "backward";
}

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

function getTimePreferenceScore(timespan: TimeSpan): number {
  if (timespan.start.hour < RATING_WEIGHTS.IDEAL_START_HOUR) {
    return 1 - ((RATING_WEIGHTS.IDEAL_START_HOUR - timespan.start.hour) * RATING_WEIGHTS.TIME_PENALTY_EARLY) / 24;
  }
  // Gradually decrease score as the day progresses after IDEAL_START_HOUR
  if (timespan.start.hour >= RATING_WEIGHTS.IDEAL_START_HOUR) {
    return 1 - (timespan.start.hour - RATING_WEIGHTS.IDEAL_START_HOUR) * 0.1;
  }
  return 1.0;
}

export default function SchedulerGenerator() {
  const { store } = useScheduler();
  let currentPosition: SchedulerPosition = { attempt: -1 };

  function hasTimeOverlap(event: Event, state: ScheduleResult): boolean {
    const eventSpan = event.timeSpan;
    for (const selected of state.selectedEvents.values()) {
      if (selected.id !== event.id && selected.day === event.day && store.hasOverlap(selected.timeSpan, eventSpan)) {
        return true;
      }
    }
    return false;
  }

  function rateEvent(event: Event, state?: ScheduleResult): number {
    function getPriorityScore(event: Event): number {
      // check store.data for count of events with event.type type
      const eventTypesCount = Object.values(store.data)
        .flatMap((day) => day.events)
        .filter((e) => e.event.courseDetail.id === event.courseDetail.id && e.event.type === event.type).length;
      console.log(`Event: ${event.courseDetail.abbreviation} ${event.type} count: ${eventTypesCount}`);
      return 1 / eventTypesCount;
    }
    function getTimeScore(event: Event): number {
      return getTimePreferenceScore(event.timeSpan);
    }
    function getVicinityScore(event: Event): number {
      // the more events are in a day except event time, the better
      const dayEvents: Event[] = state
        ? state.selectedEvents
            .values()
            .filter((e) => e.day === event.day)
            .toArray()
        : store.data[event.day].events.flatMap((e) => e.event);

      const dayEventsCount = dayEvents.length;
      const dayEventsHours = dayEvents.reduce((acc, e) => acc + e.timeSpan.hours, 0);
      const selectedInDayScore = state
        ? dayEventsHours <= RATING_WEIGHTS.IDEAL_HOURS_A_DAY
          ? dayEventsHours / RATING_WEIGHTS.IDEAL_HOURS_A_DAY
          : 1 - (dayEventsHours - RATING_WEIGHTS.IDEAL_HOURS_A_DAY) / RATING_WEIGHTS.IDEAL_HOURS_A_DAY
        : dayEventsCount * RATING_WEIGHTS.LONE_EVENT_PENALTY;
      return selectedInDayScore;
    }

    // Logs ----------------
    batch(() => {
      const Pr = getPriorityScore(event);
      const Tr = getTimeScore(event);
      const Vr = getVicinityScore(event);
      // @ts-ignore
      event.Pr = Math.round(Pr * 100) / 100;
      // @ts-ignore
      event.Tr = Math.round(Tr * 100) / 100;
      // @ts-ignore
      event.Vr = Math.round(Vr * 100) / 100;
    });
    // Logs ----------------

    const eventRating = getPriorityScore(event) + getTimeScore(event) + getVicinityScore(event);
    // event.rating = Math.round(eventRating * 100) / 100;
    return eventRating;
  }

  // rerate considering linked events
  function rerateEvent(rating: number, event: Event, collection: { event: Event; score: number }[]): number {
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

  function generateSchedule(courses: CourseData[], attempt: number): ScheduleResult | null {
    console.log(`Generating schedule for attempt ${attempt}`);

    const events = Object.values(store.data).flatMap((day) => day.events);
    const orderedEvents = chain(events)
      .map((e) => ({ event: e.event, score: rateEvent(e.event) }))
      .map(({ event, score }, _, collection) => ({
        event,
        score: rerateEvent(score, event, collection),
      }))
      .sortBy("score")
      .value();

    // Use Feistel network for deterministic shuffling
    const shuffledEvents = orderedEvents
      .map((e, idx) => ({
        event: e.event,
        position: feistelNetwork((attempt * orderedEvents.length + idx) >>> 0),
      }))
      .sort((a, b) => a.position - b.position)
      .map((e) => e.event);

    const state: ScheduleResult = {
      selectedEvents: new Map<string, Event>(),
      completedHours: ObjectTyped.fromEntries(courses.map((c) => [c.detail.id, {}])),
    };

    for (const event of shuffledEvents) {
      if (hasTimeOverlap(event, state)) continue;

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

      const hoursCopy = cloneDeep(state.completedHours);
      // expect candidate to be added
      hoursCopy[event.courseDetail.id][type] = completedHours + event.timeSpan.hours;

      const canAddAllLinks = allLinkedEvents.every(({ event }) => {
        if (hasTimeOverlap(event, state)) return false;

        const eventType = event.type;
        const eventCourseId = event.courseDetail.id;
        const currentHours = hoursCopy[eventCourseId][eventType] || 0;
        const additionalHours = event.timeSpan.hours;
        const courseRequiredHours = event.metrics.weeklyLectures;

        hoursCopy[eventCourseId][eventType] = currentHours + additionalHours;
        return hoursCopy[eventCourseId][eventType] <= courseRequiredHours;
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
    const allCoursesComplete = courses.every((course) =>
      ObjectTyped.entries(state.completedHours[course.detail.id]).every(([type, hours]) => {
        const requiredHours = course.metrics[type as LECTURE_TYPE].weeklyLectures;
        return hours === requiredHours;
      })
    );
    if (allCoursesComplete) {
      console.log("All courses have required hours");
      applyScheduleToStore(state, courses);
      return state;
    }

    return null;
  }

  function applyScheduleToStore(result: ScheduleResult, courses: CourseData[]) {
    // Clear all selections
    for (const course of store.courses) {
      for (const dayData of Object.values(course.data)) {
        for (const event of dayData.events) {
          event.event.checked = false;
        }
      }
    }

    // Apply new selections
    for (const course of courses) {
      for (const dayData of Object.values(course.data)) {
        for (const event of dayData.events) {
          event.event.checked = result.selectedEvents.has(event.event.id);
        }
      }
    }
  }

  function generateNext(): ScheduleResult | null {
    currentPosition.attempt++;
    return generateSchedule(store.courses, currentPosition.attempt);
  }

  function generatePrevious(): ScheduleResult | null {
    if (currentPosition.attempt <= 0) return null;
    currentPosition.attempt--;
    return generateSchedule(store.courses, currentPosition.attempt);
  }

  return {
    generateNext,
    generatePrevious,
  };
}
