/**
 * translation: Studium
 *
 * ends with title of the study program
 */
export enum DEGREE {
  BACHELOR = "BACHELOR",
  MASTER = "MASTER",
  DOCTORAL = "DOCTORAL",
}
/** Yeah, they are only two */
export enum SEMESTER {
  WINTER = "WINTER",
  SUMMER = "SUMMER",
}
export enum LECTURE_TYPE {
  LECTURE = "LECTURE", // presentation by lecturer
  LABORATORY = "LABORATORY", // exercises performed by students
  EXERCISE = "EXERCISE", // exercises performed by lecturer for few students
  SEMINAR = "SEMINAR", // exercises performed by lecturer for many students
  EXAM = "EXAM",
}

// LECTURE_TYPE without EXAM
export const lecturesWithoutExam: LECTURE_TYPE[] = [
  LECTURE_TYPE.LECTURE,
  LECTURE_TYPE.LABORATORY,
  LECTURE_TYPE.EXERCISE,
  LECTURE_TYPE.SEMINAR,
];

export enum DAY {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
}
/**
 * It may be a bit confusing, but the parity is determined by the parity of the week number not in the schedule, but in a year.
 */
export enum WEEK_PARITY {
  EVEN = "EVEN",
  ODD = "ODD",
}

export enum OBLIGATION {
  COMPULSORY = "COMPULSORY",
  ELECTIVE = "ELECTIVE",
  COMPULSORY_ELECTIVE = "COMPULSORY_ELECTIVE",
}
