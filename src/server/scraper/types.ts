enum LANGUAGE {
  ENGLISH = 'en',
  CZECH = 'cs',
}
enum DEGREE {
  BACHELOR = "BACHELOR",
  MASTER = "MASTER",
  DOCTORAL = "DOCTORAL",
}
/** Yeah, they are only two */
enum SEMESTER {
  WINTER = "WINTER",
  SUMMER = "SUMMER"
}

enum COURSE_TYPE {
  LECTURE = "LECTURE",
  LABORATORY = "LABORATORY",
  EXAM = "EXAM",
  DEMO_EXERCISE = "DEMO_EXERCISE"
}

enum DAY {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
}


interface StudyPrograms {
  [DEGREE.BACHELOR]: StudyProgram[];
  [DEGREE.MASTER]: StudyProgram[];
  [DEGREE.DOCTORAL]: StudyProgram[];
}
interface StudyProgramBase {
  name: string;
  abbreviation: string;
  url: string;
}
interface StudyProgram extends StudyProgramBase {
  isEnglish?: boolean;
  specializations: StudySpecialization[];
  attendanceType: string;
}
interface StudySpecialization extends StudyProgramBase { }

interface StudyCourse {
  abbreviation: string;
  title: string;
  link: string;
  id: number;
  credits: string;
  obligation: boolean;
  completion: string;
  faculty: string;
  note: boolean;
}

interface StudyOverviewConfig {
  year: string | number, // value
  degree: DEGREE,
}

/**
 * ex: BIT, DIT, NBIO, NHCP
 */
type Program = string

type GradeNumber = number;
type GradeWithoutAll = `${GradeNumber}${Program}`;
type Grade = GradeWithoutAll | "ALL";

interface StudyOverviewYear { value: string, label: string }
interface StudyOverviewCourse {
  name: string;
  abbreviation: string;
  id: string;
}
interface StudyOverview {
  /**
   * current data
   * 
   * values for which the data is meaningful
   */
  values: {
    year: StudyOverviewYear,
    /**
     * this value may seem redundant on the server side, but it's here for the client side
     */
    semester: SEMESTER,
    degree: DEGREE,
    grade: Grade,
  },
  /**
   * Data coresponding to the chosen values
   */
  data: {
    years: StudyOverviewYear[],
    semesters: SEMESTER[],
    degrees: DEGREE[],
    grades: Grade[],
    /**
     * All the couses for the whole degree and both semesters. "coz why not",
     * may be optimized out in the future
     * For now it's eazy to return them all for they are all at the same page.
     * makes it easy to switch between grades and semesters
     * 
     * grade > semester > type > courses
     * because pages are structured like this
     */
    courses: {
      [grade: GradeWithoutAll]: { [S in SEMESTER]: { [T in "compulsory" | "optional"]: StudyOverviewCourse[] } },
      ALL?: { [S in SEMESTER]: { [T in "compulsory" | "optional"]: StudyOverviewCourse[] } }
    }
  }
}


type StudyCourses = {
  [grade: GradeNumber]: Record<SEMESTER, StudyCourse[]>;
  ALL?: Record<SEMESTER, StudyCourse[]>;
}
type StudyYear = keyof StudyCourses;

interface StudyTimeScheduleConfig {
  year: string | number | null;
}

interface CourseDetail {
  name: string;
  link: string;
  day: DAY;
  weeks: string;
  room: string;
  type: COURSE_TYPE | null;
  start: string;
  end: string;
  capacity: string;
  lectureGroup: string[];
  groups: string;
  info: string;
  note: string | null;
}


export { COURSE_TYPE, DAY, DEGREE, LANGUAGE, SEMESTER };
export type { CourseDetail, Grade, Program, StudyCourse, StudyCourses, StudyOverview, StudyOverviewConfig, StudyProgram, StudyProgramBase, StudyPrograms, StudySpecialization, StudyTimeScheduleConfig, StudyYear };

