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

interface StudySpecialization {
  abbreviation: string;
  name: string;
  url: string;
}

interface StudyPrograms {
  [DEGREE.BACHELOR]: StudyProgram[];
  [DEGREE.MASTER]: StudyProgram[];
  [DEGREE.DOCTORAL]: StudyProgram[];
}

interface StudyProgram {
  name: string;
  url: string;
  isEnglish?: boolean;
  specializations: StudySpecialization[];
  attendanceType: string;
}

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
  year: string, // value
  degree: DEGREE,
}

type Grade = string | "ALL";

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
    courses: { [G in Grade]: { [S in SEMESTER]: { [T in "compulsory" | "optional"]: StudyOverviewCourse[] } } },
  }
}


type StudyCourses = {
  [year: number]: {
    [semester in SEMESTER]: StudyCourse[];
  }
  allYear?: StudyCourse[];
};
type StudyYear = keyof StudyCourses;


export { COURSE_TYPE, DEGREE, LANGUAGE, SEMESTER };
export type { Grade, StudyCourse, StudyCourses, StudyOverview, StudyOverviewConfig, StudyProgram, StudyPrograms, StudySpecialization, StudyYear };

