import type { gradeAll } from "~/server/scraper/constants";
import type { DAY, DEGREE, LECTURE_TYPE, SEMESTER, WEEK_PARITY } from "~/server/scraper/enums";

/**
 * @example "program-8956", "course-xxxxx"
 */
type StudyId = string;

type StudyPrograms = Record<DEGREE, Record<StudyId, StudyProgram>>;
interface StudyProgramBase {
  name: string;
  abbreviation: string;
  url: string;
  id: StudyId;
}
interface StudyProgram extends StudyProgramBase {
  isEnglish: boolean;
  specializations: StudySpecialization[];
  attendanceType: string;
}
interface StudySpecialization extends StudyProgramBase { }

type GradeKey = string | typeof gradeAll;
interface StudyOverviewYear { value: string, label: string }
interface StudyOverviewGrade { key: GradeKey, label: string }
/**
 * For documentation refer to readme
 */
interface StudyOverview {
  /**
   * current data
   * 
   * only values that when changed should cause refetch
  */
  values: {
    year: StudyOverviewYear,
    degree: DEGREE,
    program?: StudyProgramBase,
    // grade: is loaded
    // semester is loaded
    // coureses are loaded
    // lectures are not needed
  },
  /**
   * Data coresponding to the chosen values
  */
  data: {
    years: StudyOverviewYear[],
    degrees: DEGREE[],
    programs: Record<DEGREE, StudyProgram[]>,
    grades: StudyOverviewGrade[],
    semesters: SEMESTER[],
    /**
     * All the couses for the whole degree and both semesters. "coz why not",
     * may be optimized out in the future
     * For now it's eazy to return them all for they are all at the same page.
     * makes it easy to switch between grades and semesters
     * 
     * grade > semester > type > courses
     * because pages are structured like this
    */
    courses: Record<GradeKey, Record<SEMESTER, Record<StudyCourseObligation, StudyOverviewCourse[]>>>
  }
}

type StudyCourseObligation = "compulsory" | "optional";
interface StudyOverviewCourse extends StudyProgramBase { }
interface StudyCourse extends StudyOverviewCourse {
  credits: string;
  /**
   * 1: compulsory, 0: optional
   */
  obligation: boolean;
  /**
   * type of completion
   * @example Ex, Cr+Ex
   */
  completion: string;
  faculty: string;
  note: boolean;
}
type GradeStudyCourses = Record<SEMESTER, StudyCourse[]>
type ProgramStudyCourses = Record<GradeKey, GradeStudyCourses & StudyProgramBase>

interface APICourseLecture {
  day: DAY;
  weeks: LectureWeeks;
  room: string[];
  type: LECTURE_TYPE;
  start: string;
  end: string;
  capacity: string;
  lectureGroup: string[];
  groups: string;
  info: string;
  note: string | null;
}
interface CourseLecture extends Omit<APICourseLecture, "room"> {
  room: string;
}

type LectureWeeks = {
  weeks: null;
  parity: null;
} | {
  weeks: number[];
  parity: WEEK_PARITY | null;
} | {
  weeks: string;
  parity: WEEK_PARITY | null;
}

export namespace StudyApiTypes {
  export interface getStudyTimeScheduleConfig {
    year: string | null;
  }
  export type getStudyTimeScheduleReturn = Record<SEMESTER, Date>

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
    year: StudyOverviewYear["value"];
    semester: SEMESTER;
    courseId: string;
  }


  type CourseTimeSpan = Partial<Record<LECTURE_TYPE, number>>

  interface CourseDetail {
    abbreviation: string;
    name: string;
    link: string;
    id: string;
    timeSpan: CourseTimeSpan;
  }

  export interface getStudyCourseDetailsReturn {
    detail: CourseDetail;
    data: APICourseLecture[];
  }
}

export namespace DataProviderTypes {
  export interface getStudyOverviewConfig extends StudyApiTypes.getStudyProgramsConfig {
    program?: StudyProgramBase["id"];
  }
  export interface getStudyOverviewReturn extends StudyOverview { }

  export interface getStudyCourseDetailsConfig extends StudyApiTypes.getStudyCourseDetailsConfig { }
  export interface getStudyCourseDetailsReturn {
    detail: StudyApiTypes.getStudyCourseDetailsReturn["detail"];
    data: (Omit<CourseLecture, "room"> & { room: string })[];
  }

  export interface getStudyCoursesDetailsConfig {
    courses: Omit<StudyApiTypes.getStudyCourseDetailsConfig, "year" | "semester">[]
    year: StudyOverviewYear["value"];
    semester: SEMESTER;
  }
  export type getStudyCoursesDetailsReturn = getStudyCourseDetailsReturn[]
}


export type { CourseLecture, APICourseLecture, GradeKey, ProgramStudyCourses, StudyCourse, StudyId, StudyOverview, StudyOverviewCourse, StudyOverviewGrade, StudyOverviewYear, StudyProgram, StudyProgramBase, StudyPrograms, StudySpecialization };

