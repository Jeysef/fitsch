import type { SchedulerStore } from "~/store/store";

// Defines the structure of the store data when it's serialized (plain object without methods)
export type PlainStore = Pick<SchedulerStore, "courses" | "customEvents">;
