import type { SEMESTER } from "~/server/scraper/enums";
import type { CourseOverview } from "~/server/scraper/types/course.types";

export type SemesterCourses = Record<SEMESTER, CourseOverview[]>;
