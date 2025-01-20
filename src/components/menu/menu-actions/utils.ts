import type { Accessor } from "solid-js";
import type { SchedulerStore } from "~/components/scheduler/store";
import type { LANGUAGE } from "~/enums";

export function getFileName({ store, locale }: { store: SchedulerStore; locale: Accessor<LANGUAGE> }) {
  return `schedule-${store.courses.map((c) => c.detail.abbreviation).join(",")}-${new Date().toLocaleDateString(locale())}`;
}
