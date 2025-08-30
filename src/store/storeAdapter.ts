import type { CustomEvent } from "~/components/scheduler/event/types";
import type { SchedulerStore } from "~/store/store";
import { createStoreAdapter } from "~/utils/store/adapter";

export const adaptSchedulerStore = (store: SchedulerStore) => {
  return createStoreAdapter(store, (store) => ({
    clearCourses: () => (store.newCourses = []),
    addCustomEvent: (event: CustomEvent) => {
      store.customEvents.push(event);
    },
    removeCustomEvent: (eventId: string) => {
      store.customEvents = store.customEvents.filter((e) => e.id !== eventId);
    },
  }));
};

export type AdaptedSchedulerStore = ReturnType<typeof adaptSchedulerStore>;
