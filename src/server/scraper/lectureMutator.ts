import { createHash } from "crypto";
import { cloneDeep, flow, isEqual, isString, union, uniq } from "es-toolkit/compat";
import type { StrictOmit } from "ts-essentials";
import { conjunctableRooms } from "~/config/rooms";
import { days } from "~/config/scheduler";
import type { Time, TimeSpan } from "~/lib/time/time";
import { halfSemesterWeeks } from "~/server/scraper/constants";
import { lecturesWithoutExam, WEEK_PARITY, type DAY } from "~/server/scraper/enums";
import type { StudyApiTypes } from "~/server/scraper/types/api.types";
import type { CourseDetail, Lecture } from "~/server/scraper/types/course.types";
import { conjunctConjunctableRooms, getLectureLectures, getWeekFromSemesterStart } from "~/server/scraper/utils";

export namespace LectureMutator {
  export interface Props extends StudyApiTypes.getStudyCoursesDetailsReturn {}
  export type Return = MutatedCourse[];

  export interface LectureWithId extends Lecture {
    id: string;
    lecturesCount: number | false;
  }
  export interface CourseWithId {
    detail: CourseDetail;
    data: (Lecture & LectureWithId)[];
  }

  export type FilteredCourseLecture = ReturnType<typeof filterValidLectures>[number];

  export interface ConjunctedLecture extends StrictOmit<FilteredCourseLecture, "room"> {
    room: string;
  }

  export interface LinkedLectureData {
    id: string;
    day: DAY;
  }

  export interface LinkedLecture extends ConjunctedLecture {
    strongLinked: LinkedLectureData[];
    linked: LinkedLectureData[];
  }

  export interface MutatedLecture extends LinkedLecture {}
  export interface MutatedCourse {
    detail: CourseDetail;
    data: MutatedLecture[];
  }
}

/**
 * Creates a stable, deterministic ID for a lecture based on its core properties
 * and the course it belongs to. This is the recommended approach.
 *
 * It correctly handles complex nested objects and ignores mutable metadata
 * like `calculated` to ensure the ID is stable.
 *
 * @param courseId The unique identifier for the course this lecture belongs to.
 * @param lecture The lecture object from the API.
 * @returns A SHA-256 hash representing the unique ID for this lecture instance.
 */
const createDeterministicLectureId = (courseId: string | number, lecture: Lecture): string => {
  // 1. Create a canonical representation of the complex `weeks` object.
  // This is a crucial step to handle its structure correctly.
  const canonicalWeeks = {
    // If weeks is an array, sort it to ensure order doesn't matter.
    // Otherwise, use the string value as-is.
    weeks: Array.isArray(lecture.weeks.weeks)
      ? [...lecture.weeks.weeks].sort((a, b) => a - b) // Sort numbers numerically
      : lecture.weeks.weeks,
    parity: lecture.weeks.parity,
    // CRITICAL: We explicitly OMIT the `calculated` property. It's mutable
    // metadata, not part of the lecture's identity. Including it would
    // break determinism.
  };

  // 2. Select all properties that uniquely identify this lecture instance.
  // This now includes the `courseId`.
  const identifyingProperties = {
    courseId, // The context of the course is essential for uniqueness.
    day: lecture.day,
    type: lecture.type,
    timeSpan: lecture.timeSpan,
    groups: lecture.groups,
    weeks: canonicalWeeks, // Use our clean, canonical version.
    lectureGroup: [...lecture.lectureGroup].sort(), // Sort arrays for consistency.
  };

  // 3. Stringify the canonical object. Sorting the keys ensures a consistent
  //    string output regardless of how the object was constructed.
  const lectureString = JSON.stringify(identifyingProperties);

  // 4. Hash the string to create a short, unique, and fixed-length ID.
  return createHash("sha256").update(lectureString).digest("hex");
};

// If you must use the original function name:
const idLecture = createDeterministicLectureId;

const isSameTimeLecture = (
  lecture1: { day: DAY; timeSpan: TimeSpan },
  lecture2: { day: DAY; timeSpan: TimeSpan }
): boolean => {
  const isSameTime = (time1: Time, time2: Time) => time1.hour === time2.hour && time1.minute === time2.minute;
  return (
    lecture1.day === lecture2.day &&
    isSameTime(lecture1.timeSpan.start, lecture2.timeSpan.start) &&
    isSameTime(lecture1.timeSpan.end, lecture2.timeSpan.end)
  );
};

const isAfterLecture = (
  lecture1: { day: DAY; timeSpan: TimeSpan },
  lecture2: { day: DAY; timeSpan: TimeSpan }
): boolean => {
  return lecture2.timeSpan.start.minutes > lecture1.timeSpan.end.minutes;
};

