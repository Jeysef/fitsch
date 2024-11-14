import { DAY, DEGREE, LECTURE_TYPE, SEMESTER, WEEK_PARITY } from "~/server/scraper/enums";
import type Schema from "./cs";

export default {
  course: {
    obligation: {
      compulsory: "C",
      compulsoryElective: "CE",
      elective: "E"
    },
    detail: {
      timeSpan: {
        title: "Time span",
        data: {
          [LECTURE_TYPE.LECTURE]: "lectur",
          [LECTURE_TYPE.LABORATORY]: "lab",
          [LECTURE_TYPE.EXERCISE]: "exercise",
          [LECTURE_TYPE.SEMINAR]: "seminar"
        }
      },
      day: {
        [DAY.MON]: "Mon",
        [DAY.TUE]: "Tue",
        [DAY.WED]: "Wed",
        [DAY.THU]: "Thu",
        [DAY.FRI]: "Fri"
      },
      type: {
        [LECTURE_TYPE.LECTURE]: "lecture",
        [LECTURE_TYPE.LABORATORY]: "laboratory",
        [LECTURE_TYPE.EXERCISE]: "exercise",
        [LECTURE_TYPE.SEMINAR]: "seminar",
        [LECTURE_TYPE.EXAM]: "exam"
      },
      weeks: {
        [WEEK_PARITY.ODD]: "odd",
        [WEEK_PARITY.EVEN]: "even"
      }
    }
  },
  studyPlan: {
    "Lessons in the winter semester": "Lessons in the winter semester",
    "Lessons in the summer semester": "Lessons in the summer semester"
  },
  menu: {
    year: {
      title: "Year"
    },
    semester: {
      title: "Semester",
      data: {
        [SEMESTER.WINTER]: "Winter",
        [SEMESTER.SUMMER]: "Summer"
      }
    },
    degree: {
      title: "Degree",
      data: {
        [DEGREE.BACHELOR]: "Bachelor",
        [DEGREE.MASTER]: "Master",
        [DEGREE.DOCTORAL]: "Doctoral"
      }
    },
    program: {
      title: "Program",
    },
    grade: {
      title: "Grade",
      selectToShow: "Select degree program to show"
    },
    courses: {
      title: "Courses",
      compulsaory: "Compulsory",
      optional: "Optional",
      all: "All"
    },
    generate: "Generate"
  },
  language: {
    cs: "Czech",
    en: "English"
  }
} satisfies typeof Schema;