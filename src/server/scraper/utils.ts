import { getWeekNumber } from "~/lib/date";
import { gradeAll } from "~/server/scraper/constants";
import type { Locales } from "~/server/scraper/locales/types";
import type { StudyId } from "~/server/scraper/types";
import { SEMESTER, WEEK_PARITY } from "./enums";

const conjunctedRooms = [
  { main: "E112", streamed: ["E104", "E105"] },
  { main: "D105", streamed: ["D0206", "D0207"] },
  { main: "N103", streamed: ["N104", "N105"] },
];


export function conjunctRooms(rooms: string[]): string {
  const conjunctedRooms = [
    { main: "E112", streamed: ["E104", "E105"] },
    { main: "D105", streamed: ["D0206", "D0207"] },
    { main: "N103", streamed: ["N104", "N105"] },
  ];

  // Iterate through conjunctedRooms to find matches
  const result = conjunctedRooms
    .map(({ main, streamed }) => {
      // Check if the input rooms include any of the rooms in the main and streamed set
      if (rooms.includes(main) && rooms.some(room => streamed.includes(room))) {
        // Create the formatted string
        const streamedNumbers = streamed
          .filter(room => rooms.includes(room))
          .map(room => room.slice(-1)); // Get the last digit of the room (e.g. '4' from 'E104')

        const rest = rooms.filter(room => ![main, ...streamed].includes(room));

        return `${main}+${streamedNumbers.join(',')}${rest.length ? ` ${rest.join(' ')}` : ""}`;
      }
      return null;
    })
    .filter(result => result !== null) // Filter out null values
    .join(' ; '); // Join the results with a semicolon and space

  // If result is empty, return the original rooms joined by commas
  return result || rooms.join(' ');
};

export function removeSpaces(text: string): string {
  // "sdsd\n\n           ds" => "sdsd ds"
  return text.replaceAll("\n", "").replace(/\s+/g, ' ').trim()
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
  } else {
    console.error(`No match found for ${url}`);
    return url;
  }
}

export function getWeekParityFromName(week: string, languageSet: Locales) {
  if (week.includes(languageSet.course.detail.weeks.EVEN)) return WEEK_PARITY.EVEN;
  if (week.includes(languageSet.course.detail.weeks.ODD)) return WEEK_PARITY.ODD;
  return null;
}

export function parseWeek(week: string, semesterStart: Date, languageSet: Locales) {
  // '1., 2., 3., 4., 5., 6. výuky' => [1, 2, 3, 4, 5, 6]
  if (week.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
    const weekNum = getWeekFromSemesterStart(new Date(week), semesterStart);
    return {
      weeks: [weekNum],
      parity: getParityOfWeeks([weekNum], semesterStart)
    };
  }
  // const parsedWeek = week.replace("výuky", "").
  //use regex to get the week numbers
  const parsedWeek = week.match(/\d+/g) ?? week
  // if is array of numbers, return the array
  if (Array.isArray(parsedWeek)) {
    const numberized = parsedWeek.map(Number);
    return {
      weeks: numberized,
      parity: getParityOfWeeks(numberized, semesterStart)
    }
  }
  return {
    weeks: week,
    parity: getWeekParityFromName(week, languageSet)
  };
}

function getWeekDiff(date: Date, fromDate: Date) {
  return getWeekNumber(date) - getWeekNumber(fromDate);
}


export function getWeekFromSemesterStart(date: Date, startDate: Date) {
  return getWeekDiff(date, startDate) + 1;
}

// /**
//  * 
//  * @param date 
//  * @param startDate 
//  * @returns number of weeks from the start date of the semester or null if the date is before the start date
//  */
// function getSemesterWeekFromDate(date: Date, startDate: Record<SEMESTER, Date>) {
//   const getSemesterDate = () => {
//     const winterStartDate = startDate[SEMESTER.WINTER];
//     const summerStartDate = startDate[SEMESTER.SUMMER];
//     if (date < winterStartDate) {
//       return null; // Event is before both semesters
//     } else if (date < summerStartDate) {
//       return winterStartDate;
//     } else {
//       return summerStartDate;
//     }

//   }
//   const semesterDate = getSemesterDate();
//   if (!semesterDate) return null;
//   return getWeekFromSemesterStart(date, semesterDate);
// }

function getSchoolWeekAsSemesterWeek(week: number, startDate: Record<SEMESTER, Date>) { }
// ex: semester starts on 2024-09-16, school week 1 is 4 week of month


export function getParityOfWeeks(weeks: number[], semesterStartDate: Date) {
  // [1,3,5,7] > check if the week is odd or even > check against the start of the semester > return odd or even or weeks
  const odd = weeks.every(week => week % 2 === 1);
  const even = weeks.every(week => week % 2 === 0);
  if (odd === even) return null;

  // check against the start of the semester
  const weekOfSemesterStart = getWeekNumber(semesterStartDate);
  const isLectureWeekEven = (weekOfSemesterStart + +odd) % 2;
  return isLectureWeekEven ? WEEK_PARITY.EVEN : WEEK_PARITY.ODD;
}

export const conjunctConjunctableRooms = (roomsInput: string[]): string => {
  // find main room
  const mainRoom = conjunctedRooms.find(room => roomsInput.includes(room.main))
  if (!mainRoom) return roomsInput.join(', ')
  // find streamed rooms
  const streamedRooms = mainRoom.streamed.filter(room => roomsInput.includes(room))
  // find other rooms
  const otherRooms = roomsInput.filter(room => ![mainRoom.main, ...mainRoom.streamed].includes(room))
  // conjunct streamed rooms
  const conjunctedRoomsData = streamedRooms.length ? `${mainRoom.main}+${streamedRooms.map(room => room.slice(-1)).join(',')}${otherRooms.length ? `, ${otherRooms.join(', ')}` : ""}` : mainRoom.main
  return conjunctedRoomsData
}

// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
export function uniq_fast<T extends string | number = string | number>(a: T[]): T[] {
  const seen: Record<string | number, boolean> = {};
  const out: T[] = [];
  const len = a.length;
  let j = 0;
  for (let i = 0; i < len; i++) {
    const key = a[i];
    if (!seen[key]) {
      seen[key] = true;
      out[j++] = key;
    }
  }
  return out;
}