const isStronglyLinkable = (
  lecture: LectureMutator.ConjunctedLecture,
  otherLecture: LectureMutator.ConjunctedLecture,
  semesterWeeks: number
): boolean => {
  if (lecture.type !== otherLecture.type) return false;
  if (isString(lecture.weeks.weeks) || isString(otherLecture.weeks.weeks)) return false;
  if (!lecture.lecturesCount || !otherLecture.lecturesCount) return false;
  const combinedLecturesCount =
    (lecture.lecturesCount * otherLecture.lecturesCount) / (lecture.lecturesCount + otherLecture.lecturesCount);
  return Math.round(combinedLecturesCount) === semesterWeeks;
};

const getLinkedData = (lectures: LectureMutator.ConjunctedLecture[]): LectureMutator.LinkedLectureData[] => {
  return lectures.map((lecture) => ({ id: lecture.id, day: lecture.day }));
};

// --- CORE TRANSFORMATION FUNCTIONS (Pure) ---

/**
 * Attaches a unique ID and lecture count to each lecture in a course.
 */
const addLectureIds = (lectures: Lecture[], courseDetail: CourseDetail): LectureMutator.LectureWithId[] =>
  lectures.map(
    (lecture) =>
      ({
        ...lecture,
        id: idLecture(courseDetail.id, lecture),
        lecturesCount: getLectureLectures(lecture, courseDetail)!,
      }) satisfies LectureMutator.CourseWithId["data"][number]
  );

/**
 * Filters out lectures that are not relevant for scheduling.
 */
const filterValidLectures = (data: LectureMutator.LectureWithId[]) => {
  const isValid = (lecture: LectureMutator.LectureWithId) =>
    lecturesWithoutExam.includes(lecture.type) && !lecture.note && days.includes(lecture.day) && lecture.lecturesCount;

  // The type assertion is complex but necessary to narrow down the types after filtering.
  return data.filter(isValid) as {
    [K in keyof LectureMutator.LectureWithId]: K extends "type"
      ? (typeof lecturesWithoutExam)[number]
      : K extends "note"
        ? null
        : K extends "day"
          ? DAY
          : K extends "lecturesCount"
            ? number
            : LectureMutator.LectureWithId[K];
  }[];
};

/**
 * Fills in the specific week numbers for lectures that only have a parity (ODD/EVEN).
 */
export const fillMissingWeeks =
  (semesterWeeks: number) =>
  (data: LectureMutator.FilteredCourseLecture[]): LectureMutator.FilteredCourseLecture[] => {
    return data.map((lecture) => {
      if (Array.isArray(lecture.weeks.weeks) || !lecture.lecturesCount) return lecture;

      const newLecture = cloneDeep(lecture); // Use cloneDeep to avoid mutation
      const maxParityLectures = Math.floor(semesterWeeks / 2);
      if (lecture.lecturesCount < maxParityLectures) return newLecture;

      switch (lecture.weeks.parity) {
        case WEEK_PARITY.EVEN:
          newLecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => 2 * (i + 1) + 1);
          newLecture.weeks.calculated = true;
          break;
        case WEEK_PARITY.ODD:
          newLecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => 2 * (i + 1));
          newLecture.weeks.calculated = true;
          break;
        default:
          if (lecture.lecturesCount === semesterWeeks) {
            newLecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => i + 1);
            newLecture.weeks.calculated = true;
          }
      }
      return newLecture;
    });
  };

/**
 * Merges a group of conjunctable lectures into a single lecture object.
 */
const mergeConjunctedLectures = (
  lecturesToMerge: LectureMutator.FilteredCourseLecture[]
): LectureMutator.ConjunctedLecture => {
  if (lecturesToMerge.length === 1) {
    const singleLecture = lecturesToMerge[0];
    return {
      ...singleLecture,
      room: conjunctConjunctableRooms(uniq(singleLecture.room)),
    };
  }

  const mainLecture =
    lecturesToMerge.find((lecture) =>
      lecture.room.some((room) =>
        conjunctableRooms.some((conj) => (Array.isArray(conj) ? conj.includes(room) : conj.main === room))
      )
    ) ?? lecturesToMerge[0];

  const allWeeks = uniq(
    lecturesToMerge.flatMap((lect) => (Array.isArray(lect.weeks.weeks) ? lect.weeks.weeks : [])).sort((a, b) => a - b)
  );

  return {
    ...mainLecture, // Base properties from main or first lecture
    id: mainLecture.id, // Ensure the ID of the "main" lecture is kept
    info: uniq(lecturesToMerge.map((lect) => lect.info)).join(", "),
    room: conjunctConjunctableRooms(uniq(lecturesToMerge.flatMap((lect) => lect.room))),
    weeks: {
      parity: lecturesToMerge.every((lect) => lect.weeks.parity === mainLecture.weeks.parity)
        ? mainLecture.weeks.parity
        : null,
      weeks: allWeeks,
    },
    capacity: lecturesToMerge.every((lect) => lect.capacity === mainLecture.capacity)
      ? mainLecture.capacity
      : lecturesToMerge.map((lect) => lect.capacity).join(", "),
  };
};

