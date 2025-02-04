import { isEqual, isString, union } from "lodash-es";
import uniq from "lodash-es/uniq";
import { ObjectTyped } from "object-typed";
import type { StrictOmit } from "ts-essentials";
import { v4 as uuidv4 } from "uuid";
import type { Time, TimeSpan } from "~/components/scheduler/time";
import { conjunctableRooms } from "~/config/rooms";
import { days } from "~/config/scheduler";
import { halfSemesterWeeks } from "~/server/scraper/constants";
import { lecturesWithoutExam, WEEK_PARITY, type DAY } from "~/server/scraper/enums";
import type { APICourseLecture, CourseDetail, DataProviderTypes, StudyApiTypes } from "~/server/scraper/types";
import { conjunctConjunctableRooms, getLectureLectures, getWeekFromSemesterStart } from "~/server/scraper/utils";

interface IDdCourseLectureBase {
  id: string;
  /** required number of lectures througout the semester */
  lecturesCount: number | false;
}

interface IDdCourseLecture extends IDdCourseLectureBase, APICourseLecture {}

interface IdCourseReturn extends DataProviderTypes.getStudyCourseDetailsReturn {
  data: IDdCourseLecture[];
}

export type FilteredCourseLecture = ReturnType<typeof filterData>[number];

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

export async function MutateLectureData(props: StudyApiTypes.getStudyCoursesDetailsReturn, config: LectureMutatorConfig) {
  const { data, semesterTimeSchedule } = props;
  const semesterWeeks = getWeekFromSemesterStart(semesterTimeSchedule.end, semesterTimeSchedule.start);
  for (const _course of data) {
    const course = idCourse(_course);

    const filteredData = filterData(course.data);
    fillWeeksCourse(filteredData, semesterWeeks, config.fillWeeks);
    const conjunctedData = conjunctCourse(fillWeeksCourse(filteredData, semesterWeeks, config.fillWeeks));
    const linkedData = linkCourse(conjunctedData, semesterWeeks);
    // @ts-ignore
    course.data = linkedData;
  }
  return data as unknown as MgetStudyCourseDetailsReturn[];
}

function idCourse(course: DataProviderTypes.getStudyCourseDetailsReturn): IdCourseReturn {
  for (const lecture of course.data) {
    Object.assign(lecture, {
      id: idLecture(lecture),
      lecturesCount: getLectureLectures(lecture, course.detail)!,
    }) satisfies IDdCourseLecture;
  }
  return course as IdCourseReturn;
}

// TODO: implement
function idLecture(lecture: APICourseLecture) {
  return uuidv4();
}

function fillWeeksCourse(data: FilteredCourseLecture[], semesterWeeks: number, fillWeeks?: boolean) {
  if (fillWeeks === false) return data;
  for (const lecture of data) {
    fillWeeksLecture(lecture, semesterWeeks);
  }
  return data;
}

function filterData(data: IDdCourseLecture[]) {
  return data.filter((lecture) => {
    if (!lecturesWithoutExam.includes(lecture.type)) return false;
    // if note is present, It is not possible to register (probably)
    if (lecture.note) return false;
    // if day not supported
    if (!days.includes(lecture.day)) return false;
    // if lectures count is not defined, which it should
    if (!lecture.lecturesCount) return false;
    return true;
  }) as {
    [K in keyof IDdCourseLecture]: K extends "type"
      ? (typeof lecturesWithoutExam)[number]
      : K extends "note"
        ? never
        : K extends "day"
          ? DAY
          : K extends "lecturesCount"
            ? number
            : IDdCourseLecture[K];
  }[];
}

