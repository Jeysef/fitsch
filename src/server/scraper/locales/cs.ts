import { DAY, LECTURE_TYPE, WEEK_PARITY } from "~/server/scraper/enums";

export default {
  course: {
    obligation: {
      compulsory: "P",
      compulsoryElective: "PV",
      elective: "V",
    },
    detail: {
      timeSpan: {
        title: "Rozsah",
        data: {
          [LECTURE_TYPE.LECTURE]: "přednášk",
          [LECTURE_TYPE.LABORATORY]: "lab",
          [LECTURE_TYPE.EXERCISE]: "cvičení",
          [LECTURE_TYPE.SEMINAR]: "seminář",
        },
      },
      day: {
        [DAY.MON]: "Po",
        [DAY.TUE]: "Út",
        [DAY.WED]: "St",
        [DAY.THU]: "Čt",
        [DAY.FRI]: "Pá",
      },
      type: {
        [LECTURE_TYPE.LECTURE]: "přednáška",
        [LECTURE_TYPE.LABORATORY]: "laboratoř",
        [LECTURE_TYPE.EXERCISE]: "cvičení",
        [LECTURE_TYPE.SEMINAR]: "seminář",
        [LECTURE_TYPE.EXAM]: "zkouška",
      },
      weeks: {
        [WEEK_PARITY.ODD]: "lichý",
        [WEEK_PARITY.EVEN]: "sudý",
      },
    },
  },
  studyPlan: {
    "Lessons in the winter semester": "Výuka v zimním semestru",
    "Lessons in the summer semester": "Výuka v letním semestru",
  },
};
