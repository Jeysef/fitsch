import { mergeProps } from "solid-js";
import type { ScheduleEvent } from "~/components/scheduler/event/types";
import { LECTURE_TYPE } from "~/enums/enums";
import { Time } from "~/lib/time/time";
import type { LectureMutator } from "~/server/scraper/lectureMutator";
import type { Course, CourseMetrics } from "~/store/store.types";

export function createNewCourse(
  courseData: LectureMutator.MutatedCourse
  // filter?: (event: LectureMutator.MutatedLecture) => boolean
): Course {
  const detail = courseData.detail;
  const metrics = getEmptyMetrics();

  const data = courseData.data.map((lecture, _, lectures) => {
    calculateMetrics(lecture, lectures, metrics);
    const additionalData = { courseId: detail.id, title: detail.abbreviation, row: 1, checked: false };
    return mergeProps(lecture, additionalData) satisfies ScheduleEvent;
  });

  return {
    detail,
    data,
    metrics,
  };
}

function getEmptyMetrics(): CourseMetrics {
  // return mapValues(LECTURE_TYPE, () => ({ weeks: 0, weeklyLectures: 0 }));
  return {} as CourseMetrics; // better storage-wise
}

function getMetric(type: LECTURE_TYPE, metrics: CourseMetrics) {
  return metrics[type] ?? (metrics[type] = { weeks: 0, weeklyLectures: 0 });
}

function calculateMetrics(
  lecture: LectureMutator.MutatedLecture,
  lectures: LectureMutator.MutatedLecture[],
  metrics: CourseMetrics
) {
  const type = lecture.type;
  const metric = getMetric(type, metrics);

  /**
   * Calculates the time of current and strongly linked lectures.
   */
  const linkedDuration = lecture.strongLinked.reduce((acc, linked) => {
    const linkedLecture = lectures.find((l) => l.id === linked.id);
    if (!linkedLecture) return acc;
    const timeSpan = linkedLecture.timeSpan;
    return acc + timeSpan.minutes;
  }, lecture.timeSpan.minutes);

  metric.weeklyLectures = Math.max(metric.weeklyLectures, Time.fromMinutes(linkedDuration).hours);
  metric.weeks = Math.max(metric.weeks, lecture.weeks.weeks.length);
}

export function reconcileCourses(course: Course, courseData: LectureMutator.MutatedCourse) {
  const detail = courseData.detail;
  if (course.detail.url !== course.detail.url) {
    course.detail = detail;
  }

  const metrics = course.metrics;
  const data = courseData.data.map((lecture, _, lectures) => {
    calculateMetrics(lecture, lectures, metrics);
    const existingLectures = course.data.filter((l) => isSameLecture(lecture, l));
    const existingLecture = existingLectures.length === 1 ? existingLectures.at(0) : undefined;
    const additionalData = {
      row: 1,
      courseId: detail.id,
      title: detail.abbreviation,
      checked: existingLecture?.checked ?? false,
      hidden: existingLecture?.hidden ?? undefined,
      collapsed: existingLecture?.collapsed ?? undefined,
    };
    return mergeProps(lecture, additionalData) satisfies ScheduleEvent;
  });

  return {
    detail,
    data,
    metrics,
  };
}

const isSameLecture = (lecture1: LectureMutator.MutatedLecture, lecture2: LectureMutator.MutatedLecture): boolean => {
  const isSameTime = (time1: Time, time2: Time) => time1.hour === time2.hour && time1.minute === time2.minute;
  return (
    lecture1.day === lecture2.day &&
    lecture1.type === lecture2.type &&
    lecture1.weeks.parity === lecture2.weeks.parity &&
    isSameTime(lecture1.timeSpan.start, lecture2.timeSpan.start) &&
    isSameTime(lecture1.timeSpan.end, lecture2.timeSpan.end)
  );
};
