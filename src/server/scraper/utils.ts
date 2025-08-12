import { conjunctableRooms } from "~/config/rooms";
import { getWeekNumber } from "~/lib/date";
import { gradeAll } from "~/server/scraper/constants";
import type { APICourseLecture, CourseDetail, StudyId } from "~/server/scraper/types";
import { WEEK_PARITY } from "./enums";

/**
 * Removes all whitespace characters from a string.
 * @param text The input string.
 * @returns The string with all whitespace characters removed.
 * @example "sdsd\n\n           ds" => "sdsd ds"
 */
export function removeSpaces(text: string): string {
  return text.replaceAll("\n", "").replace(/\s+/g, " ").trim();
}

/**
 * Constructs a label for a grade and program abbreviation.
 * @param grade The grade abbreviation. number or ALL.
 * @param programAbbreviation
 * @returns The label string.
 * @example "1", "NBIO" => "1NBIO", "ALL", "NBIO" => "ALL-NBIO"
 */
export function constructGradeLabel(grade: string, programAbbreviation: string): string {
  return grade === gradeAll ? `${grade}-${programAbbreviation}` : `${grade}${programAbbreviation}`;
}

/**
 * Creates a study ID from a URL.
 * @param url The URL of program or field.
 * @returns The study ID.
 * @example "https://www.fit.vut.cz/study/program/9229/.cs" => "program-9229", "https://www.fit.vut.cz/study/field/17280/.cs" => "field-17280"
 */
export function createStudyId(url: string): StudyId {
  // This regex will match any path segment followed by a number
  const regex = /\/([^/]+)\/(\d+)/;
  const match = url?.match(regex);

  if (match) {
    const [, type, id] = match;
    // Convert the type to lowercase and remove any potential file extensions
    const cleanType = type.toLowerCase().replace(/\.[^/.]+$/, "");
    return `${cleanType}-${id}`;
  }
  console.error(`No match found for ${url}`);
  return url;
}

function getWeekDiff(date: Date, fromDate: Date) {
  return getWeekNumber(date) - getWeekNumber(fromDate);
}

/**
 * Calculates the week number from the start of the semester.
 * @param date The date to calculate the week number for.
 * @param startDate The start date of the semester.
 */
export function getWeekFromSemesterStart(date: Date, startDate: Date) {
  return getWeekDiff(date, startDate) + 1;
}

/**
 * Calculates the parity of the weeks based on the start of the semester.
 * @param weeks An array of week numbers.
 * @param semesterStartDate The start date of the semester.
 * @returns The parity of the weeks. Null if the weeks are not even or odd.
 * @example [1,3,5,7] > check if the week is odd or even > is odd > check against the start of the semester > return even
 */
export function getParityOfWeeks(weeks: number[], semesterStartDate: Date) {
  const odd = weeks.every((week) => week % 2 === 1);
  const even = weeks.every((week) => week % 2 === 0);
  if (odd === even) return null;

  // check against the start of the semester
  const weekOfSemesterStart = getWeekNumber(semesterStartDate);
  const isLectureWeekEven = (weekOfSemesterStart + +odd) % 2;
  return isLectureWeekEven ? WEEK_PARITY.EVEN : WEEK_PARITY.ODD;
}

export const conjunctConjunctableRooms = (roomsInput: string[]): string => {
  const processRooms = (roomsInput: string[]): string[] => {
    const result: string[] = [];
    const remainingRooms = new Set(roomsInput);

    for (const room of conjunctableRooms) {
      if (Array.isArray(room)) {
        const presentRooms = room.filter((room) => remainingRooms.has(room));
        if (presentRooms.length > 1) {
          const base = presentRooms[0];
          const rest = presentRooms
            .slice(1)
            .map((r) => r.slice(-1))
            .join(",");
          result.push(`${base}+${rest}`);
          presentRooms.forEach((r) => remainingRooms.delete(r));
        }
      } else {
        if (remainingRooms.has(room.main)) {
          const streamedPresent = room.streamed.filter((room) => remainingRooms.has(room));
          if (streamedPresent.length > 0) {
            const rest = streamedPresent.map((r) => r.slice(-1)).join(",");
            result.push(`${room.main}+${rest}`);
            remainingRooms.delete(room.main);
            streamedPresent.forEach((r) => remainingRooms.delete(r));
          }
        }
      }
    }

    return [...result, ...remainingRooms];
  };

  return processRooms(roomsInput).join(" ");
};

/**
 * This function calculates the number of lectures that should be in the semester based on the length of given lecture
 * Problem n.1: In a week there may be more lectures with different lengths -> solved by concatenating the lectures elsewhere
 * Problem n.2: the calculation doesn't have to reflect what's written in the detail. Viz README.md
 */
export function getLectureLectures(lecture: APICourseLecture, detail: CourseDetail) {
  const lectureTimeSpan = detail.timeSpan[lecture.type];
  if (lectureTimeSpan === undefined) return null;
  const duration = lecture.timeSpan.minutes;
  // round up to nearest hour, 7:00 - 7:50 => 50 minutes => 1 hour

  // ---- when assuming lecture duration is in atleast 60 minute intervals
  const lectureDuration = Math.ceil(duration / 60);
  const lectureLectures = Math.round(lectureTimeSpan / lectureDuration);

  // ---- when assuming lecture duration in minutes -- WRONG
  // const lectureLectures = Math.floor(lectureTimeSpan * 60 / duration)
  return lectureLectures;
}
