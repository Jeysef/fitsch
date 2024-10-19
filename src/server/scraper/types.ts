import type { gradeAll } from "~/server/scraper/constants";
import type { DAY, DEGREE, SEMESTER, SUBJECT_TYPE } from "~/server/scraper/enums";

/**
 * @example "program-8956", "course-xxxxx"
 */
type StudyId = string;

type StudyPrograms = Record<DEGREE, Record<StudyId, StudyProgram>>;
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

type GradeKey = string | typeof gradeAll;
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
      // TODO: StudyOverviewCourse -> StudyOverviewCourse with url
      [grade: GradeKey]: { [S in SEMESTER]: { [T in "compulsory" | "optional"]: StudyOverviewCourse[] } },
    }
  }
}

interface StudyOverviewCourse extends StudyProgramBase { }
interface StudyCourse extends StudyOverviewCourse {
  url: string;
  credits: string;
  obligation: boolean;
  completion: string;
  faculty: string;
  note: boolean;
}
type GradeStudyCourses = Record<SEMESTER, StudyCourse[]>
type ProgramStudyCourses = Record<GradeKey, GradeStudyCourses & StudyProgramBase>



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


export type { CourseDetail, CourseSubject, GradeKey, ProgramStudyCourses, StudyCourse, StudyId, StudyOverview, StudyOverviewCourse, StudyOverviewGrade, StudyOverviewYear, StudyProgram, StudyProgramWithUrl as StudyProgramBase, StudyPrograms, StudyProgramWithUrl, StudySpecialization, StudyTimeScheduleConfig };

