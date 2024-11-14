
/**
 * translation: Studium
 *
 * ends with title of the study program
 */
export enum DEGREE {
  BACHELOR = "BACHELOR",
  MASTER = "MASTER",
  DOCTORAL = "DOCTORAL"
}
/** Yeah, they are only two */
export enum SEMESTER {
  WINTER = "WINTER",
  SUMMER = "SUMMER"
}
export enum LECTURE_TYPE {
  LECTURE = "LECTURE",// presentation by lecturer
  LABORATORY = "LABORATORY",// exercises performed by students
  EXERCISE = "EXERCISE",// exercises performed by lecturer for few students
  SEMINAR = "SEMINAR",// exercises performed by lecturer for many students
  EXAM = "EXAM"
}
export enum DAY {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI"
}

export enum WEEK_PARITY {
  EVEN = "EVEN",
  ODD = "ODD"
}
