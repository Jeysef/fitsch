import { isCustomEvent } from "~/components/scheduler/event/Event";
import type { Event, ScheduleEvent } from "~/components/scheduler/event/types";

export function hashCode(str: string): number {
  let hash = 0;
  for (const char of str) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return hash;
}

export function getPerturbation(event: ScheduleEvent, attempt: number): number {
  if (attempt === 0) return 0;
  const seed = hashCode(`${event.id}_${attempt}`);
  const random = (Math.sin(seed) + 1) / 2;
  return (random - 0.5) * 1.0; // Range [-0.5, 0.5]
}

export function isAllowedOverlap(eventA: Event, eventB: Event): boolean {
  if (isCustomEvent(eventA) || isCustomEvent(eventB)) return false;
  const { parity: parityA } = eventA.weeks;
  const { parity: parityB } = eventB.weeks;
  return !!(parityA && parityB && parityA !== parityB);
}
