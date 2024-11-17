import { DAY, DEGREE, LECTURE_TYPE, SEMESTER, WEEK_PARITY } from "~/server/scraper/enums";

export default {
  course: {
    obligation: {
      compulsory: "P",
      compulsoryElective: "PV",
      elective: "V"
    },
    detail: {
      timeSpan: {
        title: "Rozsah",
        data: {
          [LECTURE_TYPE.LECTURE]: "přednášk",
          [LECTURE_TYPE.LABORATORY]: "lab",
          [LECTURE_TYPE.EXERCISE]: "cvičení",
          [LECTURE_TYPE.SEMINAR]: "seminář"
        }
      },
      day: {
        [DAY.MON]: "Po",
        [DAY.TUE]: "Út",
        [DAY.WED]: "St",
        [DAY.THU]: "Čt",
        [DAY.FRI]: "Pá"
      },
      type: {
        [LECTURE_TYPE.LECTURE]: "přednáška",
        [LECTURE_TYPE.LABORATORY]: "laboratoř",
        [LECTURE_TYPE.EXERCISE]: "cvičení",
        [LECTURE_TYPE.SEMINAR]: "seminář",
        [LECTURE_TYPE.EXAM]: "zkouška"
      },
      weeks: {
        [WEEK_PARITY.ODD]: "lichý",
        [WEEK_PARITY.EVEN]: "sudý"
      },
      popover: {
        time: "Čas",
        room: "Místnost",
        capacity: "Kapacita",
        groups: "Skupiny",
        weeks: "Týdny",
        computed: "Vypočteno",
        info: "Informace",
        detail: "Detail",
      }
    }
  },
  studyPlan: {
    "Lessons in the winter semester": "Výuka v zimním semestru",
    "Lessons in the summer semester": "Výuka v letním semestru"
  },
  menu: {
    year: {
      title: "Rok"
    },
    semester: {
      title: "Semestr",
      data: {
        [SEMESTER.WINTER]: "Zimní",
        [SEMESTER.SUMMER]: "Letní"
      }
    },
    degree: {
      title: "Titul",
      data: {
        [DEGREE.BACHELOR]: "Bakalář",
        [DEGREE.MASTER]: "Magistr",
        [DEGREE.DOCTORAL]: "Doktor"
      }
    },
    program: {
      title: "Studijní program",
    },
    grade: {
      title: "Ročník studia",
      selectToShow: "vyberte studijní program pro zobrazení"
    },
    courses: {
      title: "Předměty",
      compulsaory: "Povinné",
      voluntary: "Volitelné",
      all: "Všechny"
    },
    generate: "Generovat",
    toast: {
      languageChanged: {
        loading: "Načítám data v novém jazyce",
        success: "Data byla úspěšně načtena",
        error: "Nastala chyba při načítání dat",
        description: "Jazyk byl změněn na {{ language }}, data vyučování zůstnou stejná dokud nebudou znova generována."
      },
      generate: {
        loading: "Načítám rozvrh",
        success: "Rozvrh byl úspěšně načten",
        error: "Nastala chyba při načítání rozvrhu"
      }
    }
  },
  language: {
    cs: "Čeština",
    en: "Angličtina"
  },
  scheduler: {
    tabs: {
      workSchedule: "Pracovní rozvrh",
      resultSchedule: "Výsledný rozvrh",
      timeSpan: "Rozsahy"
    },
    timeSpan: {
      empty: "Není zvolen žádný předmět",
      hoursAWeek: "Počet hodin lekce týdně:",
      type: {
        [LECTURE_TYPE.LECTURE]: "přednášky",
        [LECTURE_TYPE.LABORATORY]: "laboratoře",
        [LECTURE_TYPE.EXERCISE]: "cvičení",
        [LECTURE_TYPE.SEMINAR]: "semináře",
        [LECTURE_TYPE.EXAM]: "zkoušky"
      },
      weekly: "{{ hours }} hod. týdně",
      weeks: "{{ weeks }} týdnů",
      selected: "vybráno {{ selected }}",
    },
    days: {
      [DAY.MON]: "Po",
      [DAY.TUE]: "Út",
      [DAY.WED]: "St",
      [DAY.THU]: "Čt",
      [DAY.FRI]: "Pá"
    }
  }
};


/*
studyPlan
course.detail.timeSpan.title
course.detail.timeSpan.data
course.detail.day
course.detail.weeks.EVEN
*/