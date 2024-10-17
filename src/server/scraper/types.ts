enum LANGUAGE {
  ENGLISH = 'en',
  CZECH = 'cs',
}
/**
 * translation: Studium
 * 
 * ends with title of the study program
 */
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

enum SUBJECT_TYPE {
  LECTURE = "LECTURE",        // presentation by lecturer
  LABORATORY = "LABORATORY",  // exercises performed by students
  EXERCISE = "EXERCISE",      // exercises performed by lecturer for few students
  SEMINAR = "SEMINAR",        // exercises performed by lecturer for many students
  EXAM = "EXAM",              // exam
}

enum DAY {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
}

/**
 * @example "program-8956"
 */
type StudyId = string;

interface StudyPrograms {
  [DEGREE.BACHELOR]: { [id: StudyId]: StudyProgram };
  [DEGREE.MASTER]: { [id: StudyId]: StudyProgram };
  [DEGREE.DOCTORAL]: { [id: StudyId]: StudyProgram };
}
interface StudyProgramBase {
  name: string;
  abbreviation: string;
  id: StudyId;
}
interface StudyProgramWithUrl extends StudyProgramBase {
  url: string;
}
interface StudyProgram extends StudyProgramWithUrl {
  isEnglish: boolean;
  specializations: StudySpecialization[];
  attendanceType: string;
}
interface StudySpecialization extends StudyProgramWithUrl { }

const gradeAll = "ALL";
type GradeAll = typeof gradeAll;
type GradeNumber = number;
type GradeWithoutAll = `${GradeNumber}${StudyProgramBase["abbreviation"]}`;
type GradeKey = string | GradeAll;


interface StudyOverviewYear { value: string, label: string }
interface StudyOverviewGrade { key: GradeKey, label: string }
interface StudyOverview {
  /**
   * current data
   * 
   * only values that when changed should cause refetch
   */
  values: {
    year: StudyOverviewYear,
    degree: DEGREE,
    /**
     * Programs and specializations.
     */
    program?: StudyProgramWithUrl,
  },
  /**
   * Data coresponding to the chosen values
   */
  data: {
    years: StudyOverviewYear[],
    semesters: SEMESTER[],
    degrees: DEGREE[],
    grades: StudyOverviewGrade[],
    programs: Record<DEGREE, StudyProgram[]>,
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
      [grade: GradeKey]: { [S in SEMESTER]: { [T in "compulsory" | "optional"]: StudyOverviewCourse[] } },
    }
  }
}

interface StudyOverviewCourse {
  abbreviation: string;
  name: string;
  id: string;
}


type ProgramStudyCourses = Record<GradeKey, GradeStudyCourses & StudyProgramBase>
type GradeStudyCourses = Record<SEMESTER, StudyCourse[]>
interface StudyCourse extends StudyOverviewCourse {
  link: string;
  credits: string;
  obligation: boolean;
  completion: string;
  faculty: string;
  note: boolean;
}



interface StudyTimeScheduleConfig {
  year: string | null;
}

interface CourseSubject {
  day: DAY;
  weeks: string;
  room: string;
  type: SUBJECT_TYPE;
  start: string;
  end: string;
  capacity: string;
  lectureGroup: string[];
  groups: string;
  info: string;
  note: string | null;
}

interface CourseDetail {
  abbreviation: string;
  name: string;
  link: string;
  id: string;
  timeSpan: CourseTimeSpan;
}

type CourseTimeSpan = Record<SUBJECT_TYPE, number>

export namespace StudyApiTypes {
  export interface getStudyProgramCoursesConfig {
    programUrl: string;
  }
  export interface getStudyProgramsConfig {
    year?: StudyOverviewYear["value"]
    degree?: DEGREE,
  }
  export interface getStudyProgramsReturn {
    programs: StudyPrograms;
    years: StudyOverviewYear[];
    currentYear: StudyOverviewYear;
  }

  export interface getStudyCourseDetailsConfig {
    courseId: string;
  }

  export interface getStudyCourseDetailsReturn {
    detail: CourseDetail;
    data: CourseSubject[];
  }
}

export namespace DataProviderTypes {
  export interface getStudyOverviewConfig extends StudyApiTypes.getStudyProgramsConfig {
    program?: StudyProgramWithUrl["id"];
  }
  export interface getStudyOverviewReturn extends StudyOverview { }

  export interface getStudyCourseDetailsConfig extends StudyApiTypes.getStudyCourseDetailsConfig { }
  export interface getStudyCourseDetailsReturn extends StudyApiTypes.getStudyCourseDetailsReturn { }

  export interface getStudyCoursesDetailsConfig {
    courses: StudyApiTypes.getStudyCourseDetailsConfig[]
  }
  export type getStudyCoursesDetailsReturn = StudyApiTypes.getStudyCourseDetailsReturn[]
}


export { DAY, DEGREE, LANGUAGE, SEMESTER, SUBJECT_TYPE, gradeAll };
export type { CourseDetail, CourseSubject, GradeKey, GradeWithoutAll, ProgramStudyCourses, StudyCourse, StudyId, StudyOverview, StudyOverviewCourse, StudyOverviewGrade, StudyOverviewYear, StudyProgram, StudyProgramWithUrl as StudyProgramBase, StudyProgramWithUrl, StudyPrograms, StudySpecialization, StudyTimeScheduleConfig };

