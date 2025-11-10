import { createContext } from "solid-js";
import type { PlainStore } from "~/providers/schedule/schedule-types";
import type { SchedulerStore } from "~/store/store";
import type { AdaptedSchedulerStore } from "~/store/storeAdapter";

interface ScheduleContextType {
  store: AdaptedSchedulerStore;
  recreateStore: (plainStore: Partial<PlainStore>) => void;
  serialize: (store: SchedulerStore) => string;
}

export const ScheduleContext = createContext<ScheduleContextType>();
