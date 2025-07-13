export const tabs = {
  workSchedule: "workSchedule",
  resultSchedule: "resultSchedule",
  timeSpan: "timeSpan",
} as const;

export type TabValues = (typeof tabs)[keyof typeof tabs];
export type Tab = { tab: TabValues };