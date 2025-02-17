import { DAY, DEGREE, LECTURE_TYPE, OBLIGATION, SEMESTER, WEEK_PARITY } from "~/server/scraper/enums";
import type Schema from "./cs";

export default {
  course: {
    detail: {
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
        hide: "Hide",
        unhide: "Unhide",
      },
      customAction: {
        edit: "Edit event",
        delete: "Delete",
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
          "The language has been changed to {{ language }}, the lecture data will remain the same until they are loaded again.",
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
      importJson: {
        title: "Import JSON",
        error: "Error occurred while importing data",
        errorDescription: "Check if the file is in the correct format. More information in the console",
      },
      generate: {
        next: "Generate next",
        previous: "Generate previous",
        generating: "Generating...",
        warning: "Generating will unselect the current selection",
        couldNotGenerate: "Could not generate a valid schedule. Try again or adjust your course selection.",
      },
      addCustomEvent: {
        trigger: "Add custom event",
        title: "Add Custom Event",
        form: {
          title: "Event title",
          info: "Event details",
          day: "Day",
          dayPlaceholder: "Select day",
          start: "Start time",
          end: "End time",
          cancel: "Cancel",
          submit: "Add event",
          edit: "Edit event",
          errors: {
            titleRequired: "Event title is required",
            endBeforeStart: "End time must be after start time",
            outsideAllowedRange: "Time must be within allowed schedule hours",
          },
        },
      },
      saveImage: {
        title: "Save as image",
        info: "The currently open schedule will be saved",
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
    heading: "Info",
    appInfo: {
      overview: {
        title: "Application Info",
        description:
          "The menu on the left is where you select items. The data is loaded from the FIT website, the individual blocks may not always match ISVUT and reality!",
      },
      colors: {
        title: "Color convention",
        description: "According to the mobile app.",
      },
      weekParity: {
        title: "WeekParity",
        description:
          "The red color of the box indicates that it is always in even calendar weeks. Blue indicates odd calendar weeks.",
      },
      functionality: {
        title: "functionality",
        description: [
          "Click on the checkbox to add the item to the master schedule.",
          "In the 'Scopes' tab, there is a check to check off all lectures and labs by course scope. It may not always work reliably!",
          "Rozvrh je automaticky ukládán do prohlížeče.",
          "V menu jsou tlačítka „Otevřít JSON“ a „Uložit JSON“, pomocí kterých si můžete rozvrh uložit a potom ho někomu poslat, přenést na jiné zařízení atd. Rozvrh v každém případě zůstává uložen v prohlížeči. Navíc lze rozvrh vyexportovat jako fotka.",
        ],
      },
      liabilityWarning: {
        title: "The application does not guarantee anything!",
        description:
          "Always check that your selected schedule blocks can actually be selected in <a href='https://www.vut.cz/studis/student.phtml?sn=registrace_vyucovani' target='_blank' rel='noreferrer noopener'>registration of classes</a> in the BUT IS.",
      },
      links: {
        title: "Links",
        description: ["If you want to create your own schedule, here are links to useful sites:"],
        links: [
          {
            title: "Study programs",
            link: "https://www.fit.vut.cz/study/programs",
          },
          {
            title: "List of courses",
            link: "https://www.fit.vut.cz/study/courses/",
          },
          {
            title: "Timetable",
            link: "https://www.fit.vut.cz/study/calendar",
          },
        ],
      },
      thanks: {
        title: "Acknowledgements",
        description:
          "I would like to thank everyone who contributed to the creation of the previous application found at 'https://www.kubosh.net/apps/fitsch/', who provided me with the template and made me create this application as its replacement.",
      },
      createdBy: {
        title: "Created by:",
      },
    },
    fitInfo: {
      title: "Introduction to scheduling at FIT",
      description:
        "You can learn all about schedule registrations at Start@FIT. You can also find a demonstration in <a target='_blank' rel='noreferrer noopener' href='https://www.youtube.com/watch?v=BY0KzPEw7qc&list=PLjMy008M-9Q5ig8LKhU8_Jyt3CyLvd3hn&index=8'>this video</a>.",
      content: {
        schedule: {
          title: "Schedule",
          description:
            "Schedules work quite differently in college than in high school. There is no single timetable for each year. You make your own timetable according to the subjects you enrol in.",
        },
        tuition: {
          title: "tuition",
          description:
            "The teaching consists basically of lectures, seminars (demos) and exercises/labs. Lectures are typically held in large lecture halls. Usually they are in one big main one (D105, E112), but not everyone can fit in it, so there are two other smaller ones for the two big ones, where the lecture streams into (D0207 and D0206, E104 and E105). That's why the schedule sometimes says that the lecture is in D105, D0206 and D0207. One or both of the smaller ones don't always open, they open according to the number of people. The lecture usually lasts 2 or 3 hours",
        },
        groups: {
          title: "groups",
          description:
            "There are too many freshmen and sophomores to fit into one class. Therefore, freshman are divided into 2 groups (1BIA and 1BIB) and all required courses have two lecture dates. It is entirely up to you which one you choose (and how you combine it with other lectures, exercises, lunch breaks...). Technically the groups are divided by name, but don't worry about that! Choose as you need to.",
        },
        timeSpan: {
          title: "ranges",
          description:
            "Each course has a range of lectures. The semester has 13 weeks. If a course has a lecture range of 39 hours, this works out to 39 / 13 = 3 hours of lecture per week.",
        },
        splitedLectures: {
          title: "Split Lectures",
          description:
            "Usually lectures are three-hour blocks. Occasionally, some are cut into 2 + 1 hours. But remember that the lectures have two groups (1BIA and 1BIB). In these cases (only) you have to be careful to choose a two-hour and a one-hour block that sit in the same group",
        },
        demoLectures: {
          title: "Demo Exercise / Seminar",
          description:
            "A seminar (demo exercise) is a slightly different lecture, where the lecturer demonstrates the material being taught in a more practical way, e.g. calculates examples. You don't go to the blackboard here",
        },
        exercises: {
          title: "Exercises",
          description: `Exercises (and laboratories) take place in classrooms of about 20–50 people. Sometimes they are every week, sometimes every other week, and sometimes only in specific weeks of teaching. You can estimate this by looking at the ranges for how many hours of exercises should be in total and dividing it by the length of the block. If you get ±13, there will probably be an exercise ±every week. The dates of the exercises are listed on the course card and in the <a target='_blank' rel='noreferrer noopener' href="https://www.vut.cz/studis/student.phtml?sn=registrace_vyucovani">lecture registration</a> in the BUT IS, where you will also have to register them. If you don't manage to do so, you will have to change your schedule.`,
        },
      },
      welcome: "Welcome to FIT! It takes a lot but it's worth it.",
      ask: "If you don't understand something, don't be afraid to <a href='https://su.fit.vut.cz/kontakt' target='_blank' rel='noreferrer noopener'>ask</a>!",
    },
  },
  error: {
    tryAgain: "Try again",
    purgeAndReload: "If the error persists, clear the local storage and reload the page",
  },
  schedulerProvider: {
    importFromLocalStorage: {
      error: "Failed to load data from JSON",
      errorDescription: "Check if the file is in the correct format. More information in the console",
      clearLocalStorageAction: "Clear local storage",
    },
  },
} satisfies typeof Schema;
