import { LECTURE_TYPE, WEEK_PARITY } from "../server/scraper/enums";

/**
 * These colors are taken from the official VUT mobile app
 */
export const subjectTypeColors = {
  [LECTURE_TYPE.LECTURE]: "#99ff99",
  [LECTURE_TYPE.EXERCISE]: "#ffffcc",
  [LECTURE_TYPE.SEMINAR]: "#ccffff",
  [LECTURE_TYPE.LABORATORY]: "#ffe4b5",
  [LECTURE_TYPE.EXAM]: "#ff9999", // this one is suggestive, on web it's: #ffe6cc, in the app it's: #e9f1fe, but that I don't like
};

export const hoverColors = {
  /** lectures with same lecture group */
  linked: "#94a3b8",
  /** lecture with same lecture group and type */
  strongLinked: "#f97316",
} as const;

export const parityColors = {
  [WEEK_PARITY.EVEN]: "#ef4444",
  [WEEK_PARITY.ODD]: "#3b82f6",
} as const;
