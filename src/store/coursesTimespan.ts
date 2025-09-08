import { mapValues } from "es-toolkit";
import { VALIDITY } from "~/components/homepage/utils";
import { LECTURE_TYPE } from "~/enums/enums";
import type { Course } from "~/store/store.types";

export class CoursesTimespan {
  constructor(private readonly courses: Course[]) {
    return this;
  }

  public getCoursesTimeSpan(): Record<string, { validity: VALIDITY; courseData: Record<LECTURE_TYPE, number> }> {
    return Object.fromEntries(this.courses.map((course) => [course.detail.id, this.getCourseTimeSpan(course)]));
  }

  private getCheckedTimeSpan = (course: Course): Record<LECTURE_TYPE, number> => {
    const courseData = course.data.reduce(
      (acc, event) => {
        if (event.checked) {
          acc[event.type] = (acc[event.type] || 0) + event.timeSpan.hours;
        }
        return acc;
      },
      mapValues(LECTURE_TYPE, () => 0)
    );

    return courseData;
  };

  private getCurseValidity = (course: Course, courseData: Record<LECTURE_TYPE, number>): VALIDITY => {
    const metricsEntries = Object.entries(course.metrics);
    const allTypesMatch = metricsEntries.every(([type, { weeklyLectures }]) => {
      const lectureType = type as LECTURE_TYPE;
      return (courseData[lectureType] || 0) === weeklyLectures;
    });

    if (!allTypesMatch) return VALIDITY.INVALID;

    // when hours match, check that the set of types matches the course detail timeSpan keys
    const metricTypes = new Set(metricsEntries.map(([type]) => type as LECTURE_TYPE));
    const detailTypes = new Set(Object.keys(course.detail.timeSpan || {}) as LECTURE_TYPE[]);

    const sameKeySets = metricTypes.size === detailTypes.size && [...metricTypes].every((t) => detailTypes.has(t));

    const validity = sameKeySets ? VALIDITY.VALID : VALIDITY.PARTIAL;
    return validity;
  };

  private getCourseTimeSpan = (course: Course) => {
    const courseData = this.getCheckedTimeSpan(course);
    const validity = this.getCurseValidity(course, courseData);

    return { validity, courseData };
  };
}
