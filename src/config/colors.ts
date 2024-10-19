import { LECTURE_TYPE } from "~/server/scraper/enums";

/**
 * These colors are taken from the official VUT mobile app
 */
export const subjectTypeColors = {
  [LECTURE_TYPE.LECTURE]: "#99ff99",
  [LECTURE_TYPE.EXERCISE]: "#ffffcc",
  [LECTURE_TYPE.SEMINAR]: "#ccffff",
  [LECTURE_TYPE.LABORATORY]: "#ffe4b5",
  [LECTURE_TYPE.EXAM]: "#ff9999", // this one is guessed, on web it's: #ffe6cc

}