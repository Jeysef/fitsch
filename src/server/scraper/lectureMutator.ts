import deepEqual from "deep-equal";
import { isEqual, isString, union } from "lodash-es";
import uniq from "lodash-es/uniq";
import { ObjectTyped } from "object-typed";
import { v4 as uuidv4 } from "uuid";
import type { Time, TimeSpan } from "~/components/scheduler/time";
import { conjunctableRooms } from "~/config/rooms";
import { days } from "~/config/scheduler";
import { LECTURE_TYPE, WEEK_PARITY, type DAY } from "~/server/scraper/enums";
import type {
  APICourseLecture,
  CourseDetail,
  CourseLecture,
  DataProviderTypes,
  StudyApiTypes,
} from "~/server/scraper/types";
import { conjunctConjunctableRooms, getWeekFromSemesterStart } from "~/server/scraper/utils";

interface IDdCourseLectureBase {
  id: string;
  /** required number of lectures througout the semester */
  lecturesCount: number | false;
}

interface IDdCourseLecture extends IDdCourseLectureBase, APICourseLecture {}

type FilteredCourseLecture = ReturnType<typeof filterData>[number];

export interface LectureMutatorConfig {
  fillWeeks?: boolean;
}

export interface LinkedLectureData {
  id: string;
  day: DAY;
}

export interface MCourseLecture extends IDdCourseLectureBase, CourseLecture {
  strongLinked: LinkedLectureData[];
  linked: LinkedLectureData[];
}

export interface MgetStudyCourseDetailsReturn {
  detail: CourseDetail;
  data: MCourseLecture[];
}

export async function MutateLectureData(props: StudyApiTypes.getStudyCoursesDetailsReturn, config: LectureMutatorConfig) {
  const { data, semesterTimeSchedule } = props;
  const semesterWeeks = getWeekFromSemesterStart(semesterTimeSchedule.end, semesterTimeSchedule.start);
  for (const _course of data) {
    const course = idCourse(_course);
    const data = filterData(course.data);
    for (let [i, lecture] of data.entries()) {
      if (config.fillWeeks !== false) {
        lecture = fillWeeksLecture(lecture, semesterWeeks);
      }

      if (i === data.length - 1) break;

      const nextLectures = data.slice(i + 1);
      conjunctLectures(lecture, nextLectures, i, data);
    }
    for (const lecture of data) {
      // @ts-expect-error the type will be changed elsewhere
      if (!isString(lecture.room)) lecture.room = conjunctConjunctableRooms(lecture.room);
      linkLectrues(lecture, data, semesterWeeks);
    }
    course.data = data;
    // log weeks of each lecture
    // for (const lecture of course.data) {
    //   // console.log(lecture.weeks);
    //   console.log({
    //     weeks: lecture.weeks,
    //     room: lecture.room,
    //     day: lecture.day,
    //     type: lecture.type,
    //   });
    // }
  }
  return data as unknown as MgetStudyCourseDetailsReturn[];
}

function idCourse(course: DataProviderTypes.getStudyCourseDetailsReturn) {
  const newData = course.data.map((lecture) => {
    return Object.assign(lecture, {
      id: idLecture(lecture),
      lecturesCount: getLectureLectures(lecture, course.detail),
    }) as IDdCourseLecture;
  });
  return Object.assign(course, { data: newData });
}

// TODO: implement
function idLecture(lecture: APICourseLecture) {
  return uuidv4();
}

/**
 * This function calculates the number of lectures that should be in the semester based on the length of given lecture
 * Problem n.1: In a week there may be more lectures with different lengths -> solved by concatenating the lectures elsewhere
 * Problem n.2: the calculation doesn't have to reflect what's written in the detail. Viz README.md
 */
function getLectureLectures(lecture: APICourseLecture, detail: CourseDetail) {
  const lectureTimeSpan = detail.timeSpan[lecture.type];
  if (lectureTimeSpan === undefined) return false;
  const duration = lecture.timeSpan.minutes;
  // round up to nearest hour, 7:00 - 7:50 => 50 minutes => 1 hour

  // ---- when assuming lecture duration is in atleast 60 minute intervals
  const lectureDuration = Math.ceil(duration / 60);
  const lectureLectures = Math.round(lectureTimeSpan / lectureDuration);

  // ---- when assuming lecture duration in minutes -- WRONG
  // const lectureLectures = Math.floor(lectureTimeSpan * 60 / duration)
  return lectureLectures;
}

