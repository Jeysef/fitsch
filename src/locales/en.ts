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
      },
      popover: {
        time: "Time",
        room: "Room",
        capacity: "Capacity",
        groups: "Groups",
        weeks: "Weeks",
        computed: "Computed",
        info: "Information",
        detail: "Detail",
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
      voluntary: "Voluntary",
      all: "All"
    },
    generate: "Generate",
    toast: {
      languageChanged: {
        loading: "Loading data in new language",
        success: "Data was successfully loaded",
        error: "An error occurred while loading data",
        description: "The language has been changed to {{ language }}, the lecture data will remain the same until they are regenerated."
      },
      generate: {
        loading: "Loading schedule",
        success: "Schedule was successfully loaded",
        error: "An error occurred while loading schedule"
      }
    }
  },
  language: {
    cs: "Czech",
    en: "English"
  },
  scheduler: {
    tabs: {
      workSchedule: "Work schedule",
      resultSchedule: "Result schedule",
      timeSpan: "Time spans"
    },
    timeSpan: {
      empty: "No course selected",
      hoursAWeek: "Number of lecture hours per week:",
      type: {
        [LECTURE_TYPE.LECTURE]: "lecture",
        [LECTURE_TYPE.LABORATORY]: "laboratory",
        [LECTURE_TYPE.EXERCISE]: "exercise",
        [LECTURE_TYPE.SEMINAR]: "seminar",
        [LECTURE_TYPE.EXAM]: "exam"
      },
      weekly: "{{ hours }} hours/week",
      weeks: "{{ weeks }} weeks",
      selected: "selected {{ selected }}"
    },
    days: {
      [DAY.MON]: "Mon",
      [DAY.TUE]: "Tue",
      [DAY.WED]: "Wed",
      [DAY.THU]: "Thu",
      [DAY.FRI]: "Fri"
    }
  }
} satisfies typeof Schema;