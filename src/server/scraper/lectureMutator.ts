import { flow, isEqual, isString, union, uniq, cloneDeep } from "lodash-es";
import type { StrictOmit } from "ts-essentials";
import { v4 as uuidv4 } from "uuid";
import type { Time, TimeSpan } from "~/components/scheduler/time";
import { conjunctableRooms } from "~/config/rooms";
import { days } from "~/config/scheduler";
import { halfSemesterWeeks } from "~/server/scraper/constants";
import { lecturesWithoutExam, WEEK_PARITY, type DAY } from "~/server/scraper/enums";
import type { APICourseLecture, CourseDetail, DataProviderTypes, StudyApiTypes } from "~/server/scraper/types";
import { conjunctConjunctableRooms, getLectureLectures, getWeekFromSemesterStart } from "~/server/scraper/utils";

// --- TYPE DEFINITIONS (Unchanged) ---
interface IDdCourseLectureBase {
  id: string;
  lecturesCount: number | false;
}
interface IDdCourseLecture extends IDdCourseLectureBase, APICourseLecture {}
interface IdCourseReturn extends DataProviderTypes.getStudyCourseDetailsReturn {
  data: IDdCourseLecture[];
}
export type FilteredCourseLecture = ReturnType<typeof filterValidLectures>[number];
export interface LectureMutatorConfig {
  fillWeeks?: boolean;
}
export interface LinkedLectureData {
  id: string;
  day: DAY;
}
interface ConjunctedLecture extends StrictOmit<FilteredCourseLecture, "room"> {
  room: string;
}
interface linkedLecture extends ConjunctedLecture {
  strongLinked: LinkedLectureData[];
  linked: LinkedLectureData[];
}
export interface MCourseLecture extends linkedLecture {}
export type MgetStudyCourseDetailsReturnStale = {
  isStale: true;
  detail: { id: string };
};
export type MgetStudyCourseDetailsReturnNotStale = {
  isStale: undefined;
  detail: CourseDetail;
  data: MCourseLecture[];
};
export type MgetStudyCourseDetailsReturn = MgetStudyCourseDetailsReturnStale | MgetStudyCourseDetailsReturnNotStale;

// --- PURE HELPER FUNCTIONS ---

const idLecture = (_lecture: APICourseLecture): string => uuidv4();

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
  lecture: ConjunctedLecture,
  otherLecture: ConjunctedLecture,
  semesterWeeks: number
): boolean => {
  if (lecture.type !== otherLecture.type) return false;
  if (isString(lecture.weeks.weeks) || isString(otherLecture.weeks.weeks)) return false;
  if (!lecture.lecturesCount || !otherLecture.lecturesCount) return false;
  const combinedLecturesCount =
    (lecture.lecturesCount * otherLecture.lecturesCount) / (lecture.lecturesCount + otherLecture.lecturesCount);
  return Math.round(combinedLecturesCount) === semesterWeeks;
};

const getLinkedData = (lectures: ConjunctedLecture[]): LinkedLectureData[] => {
  return lectures.map((lecture) => ({ id: lecture.id, day: lecture.day }));
};

// --- CORE TRANSFORMATION FUNCTIONS (Pure) ---

/**
 * Attaches a unique ID and lecture count to each lecture in a course.
 */
const addLectureIds = (course: DataProviderTypes.getStudyCourseDetailsReturn): IdCourseReturn => ({
  ...course,
  data: course.data.map(
    (lecture) =>
      ({
        ...lecture,
        id: idLecture(lecture),
        lecturesCount: getLectureLectures(lecture, course.detail)!,
      }) satisfies IDdCourseLecture
  ),
});

/**
 * Filters out lectures that are not relevant for scheduling.
 */
const filterValidLectures = (data: IDdCourseLecture[]) => {
  const isValid = (lecture: IDdCourseLecture) =>
    lecturesWithoutExam.includes(lecture.type) && !lecture.note && days.includes(lecture.day) && lecture.lecturesCount;

  // The type assertion is complex but necessary to narrow down the types after filtering.
  return data.filter(isValid) as {
    [K in keyof IDdCourseLecture]: K extends "type"
      ? (typeof lecturesWithoutExam)[number]
      : K extends "note"
        ? null
        : K extends "day"
          ? DAY
          : K extends "lecturesCount"
            ? number
            : IDdCourseLecture[K];
  }[];
};

/**
 * Fills in the specific week numbers for lectures that only have a parity (ODD/EVEN).
 */
const fillMissingWeeks =
  (semesterWeeks: number, fillWeeksEnabled?: boolean) =>
  (data: FilteredCourseLecture[]): FilteredCourseLecture[] => {
    if (fillWeeksEnabled === false) return data;

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
const mergeConjunctedLectures = (lecturesToMerge: FilteredCourseLecture[]): ConjunctedLecture => {
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
const conjunctParallelLectures = (data: FilteredCourseLecture[]): ConjunctedLecture[] => {
  const result: ConjunctedLecture[] = [];
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
      if (lecture.groups === "xx" && combinedWeeks.length > lecture.lecturesCount + 1) continue;

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
  (data: ConjunctedLecture[]): linkedLecture[] => {
    return data.map((lecture) => {
      const strongLinked: ConjunctedLecture[] = [];
      const linked: ConjunctedLecture[] = [];

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

/**
 * Main orchestrator that processes raw course data through a functional pipeline.
 */
export async function MutateLectureData(
  props: StudyApiTypes.getStudyCoursesDetailsReturn,
  config: LectureMutatorConfig
): Promise<MgetStudyCourseDetailsReturn[]> {
  const { data, semesterTimeSchedule } = props;
  const semesterWeeks = getWeekFromSemesterStart(semesterTimeSchedule.end, semesterTimeSchedule.start);

  // Define the processing pipeline for a single course
  const processCourse = flow(
    addLectureIds,
    (course: IdCourseReturn) => ({
      ...course,
      data: filterValidLectures(course.data),
    }),
    (course) => ({
      ...course,
      data: fillMissingWeeks(semesterWeeks, config.fillWeeks)(course.data),
    }),
    (course) => ({
      ...course,
      data: conjunctParallelLectures(course.data),
    }),
    (course) => ({
      ...course,
      data: linkRelatedLectures(semesterWeeks)(course.data),
    }),
    // Final transformation to match the output type
    (course): MgetStudyCourseDetailsReturnNotStale => ({
      isStale: undefined,
      detail: course.detail,
      data: course.data satisfies MCourseLecture[], // Final data conforms to MCourseLecture
    })
  );

  // Apply the pipeline to each course
  return data.map(processCourse);
}
