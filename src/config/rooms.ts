type ConjunctableRooms = (
  | {
      main: string;
      streamed: string[];
    }
  | string[]
)[];

/**
 * Configuration array defining conjunctable rooms in the building.
 * Each element represents either:
 * - An object with a main room and its streamed rooms
 * - An array of rooms that can be connected together
 *
 * @example
 * // Room D105 can stream to D0206 and D0207
 * { main: "D105", streamed: ["D0206", "D0207"] }
 *
 * // Rooms N103, N104, and N105 can be merged into single event
 * ["N103", "N104", "N105"]
 *
 * @constant
 * @readonly
 */
export const conjunctableRooms: ConjunctableRooms = [
  { main: "D105", streamed: ["D0206", "D0207"] },
  { main: "E112", streamed: ["E104", "E105"] },
  ["N103", "N104", "N105"],
] as const;
