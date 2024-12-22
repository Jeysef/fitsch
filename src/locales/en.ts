import { DAY, DEGREE, LECTURE_TYPE, OBLIGATION, SEMESTER, WEEK_PARITY } from "~/server/scraper/enums";
import type Schema from "./cs";

export default {
  course: {
    obligation: {
      compulsory: "C",
      compulsoryElective: "CE",
      elective: "E",
    },
    detail: {
      timeSpan: {
        title: "Time span",
        data: {
          [LECTURE_TYPE.LECTURE]: "lectur",
          [LECTURE_TYPE.LABORATORY]: "lab",
          [LECTURE_TYPE.EXERCISE]: "exercise",
          [LECTURE_TYPE.SEMINAR]: "seminar",
        },
      },
      day: {
        [DAY.MON]: "Mon",
        [DAY.TUE]: "Tue",
        [DAY.WED]: "Wed",
        [DAY.THU]: "Thu",
        [DAY.FRI]: "Fri",
      },
      type: {
        [LECTURE_TYPE.LECTURE]: "lecture",
        [LECTURE_TYPE.LABORATORY]: "laboratory",
        [LECTURE_TYPE.EXERCISE]: "exercise",
        [LECTURE_TYPE.SEMINAR]: "seminar",
        [LECTURE_TYPE.EXAM]: "exam",
      },
      weeks: {
        [WEEK_PARITY.ODD]: "odd",
        [WEEK_PARITY.EVEN]: "even",
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
      },
    },
  },
  studyPlan: {
    "Lessons in the winter semester": "Lessons in the winter semester",
    "Lessons in the summer semester": "Lessons in the summer semester",
  },
  menu: {
    year: {
      title: "Year",
    },
    semester: {
      title: "Semester",
      data: {
        [SEMESTER.WINTER]: "Winter",
        [SEMESTER.SUMMER]: "Summer",
      },
    },
    degree: {
      title: "Degree",
      data: {
        [DEGREE.BACHELOR]: "Bachelor",
        [DEGREE.MASTER]: "Master",
        [DEGREE.DOCTORAL]: "Doctoral",
      },
    },
    program: {
      title: "Program",
    },
    grade: {
      title: "Grade",
      selectToShow: "Select degree program to show",
    },
    courses: {
      title: "Courses",
      [OBLIGATION.COMPULSORY]: "Compulsory",
      [OBLIGATION.COMPULSORY_ELECTIVE]: "Compulsory elective",
      [OBLIGATION.ELECTIVE]: "Elective",
      all: "All",
    },
    load: "Load",
    toast: {
      languageChanged: {
        loading: "Loading data in new language",
        success: "Data was successfully loaded",
        error: "An error occurred while loading data",
        description:
          "The language has been changed to {{ language }}, the lecture data will remain the same until they are regenerated.",
      },
      generate: {
        loading: "Loading schedule",
        success: "Schedule was successfully loaded",
        error: "An error occurred while loading schedule",
      },
    },
    actions: {
      title: "Actions",
      exportJson: "Export JSON",
      importJson: "Import JSON",
      generate: {
        next: "Generate next",
        previous: "Generate previous",
        generating: "Generating...",
        warning: "Generating will unselect the current selection",
      },
    },
  },
  header: {
    install: "Install application",
  },
  language: {
    cs: "Czech",
    en: "English",
  },
  scheduler: {
    tabs: {
      workSchedule: "Work schedule",
      resultSchedule: "Result schedule",
      timeSpan: "Time spans",
    },
    timeSpan: {
      empty: "No course selected",
      hoursAWeek: "Number of lecture hours per week:",
      type: {
        [LECTURE_TYPE.LECTURE]: "lecture",
        [LECTURE_TYPE.LABORATORY]: "laboratory",
        [LECTURE_TYPE.EXERCISE]: "exercise",
        [LECTURE_TYPE.SEMINAR]: "seminar",
        [LECTURE_TYPE.EXAM]: "exam",
      },
      weekly: "{{ hours }} hours/week",
      weeks: "{{ weeks }} weeks",
      selected: "selected {{ selected }}",
    },
    days: {
      [DAY.MON]: "Mon",
      [DAY.TUE]: "Tue",
      [DAY.WED]: "Wed",
      [DAY.THU]: "Thu",
      [DAY.FRI]: "Fri",
    },
  },
  info: {
    appInfo: {
      title: "Application Info",
      overview: {
        title: "Overview",
        description:
          "The menu on the left allows you to select courses, years, etc. Schedule data is loaded from the FIT website's course pages; these times may not always align with reality or the student system. Some data are added for clarity, such as lesson weeks or parity (found in the lesson info).",
      },
      schedule: {
        title: "Lessons",
        colors: "",
        lectures: "",
      },
    },
    fitInfo: {
      title: "FIT Info",
      description: "For freshmen.",
      content: {
        schedule: {
          title: "Schedule",
          description:
            "As you've probably noticed, university schedules work a bit differently than in high school. There's no unified schedule for each year; instead, each student composes their own schedule based on the courses they're enrolled in and their availability.",
        },
        tuition: {
          title: "Tuition",
          description:
            "Classes consist mainly of lectures, demo exercises, and exercises. Lectures are held in large lecture halls, usually one main hall (D105, E112) that can't accommodate everyone. Therefore, for each main hall, there are two smaller rooms where the lecture is streamed (D0207 and D0206, E104 and E105). For example, the schedule might list a lecture in D105, D0206, and D0207. One or both of the smaller rooms may not open, depending on attendance. Lectures last 2 or 3 hours.",
        },
        groups: {
          title: "Groups",
          description:
            "Since the entire year can't fit into one lecture hall (even with additional smaller rooms), the year is divided into two groups (1BIA and 1BIB), each with its own lecture during the week. Therefore, a course might have lectures twice a week. You choose which one to attend and how to schedule it with other lectures, exercises, lunch breaks, avoiding conflicts. Don't worry about which group you're officially in.",
        },
        timeSpan: {
          title: "Time Spans",
          description:
            "Each course has a specific number of lecture hours. A semester has 13 weeks, so if a course has 39 lecture hours, that's 39 / 13 = 3 hours of lectures per week. Lectures might be in three-hour blocks or split into 2 hours one day and 1 hour another.",
        },
        demoLectures: {
          title: "Demo Exercises",
          description:
            "Demo exercises are enhanced lectures where the instructor demonstrates the material in practice, such as solving problems (students don't go to the board here).",
        },
        exercises: {
          title: "Exercises",
          description: `Exercises take place in classrooms with about 20–50 students, on PCs or in labs, depending on the course. To find out how many hours per week, add up "everything else" from the total course hours (adjusted to be divisible by 13) and divide by 13. Exercise times are listed on the course pages, but you need to register for them in WIS. If the times don't work for you, you'll need to adjust your schedule. Exercises are usually 2 hours per week. Sometimes the course page doesn't match WIS, but... WIS is always correct.`,
        },
      },
    },
  },
  error: {
    tryAgain: "Try again",
  },
} satisfies typeof Schema;
