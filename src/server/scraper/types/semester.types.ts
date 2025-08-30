import type { SEMESTER } from "~/enums/enums";
import type { CourseOverview } from "~/server/scraper/types/course.types";

export type SemesterCourses = Record<SEMESTER, CourseOverview[]>;