function conjunctCourse(data: FilteredCourseLecture[]): ConjunctedLecture[] {
  for (let i = 0; i < data.length; i++) {
    const lecture = data[i];

    const toBeConjunctedLectures = { [i]: lecture };
    const remainingLecturesLength = data.length - i;
    const isLast = i === data.length - 1;
    // // last lecture does not have anything to conjunct with
    for (let j = 1; !isLast && j < remainingLecturesLength; j++) {
      const comparedLecture = data[i + j];
      function addToBeConjuncted() {
        toBeConjunctedLectures[i + j] = comparedLecture;
      }
      // break coz any next is still different day
      if (lecture.day !== comparedLecture.day) break;
      // any next will still be after the lecture
      if (isAfterLecture(lecture, comparedLecture)) break;
      if (lecture.type !== comparedLecture.type) continue;
      if (!isSameTimeLecture(lecture, comparedLecture)) continue;
      if (lecture.groups !== comparedLecture.groups) continue;
      if (!isEqual(lecture.lectureGroup, comparedLecture.lectureGroup)) continue;
      if (isString(lecture.weeks.weeks) || isString(comparedLecture.weeks.weeks)) continue;
      const combinedWeeks = union(lecture.weeks.weeks, comparedLecture.weeks.weeks).sort((a, b) => a - b);
      if (lecture.groups === "xx" && combinedWeeks.length > lecture.lecturesCount + 1) continue;
      if (
        lecture.lecturesCount <= halfSemesterWeeks &&
        lecture.weeks.parity &&
        comparedLecture.weeks.parity &&
        lecture.weeks.parity !== comparedLecture.weeks.parity
      )
        continue;
      // add the weeks to the lecture so in another iteration it is checked against optimistic weeks value
      lecture.weeks.weeks = combinedWeeks;
      addToBeConjuncted();
    }
    const toBeConjunctedLecturesValues = Object.values(toBeConjunctedLectures);
    const lect = lecture as unknown as MCourseLecture;
    if (toBeConjunctedLecturesValues.length === 1) {
      lect.room = conjunctConjunctableRooms(uniq(toBeConjunctedLecturesValues.flatMap((lect) => lect.room)));
      continue;
    }
    // info is commonly names of the lectures
    lect.info = uniq(toBeConjunctedLecturesValues.map((lect) => lect.info)).join(", ");
    // note is filtered out, but if it is present, it should be joined
    // lect.note = toBeConjunctedLecturesValues
    //   .map((lect) => lect.note)
    //   .filter(Boolean)
    //   .join(", ");
    const main =
      toBeConjunctedLecturesValues.find((lecture) =>
        lecture.room.some((room) =>
          conjunctableRooms.some((conjunctable) =>
            Array.isArray(conjunctable) ? conjunctable.includes(room) : conjunctable.main === room
          )
        )
      ) ?? toBeConjunctedLecturesValues[0];
    lect.room = conjunctConjunctableRooms(uniq(toBeConjunctedLecturesValues.flatMap((lect) => lect.room)));
    lect.weeks = {
      parity: toBeConjunctedLecturesValues.every((lect) => lect.weeks.parity === main.weeks.parity)
        ? main.weeks.parity
        : null,
      weeks: uniq(
        toBeConjunctedLecturesValues
          .flatMap((lect) => (Array.isArray(lect.weeks.weeks) ? lect.weeks.weeks : []))
          .sort((a, b) => a - b)
      ),
    };
    lect.capacity = toBeConjunctedLecturesValues.every((lect) => lect.capacity === main.capacity)
      ? main.capacity
      : toBeConjunctedLecturesValues.map((lect) => lect.capacity).join(", ");

    // slice so it doesn.t remove the lecture that is being checked, reverse so it doesn't mess up the indexes
    for (const i of ObjectTyped.keys(toBeConjunctedLectures).slice(1).reverse()) {
      data.splice(i, 1);
    }
  }
  return data as unknown as ConjunctedLecture[];
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

// export function conjunctLectures(
//   lecture: FilteredCourseLecture,
//   lectures: FilteredCourseLecture[],
//   index: number,
//   data: FilteredCourseLecture[]
// ) {
//   const preConjunctedLectures = { [index]: lecture };
//   for (const [shift, comparedLecture] of lectures.entries()) {
//     function conjunct() {
//       preConjunctedLectures[index + shift + 1] = comparedLecture;
//     }
//     // if the day is different, lectures cannot be conjuncted.
//     if (lecture.day !== comparedLecture.day) break;
//     if (lecture.type !== comparedLecture.type) continue;
//     if (!isSameTimeLecture(lecture, comparedLecture)) continue;
//     // if (!isConjunctable(lecture.room, comparedLecture.room) && !isEqual(lecture.room, comparedLecture.room)) continue;
//     if (lecture.groups !== comparedLecture.groups) continue;
//     if (!isEqual(lecture.lectureGroup, comparedLecture.lectureGroup)) continue;
//     if (isString(lecture.weeks.weeks) !== isString(comparedLecture.weeks.weeks)) {
//       // If there are lectures with same group but one has weeks and one hasn't it probabbly is same lecture in different rooms
//       if (lecture.groups === comparedLecture.groups && lecture.groups !== "xx" && lecture.room !== comparedLecture.room) {
//         conjunct();
//       }
//       continue;
//     }
//     if (isString(lecture.weeks.weeks) || isString(comparedLecture.weeks.weeks)) continue;

//     if (
//       // ref: README-> Notes > Timespans. Plus one should not matter in terms of splitting odd/even lectures, but helps with the conjuncting
//       (union(lecture.weeks.weeks, comparedLecture.weeks.weeks).length > lecture.lecturesCount + 1 &&
//         // even if the lecture exceeds the semester weeks, it should be conjuncted if groups id defined
//         lecture.groups === "xx") ||
//       (lecture.lecturesCount <= 6 &&
//         lecture.weeks.parity &&
//         comparedLecture.weeks.parity &&
//         lecture.weeks.parity !== comparedLecture.weeks.parity)
//     )
//       continue;
//     lecture.weeks.weeks = union(lecture.weeks.weeks, comparedLecture.weeks.weeks);

//     conjunct();
//   }
//   const preConjunctedLecturesValues = Object.values(preConjunctedLectures);
//   const hasEveryLectureSameRoom = preConjunctedLecturesValues.every((l) => deepEqual(l.room, lecture.room));
//   const mainEvent = hasEveryLectureSameRoom
//     ? lecture
//     : (preConjunctedLecturesValues.find((lecture) =>
//         lecture.room.some((room) =>
//           conjunctableRooms.some((conjunctable) =>
//             Array.isArray(conjunctable) ? conjunctable.includes(room) : conjunctable.main === room
//           )
//         )
//       ) ?? preConjunctedLecturesValues[0]);
//   if (mainEvent && preConjunctedLecturesValues.length > 1) {
//     const lect = lecture as unknown as MCourseLecture;
//     lect.room = conjunctConjunctableRooms(uniq(preConjunctedLecturesValues.flatMap((lect) => lect.room)));
//     lect.info = uniq(preConjunctedLecturesValues.map((lect) => lect.info)).join(", ");
//     lect.note = preConjunctedLecturesValues
//       .map((lect) => lect.note)
//       .filter(Boolean)
//       .join(", ");
//     const conjunctedWeeks = uniq(
//       preConjunctedLecturesValues.flatMap((lect) => lect.weeks.weeks as number[]).sort((a, b) => a - b)
//     );
//     lect.weeks = {
//       parity: preConjunctedLecturesValues.every((lect) => lect.weeks.parity === mainEvent.weeks.parity)
//         ? mainEvent.weeks.parity
//         : null,
//       weeks: conjunctedWeeks,
//     };
//     // // if capacity is same, keep it, if not, join them
//     lect.capacity = preConjunctedLecturesValues.every((lect) => lect.capacity === mainEvent.capacity)
//       ? mainEvent.capacity
//       : preConjunctedLecturesValues.map((lect) => lect.capacity).join(", ");

//     for (const i of ObjectTyped.keys(preConjunctedLectures).slice(1).reverse()) {
//       data.splice(i, 1);
//     }
//   }
// }

function isSameTimeLecture(lecture1: { day: DAY; timeSpan: TimeSpan }, lecture2: { day: DAY; timeSpan: TimeSpan }) {
  const isSameTime = (time1: Time, time2: Time) => time1.hour === time2.hour && time1.minute === time2.minute;
  return (
    lecture1.day === lecture2.day &&
    isSameTime(lecture1.timeSpan.start, lecture2.timeSpan.start) &&
    isSameTime(lecture1.timeSpan.end, lecture2.timeSpan.end)
  );
}

function isAfterLecture(lecture1: { day: DAY; timeSpan: TimeSpan }, lecture2: { day: DAY; timeSpan: TimeSpan }) {
  return lecture2.timeSpan.start.minutes > lecture1.timeSpan.end.minutes;
}

function linkCourse(data: ConjunctedLecture[], semesterWeeks: number) {
  for (const lecture of data) {
    linkLectrues(lecture, data, semesterWeeks);
  }
  return data as unknown as linkedLecture[];
}

function linkLectrues(lecture: ConjunctedLecture, data: ConjunctedLecture[], semesterWeeks: number) {
  const convertToMCourseLecture = (lecture: ConjunctedLecture): linkedLecture => {
    return Object.assign(lecture, { strongLinked: [], linked: [] });
  };
  const isStrongLinkedLecture = (lecture: linkedLecture, otherLecture: ConjunctedLecture) => {
    if (lecture.type !== otherLecture.type) return false;
    if (typeof lecture.weeks.weeks === "string" || typeof otherLecture.weeks.weeks === "string") return false;
    if (!lecture.lecturesCount || !otherLecture.lecturesCount) return false;
    const combinedLecturesCount =
      (lecture.lecturesCount * otherLecture.lecturesCount) / (lecture.lecturesCount + otherLecture.lecturesCount);
    return Math.round(combinedLecturesCount) === semesterWeeks;
  };
  const getLinkedData = (lectures: ConjunctedLecture[]) => {
    return lectures.map((lecture) => ({ id: lecture.id, day: lecture.day }));
  };
  const linkThrough = (lecture: linkedLecture, linked: linkedLecture[]) => {
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
  const strongLinkThrough = (lecture: linkedLecture, linked: linkedLecture[]) => {
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
  // if groups are not defined, it is not possible to link
  if (!/\d/.test(lecture.groups)) return;
  const strongLinkedLectures: ConjunctedLecture[] = [];
  const linkedLectures: ConjunctedLecture[] = [];
  for (const otherLecture of data) {
    if (isSameTimeLecture(lect, otherLecture)) continue;
    if (otherLecture.groups !== lect.groups) continue;
    if (!isEqual(otherLecture.lectureGroup, lect.lectureGroup)) continue;

    if (isStrongLinkedLecture(lect, otherLecture)) {
      strongLinkedLectures.push(otherLecture);
      continue;
    }
    linkedLectures.push(otherLecture);
  }
  // they will become LinkedLecture after it all passes
  linkThrough(lect, linkedLectures as linkedLecture[]);
  strongLinkThrough(lect, strongLinkedLectures as linkedLecture[]);
}
