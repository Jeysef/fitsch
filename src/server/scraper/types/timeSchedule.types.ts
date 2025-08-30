import type { SEMESTER } from "~/enums/enums";

export type SemesterTimeSchedule = { start: Date; end: Date };

export type SemestersTimeSchedule = Record<SEMESTER, SemesterTimeSchedule>;