/**
 * Finds and merges lectures that occur at the same time and can be "conjuncted" into one.
 * This is a pure implementation of the original's complex, stateful logic.
 */
export const conjunctParallelLectures = (
  data: LectureMutator.FilteredCourseLecture[]
): LectureMutator.ConjunctedLecture[] => {
  const result: LectureMutator.ConjunctedLecture[] = [];
  const consumedIndices = new Set<number>();

  for (let i = 0; i < data.length; i++) {
    if (consumedIndices.has(i)) continue;

    const lecture = data[i];
    const lecturesToMerge = [lecture];
    const indicesToConsume = [i];
    let tentativeWeeks = Array.isArray(lecture.weeks.weeks) ? [...lecture.weeks.weeks] : null;

    for (let j = i + 1; j < data.length; j++) {
      const comparedLecture = data[j];

      // Check for conjunctability
      if (lecture.day !== comparedLecture.day) continue;
      if (isAfterLecture(lecture, comparedLecture)) continue;
      if (!isSameTimeLecture(lecture, comparedLecture)) continue;
      if (lecture.type !== comparedLecture.type) continue;
      if (lecture.groups !== comparedLecture.groups) continue;
      if (!isEqual(lecture.lectureGroup, comparedLecture.lectureGroup)) continue;
      if (isString(tentativeWeeks) || isString(comparedLecture.weeks.weeks)) continue;

      const combinedWeeks = union(tentativeWeeks ?? [], comparedLecture.weeks.weeks).sort((a, b) => a - b);
      if (lecture.groups === "xx" && combinedWeeks.length > lecture.lecturesCount + 1 && combinedWeeks.length < 10)
        continue;

      if (
        lecture.lecturesCount <= halfSemesterWeeks &&
        lecture.weeks.parity &&
        comparedLecture.weeks.parity &&
        lecture.weeks.parity !== comparedLecture.weeks.parity
      )
        continue;

      // If compatible, add to the group for this iteration
      lecturesToMerge.push(comparedLecture);
      indicesToConsume.push(j);
      tentativeWeeks = combinedWeeks;
    }

    result.push(mergeConjunctedLectures(lecturesToMerge));

    for (const idx of indicesToConsume) consumedIndices.add(idx);
  }

  return result;
};

/**
 * Links lectures that belong to the same group but occur at different times.
 */
const linkRelatedLectures =
  (semesterWeeks: number) =>
  (data: LectureMutator.ConjunctedLecture[]): LectureMutator.LinkedLecture[] => {
    return data.map((lecture) => {
      const strongLinked: LectureMutator.ConjunctedLecture[] = [];
      const linked: LectureMutator.ConjunctedLecture[] = [];

      if (/\d/.test(lecture.groups)) {
        for (const otherLecture of data) {
          if (lecture.id === otherLecture.id) continue;
          if (isSameTimeLecture(lecture, otherLecture)) continue;
          if (otherLecture.groups !== lecture.groups) continue;
          if (!isEqual(otherLecture.lectureGroup, lecture.lectureGroup)) continue;

          if (isStronglyLinkable(lecture, otherLecture, semesterWeeks)) {
            strongLinked.push(otherLecture);
          } else {
            linked.push(otherLecture);
          }
        }
      }

      return {
        ...lecture,
        strongLinked: getLinkedData(strongLinked),
        linked: getLinkedData(linked),
      };
    });
  };

const modifyData =
  <D, DR, T>(modifier: (data: D[], detail: T) => DR[]) =>
  <O extends { data: D[]; detail: T }>(obj: O) => ({
    ...obj,
    data: modifier(obj.data, obj.detail),
  });

/**
 * Main orchestrator that processes raw course data through a functional pipeline.
 */
export async function MutateLectureData(props: LectureMutator.Props): Promise<LectureMutator.Return> {
  const { data, semesterTimeSchedule } = props;
  const semesterWeeks = getWeekFromSemesterStart(semesterTimeSchedule.end, semesterTimeSchedule.start);

  // Define the processing pipeline for a single course
  const processCourse = flow(
    modifyData(addLectureIds),
    modifyData(filterValidLectures),
    modifyData(fillMissingWeeks(semesterWeeks)),
    modifyData(conjunctParallelLectures),
    modifyData(linkRelatedLectures(semesterWeeks))
  );

  // Apply the pipeline to each course
  return data.map(processCourse);
}