function filterData(data: IDdCourseLecture[]) {
  return data.filter((lecture) => {
    if (lecture.type === "EXAM") return false;
    if (lecture.note) return false;
    if (!days.includes(lecture.day)) return false;
    if (!LECTURE_TYPE[lecture.type]) return false;
    if (!lecture.lecturesCount) return false;
    return true;
  }) as {
    [K in keyof IDdCourseLecture]: K extends "type"
      ? Exclude<IDdCourseLecture[K], "EXAM">
      : K extends "note"
        ? never
        : K extends "day"
          ? (typeof days)[number]
          : K extends "lecturesCount"
            ? number
            : IDdCourseLecture[K];
  }[];
}

function fillWeeksLecture(lecture: FilteredCourseLecture, semesterWeeks: number) {
  if (Array.isArray(lecture.weeks.weeks)) return lecture;
  const maxParityLectures = Math.floor(semesterWeeks / 2); // => 6
  if (lecture.lecturesCount < maxParityLectures) return lecture;
  switch (lecture.weeks.parity) {
    case WEEK_PARITY.EVEN:
      lecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => 2 * (i + 1) + 1);
      lecture.weeks.calculated = true;
      break;
    case WEEK_PARITY.ODD:
      lecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => 2 * (i + 1));
      lecture.weeks.calculated = true;
      break;
    default:
      // does not have parity nor weeks
      if (lecture.lecturesCount === semesterWeeks) {
        lecture.weeks.weeks = Array.from({ length: lecture.lecturesCount }, (_, i) => i + 1);
        lecture.weeks.calculated = true;
      }
  }
  return lecture;
}

function conjunctLectures(
  lecture: FilteredCourseLecture,
  lectures: FilteredCourseLecture[],
  index: number,
  data: FilteredCourseLecture[]
) {
  const preConjunctedLectures = { [index]: lecture };
  for (const [shift, comparedLecture] of lectures.entries()) {
    function conjunct() {
      preConjunctedLectures[index + shift + 1] = comparedLecture;
    }
    // if the day is different, lectures cannot be conjuncted.
    if (lecture.day !== comparedLecture.day) break;
    if (lecture.type !== comparedLecture.type) continue;
    if (!isSameTimeLecture(lecture, comparedLecture)) continue;
    // if (!isConjunctable(lecture.room, comparedLecture.room) && !isEqual(lecture.room, comparedLecture.room)) continue;
    if (lecture.groups !== comparedLecture.groups) continue;
    if (!isEqual(lecture.lectureGroup, comparedLecture.lectureGroup)) continue;
    if (isString(lecture.weeks.weeks) !== isString(comparedLecture.weeks.weeks)) {
      // If there are lectures with same group but one has weeks and one hasn't it probabbly is same lecture in different rooms
      if (lecture.groups === comparedLecture.groups && lecture.groups !== "xx" && lecture.room !== comparedLecture.room) {
        conjunct();
      }
      continue;
    }
    if (isString(lecture.weeks.weeks) || isString(comparedLecture.weeks.weeks)) continue;

    if (
      // ref: README-> Notes > Timespans. Plus one should not matter in terms of splitting odd/even lectures, but helps with the conjuncting
      union(lecture.weeks.weeks, comparedLecture.weeks.weeks).length > lecture.lecturesCount + 1 &&
      // even if the lecture exceeds the semester weeks, it should be conjuncted if groups id defined
      lecture.groups === "xx"
    )
      continue;

    conjunct();
  }
  const preConjunctedLecturesValues = Object.values(preConjunctedLectures);
  const hasEveryLectureSameRoom = preConjunctedLecturesValues.every((l) => deepEqual(l.room, lecture.room));
  const mainEvent = hasEveryLectureSameRoom
    ? lecture
    : (preConjunctedLecturesValues.find((lecture) =>
        lecture.room.some((room) =>
          conjunctableRooms.some((conjunctable) =>
            Array.isArray(conjunctable) ? conjunctable.includes(room) : conjunctable.main === room
          )
        )
      ) ?? preConjunctedLecturesValues[0]);
  if (mainEvent && preConjunctedLecturesValues.length > 1) {
    const lect = lecture as unknown as MCourseLecture;
    lect.room = conjunctConjunctableRooms(uniq(preConjunctedLecturesValues.flatMap((lect) => lect.room)));
    lect.info = preConjunctedLecturesValues.map((lect) => lect.info).join(", ");
    lect.note = preConjunctedLecturesValues
      .map((lect) => lect.note)
      .filter(Boolean)
      .join(", ");
    const conjunctedWeeks = uniq(
      preConjunctedLecturesValues.flatMap((lect) => lect.weeks.weeks as number[]).sort((a, b) => a - b)
    );
    lect.weeks = {
      parity: preConjunctedLecturesValues.every((lect) => lect.weeks.parity === mainEvent.weeks.parity)
        ? mainEvent.weeks.parity
        : null,
      weeks: conjunctedWeeks,
    };
    // // if capacity is same, keep it, if not, join them
    lect.capacity = preConjunctedLecturesValues.every((lect) => lect.capacity === mainEvent.capacity)
      ? mainEvent.capacity
      : preConjunctedLecturesValues.map((lect) => lect.capacity).join(", ");

    for (const i of ObjectTyped.keys(preConjunctedLectures).slice(1).reverse()) {
      data.splice(i, 1);
    }
  }
}

