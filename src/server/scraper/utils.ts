import { conjunctableRooms } from "~/config/rooms";
import { getWeekNumber } from "~/lib/date";
import { gradeAll } from "~/server/scraper/constants";
import type { LanguageSetDictionary } from "~/server/scraper/languageProvider";
import type { StudyId } from "~/server/scraper/types";
import { WEEK_PARITY } from "./enums";

// const conjunctedRooms = [
//   { main: "E112", streamed: ["E104", "E105"] },
//   { main: "D105", streamed: ["D0206", "D0207"] },
//   { main: "N103", streamed: ["N104", "N105"] },
// ];

// export function conjunctRooms(rooms: string[]): string {
//   const conjunctedRooms = [
//     { main: "E112", streamed: ["E104", "E105"] },
//     { main: "D105", streamed: ["D0206", "D0207"] },
//     { main: "N103", streamed: ["N104", "N105"] },
//   ];

//   // Iterate through conjunctedRooms to find matches
//   const result = conjunctedRooms
//     .map(({ main, streamed }) => {
//       // Check if the input rooms include any of the rooms in the main and streamed set
//       if (rooms.includes(main) && rooms.some((room) => streamed.includes(room))) {
//         // Create the formatted string
//         const streamedNumbers = streamed.filter((room) => rooms.includes(room)).map((room) => room.slice(-1)); // Get the last digit of the room (e.g. '4' from 'E104')

//         const rest = rooms.filter((room) => ![main, ...streamed].includes(room));

//         return `${main}+${streamedNumbers.join(",")}${rest.length ? ` ${rest.join(" ")}` : ""}`;
//       }
//       return null;
//     })
//     .filter((result) => result !== null) // Filter out null values
//     .join(" ; "); // Join the results with a semicolon and space

//   // If result is empty, return the original rooms joined by commas
//   return result || rooms.join(" ");
// }

export function removeSpaces(text: string): string {
  // "sdsd\n\n           ds" => "sdsd ds"
  return text.replaceAll("\n", "").replace(/\s+/g, " ").trim();
}

export function constructGradeLabel(grade: string, programAbbreviation: string): string {
  return grade === gradeAll ? `${grade}-${programAbbreviation}` : `${grade}${programAbbreviation}`;
}

export function createStudyId(url: string): StudyId {
  // This regex will match any path segment followed by a number
  const regex = /\/([^\/]+)\/(\d+)/;
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

export function getWeekParityFromName(week: string, languageSet: LanguageSetDictionary) {
  if (week.includes(languageSet.course.detail.weeks.EVEN)) return WEEK_PARITY.EVEN;
  if (week.includes(languageSet.course.detail.weeks.ODD)) return WEEK_PARITY.ODD;
  return null;
}

export function parseWeek(week: string, semesterStart: Date, languageSet: LanguageSetDictionary) {
  // '1., 2., 3., 4., 5., 6. výuky' => [1, 2, 3, 4, 5, 6]
  if (week.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
    const weekNum = getWeekFromSemesterStart(new Date(week), semesterStart);
    return {
      weeks: [weekNum],
      parity: getParityOfWeeks([weekNum], semesterStart),
    };
  }
  // const parsedWeek = week.replace("výuky", "").
  //use regex to get the week numbers
  const parsedWeek = week.match(/\d+/g) ?? week;
  // if is array of numbers, return the array
  if (Array.isArray(parsedWeek)) {
    const numberized = parsedWeek.map(Number);
    return {
      weeks: numberized,
      parity: getParityOfWeeks(numberized, semesterStart),
    };
  }
  return {
    weeks: week,
    parity: getWeekParityFromName(week, languageSet),
  };
}

function getWeekDiff(date: Date, fromDate: Date) {
  return getWeekNumber(date) - getWeekNumber(fromDate);
}

export function getWeekFromSemesterStart(date: Date, startDate: Date) {
  return getWeekDiff(date, startDate) + 1;
}

export function getParityOfWeeks(weeks: number[], semesterStartDate: Date) {
  // [1,3,5,7] > check if the week is odd or even > check against the start of the semester > return odd or even or weeks
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
    let remainingRooms = [...roomsInput];

    for (const room of conjunctableRooms) {
      if (Array.isArray(room)) {
        const presentRooms = room.filter((r) => remainingRooms.includes(r));
        if (presentRooms.length > 1) {
          const base = presentRooms[0];
          const rest = presentRooms.slice(1).map((r) => r.slice(-1));
          result.push(`${base}+${rest.join(",")}`);
          remainingRooms = remainingRooms.filter((r) => !presentRooms.includes(r));
        }
      } else {
        if (remainingRooms.includes(room.main)) {
          const streamedPresent = room.streamed.filter((r) => remainingRooms.includes(r));
          if (streamedPresent.length > 0) {
            result.push(`${room.main}+${streamedPresent.map((r) => r.slice(-1)).join(",")}`);
            remainingRooms = remainingRooms.filter((r) => r !== room.main && !streamedPresent.includes(r));
          }
        }
      }
    }

    return [...result, ...remainingRooms];
  };

  return processRooms(roomsInput).join(" ");
};
