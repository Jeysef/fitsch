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
type Grade = GradeWithoutAll | GradeAll;
type GradeKey = string | GradeAll;


interface StudyOverviewYear { value: string, label: string }
interface StudyOverviewGrade { key: GradeKey, label: Grade }
interface StudyOverviewCourse {
  name: string;
  abbreviation: string;
  id: number;
}
interface StudyOverview {
  /**
   * current data
   * 
   * only values that when changed should cause refetch
   */
  values: {
    year: StudyOverviewYear,
    degree: DEGREE,
    specialization?: StudySpecialization,
  },
  /**
   * Data coresponding to the chosen values
   */
  data: {
    years: StudyOverviewYear[],
    semesters: SEMESTER[],
    degrees: DEGREE[],
    grades: StudyOverviewGrade[],
    specializations: Record<DEGREE, StudySpecialization[]>,
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


type ProgramStudyCourses = Record<GradeKey, GradeStudyCourses & StudyProgramBase>
type GradeStudyCourses = Record<SEMESTER, StudyCourse[]>
interface StudyCourse {
  abbreviation: string;
  name: string;
  link: string;
  id: number;
  credits: string;
  obligation: boolean;
  completion: string;
  faculty: string;
  note: boolean;
}

interface StudyTimeScheduleConfig {
  year: string | number | null;
}

interface CourseDetail {
  abbreviation: string;
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

export namespace StudyApiTypes {
  export interface getStudyProgramCoursesConfig {
    programUrl: string;
  }
  export interface getStudyProgramsConfig {
    year: StudyOverviewYear["value"]
    degree: DEGREE,
  }
  export interface getStudyProgramsReturn {
    programs: StudyPrograms;
    years: StudyOverviewYear[];
    currentYear: StudyOverviewYear;
  }
}

export namespace DataProviderTypes {
  export interface getStudyOverviewConfig extends StudyApiTypes.getStudyProgramsConfig {
    specializationId: StudySpecialization["id"];
    isEnglish?: boolean
  }
}


export { COURSE_TYPE, DAY, DEGREE, LANGUAGE, SEMESTER, gradeAll };
export type { CourseDetail, Grade, GradeKey, GradeWithoutAll, ProgramStudyCourses, StudyCourse, StudyId, StudyOverview, StudyOverviewCourse, StudyOverviewGrade, StudyOverviewYear, StudyProgram, StudyProgramWithUrl as StudyProgramBase, StudyProgramWithUrl, StudyPrograms, StudySpecialization, StudyTimeScheduleConfig };