function isSameTimeLecture(lecture1: { day: DAY; timeSpan: TimeSpan }, lecture2: { day: DAY; timeSpan: TimeSpan }) {
  const isSameTime = (time1: Time, time2: Time) => time1.hour === time2.hour && time1.minute === time2.minute;
  return (
    lecture1.day === lecture2.day &&
    isSameTime(lecture1.timeSpan.start, lecture2.timeSpan.start) &&
    isSameTime(lecture1.timeSpan.end, lecture2.timeSpan.end)
  );
}

function linkLectrues(lecture: FilteredCourseLecture, data: FilteredCourseLecture[], semesterWeeks: number) {
  const convertToMCourseLecture = (lecture: FilteredCourseLecture): MCourseLecture => {
    // @ts-expect-error the rooms will be changed elsewhere
    return Object.assign(lecture, { strongLinked: [], linked: [] });
  };
  const isStrongLinkedLecture = (lecture: MCourseLecture, otherLecture: MCourseLecture) => {
    if (lecture.type !== otherLecture.type) return false;
    if (typeof lecture.weeks.weeks === "string" || typeof otherLecture.weeks.weeks === "string") return false;
    if (!lecture.lecturesCount || !otherLecture.lecturesCount) return false;
    const combinedLecturesCount =
      (lecture.lecturesCount * otherLecture.lecturesCount) / (lecture.lecturesCount + otherLecture.lecturesCount);
    return Math.round(combinedLecturesCount) === semesterWeeks;
  };
  const getLinkedData = (lectures: MCourseLecture[]) => {
    return lectures.map((lecture) => ({ id: lecture.id, day: lecture.day }));
  };
  const linkThrough = (lecture: MCourseLecture, linked: MCourseLecture[]) => {
    const linkedIds = getLinkedData(linked);
    lecture.linked = lecture.linked ?? [];
    for (const linkedId of linkedIds) {
      if (!lecture.linked.some((linked) => linked.id === linkedId.id)) {
        lecture.linked.push(linkedId);
      }
    }
    for (const linkedLecture of linked) {
      linkedLecture.linked = [{ id: lecture.id, day: lecture.day }];
      linkedLecture.linked.push(...getLinkedData(linked.filter((linkedId) => linkedId.id !== linkedLecture.id)));
    }
  };
  const strongLinkThrough = (lecture: MCourseLecture, linked: MCourseLecture[]) => {
    const linkedIds = getLinkedData(linked);
    lecture.strongLinked = lecture.strongLinked ?? [];
    lecture.strongLinked = lecture.strongLinked ?? [];
    for (const linkedId of linkedIds) {
      if (!lecture.strongLinked.some((linked) => linked.id === linkedId.id)) {
        lecture.strongLinked.push(linkedId);
      }
    }
    for (const linkedLecture of linked) {
      linkedLecture.strongLinked = [{ id: lecture.id, day: lecture.day }];
      linkedLecture.strongLinked.push(...getLinkedData(linked.filter((linkedId) => linkedId.id !== linkedLecture.id)));
    }
  };

  const lect = convertToMCourseLecture(lecture);
  if (!/\d/.test(lecture.groups)) return;
  const strongLinkedLectures: MCourseLecture[] = [];
  const linkedLectures = (data as unknown as MCourseLecture[]).filter((otherLecture) => {
    if (isSameTimeLecture(lect, otherLecture)) return false;
    if (otherLecture.groups !== lect.groups) return false;
    if (!deepEqual(otherLecture.lectureGroup, lect.lectureGroup)) return false;

    if (isStrongLinkedLecture(lect, otherLecture)) {
      strongLinkedLectures.push(otherLecture);
      return;
    }
    return true;
  });
  linkThrough(lect, linkedLectures);
  strongLinkThrough(lect, strongLinkedLectures);
}
