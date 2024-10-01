import { gradeAll, type Grade } from "~/server/scraper/types";

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

export function constructGradeLabel(grade: string, programAbbreviation: string): Grade {
  return grade === gradeAll ? grade : `${grade}${programAbbreviation}` as Grade;
}