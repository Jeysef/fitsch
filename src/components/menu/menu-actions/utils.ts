import type { Accessor } from "solid-js";
import type { LANGUAGE } from "~/enums";
import type { SchedulerStore } from "~/store/store";

export function getFileName({ store, locale }: { store: SchedulerStore; locale: Accessor<LANGUAGE> }) {
  return `schedule-${store.courses.map((c) => c.detail.abbreviation).join(",")}-${new Date().toLocaleDateString(locale())}`;
}
