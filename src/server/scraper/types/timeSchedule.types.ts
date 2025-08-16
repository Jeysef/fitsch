import type { SEMESTER } from "~/server/scraper/enums";

export type SemesterTimeSchedule = { start: Date; end: Date };

export type SemestersTimeSchedule = Record<SEMESTER, SemesterTimeSchedule>;
