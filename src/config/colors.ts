import { SUBJECT_TYPE } from "~/server/scraper/types";

/**
 * These colors are taken from the official VUT mobile app
 */
export const subjectTypeColors = {
  [SUBJECT_TYPE.LECTURE]: "#99ff99",
  [SUBJECT_TYPE.EXERCISE]: "#ffffcc",
  [SUBJECT_TYPE.SEMINAR]: "#ccffff",
  [SUBJECT_TYPE.LABORATORY]: "#ffe4b5",
  [SUBJECT_TYPE.EXAM]: "#ff9999", // this one is guessed, on web it's: #ffe6cc

}