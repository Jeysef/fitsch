import { DAY, DEGREE, LECTURE_TYPE, OBLIGATION, SEMESTER, WEEK_PARITY } from "~/server/scraper/enums";

export default {
  course: {
    detail: {
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
      popover: {
        time: "Čas",
        room: "Místnost",
        capacity: "Kapacita",
        groups: "Skupiny",
        weeks: "Týdny",
        computed: "Vypočteno",
        info: "Informace",
        detail: "Detail",
      },
      customAction: {
        edit: "Upravit událost",
        delete: "Odstranit",
      },
    },
  },
  studyPlan: {
    "Lessons in the winter semester": "Výuka v zimním semestru",
    "Lessons in the summer semester": "Výuka v letním semestru",
  },
  menu: {
    year: {
      title: "Rok",
    },
    semester: {
      title: "Semestr",
      data: {
        [SEMESTER.WINTER]: "Zimní",
        [SEMESTER.SUMMER]: "Letní",
      },
    },
    degree: {
      title: "Titul",
      data: {
        [DEGREE.BACHELOR]: "Bakalář",
        [DEGREE.MASTER]: "Magistr",
        [DEGREE.DOCTORAL]: "Doktor",
      },
    },
    program: {
      title: "Studijní program",
    },
    grade: {
      title: "Ročník studia",
      selectToShow: "vyberte studijní program pro zobrazení",
    },
    courses: {
      title: "Předměty",
      [OBLIGATION.COMPULSORY]: "Povinné",
      [OBLIGATION.COMPULSORY_ELECTIVE]: "Povinně volitelné",
      [OBLIGATION.ELECTIVE]: "Volitelné",
      all: "Všechny",
    },
    load: "Načíst",
    toast: {
      languageChanged: {
        loading: "Načítám data v novém jazyce",
        success: "Data byla úspěšně načtena",
        error: "Nastala chyba při načítání dat",
        description: "Jazyk byl změněn na {{ language }}, data vyučování zůstnou stejná dokud nebudou znova načtena.",
      },
      generate: {
        loading: "Načítám rozvrh",
        success: "Rozvrh byl úspěšně načten",
        error: "Nastala chyba při načítání rozvrhu",
      },
    },
    actions: {
      title: "Akce",
      exportJson: "Exportovat JSON",
      importJson: {
        title: "Importovat JSON",
        error: "Nepodařilo se načíst data z JSON",
        errorDescription: "Zkontrolujte zda je soubor ve správném formátu. více informací v konzoli",
      },
      generate: {
        next: "Generovat další",
        previous: "Generovat předchozí",
        generating: "Generuji...",
        warning: "Generování zruší stávající výběr",
        couldNotGenerate: "Nepodařilo se vygenerovat platný rozvrh. Zkuste to znovu nebo upravte výběr předmětů.",
      },
      addCustomEvent: {
        trigger: "Přidat vlastní událost",
        title: "Přidat vlastní událost",
        form: {
          title: "Název události",
          day: "Den",
          dayPlaceholder: "Vyberte den",
          info: "Detaily",
          start: "Čas začátku",
          end: "Čas konce",
          cancel: "Zrušit",
          submit: "Přidat událost",
          edit: "Upravit událost",
          errors: {
            titleRequired: "Název události je povinný",
            endBeforeStart: "Čas konce musí být po času začátku",
            outsideAllowedRange: "Čas musí být v rámci povolených hodin rozvrhu",
          },
        },
      },
    },
  },
  header: {
    install: "Nainstalovat aplikaci",
  },
  language: {
    cs: "Čeština",
    en: "Angličtina",
  },
  scheduler: {
    tabs: {
      workSchedule: "Pracovní rozvrh",
      resultSchedule: "Výsledný rozvrh",
      timeSpan: "Rozsahy",
    },
    timeSpan: {
      empty: "Není zvolen žádný předmět",
      hoursAWeek: "Počet hodin lekce týdně:",
      type: {
        [LECTURE_TYPE.LECTURE]: "přednášky",
        [LECTURE_TYPE.LABORATORY]: "laboratoře",
        [LECTURE_TYPE.EXERCISE]: "cvičení",
        [LECTURE_TYPE.SEMINAR]: "semináře",
        [LECTURE_TYPE.EXAM]: "zkoušky",
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
      [DAY.FRI]: "Pá",
    },
  },
  error: {
    tryAgain: "Zkusit znova",
    purgeAndReload: "Pokud chyba přetrvává, vymaže lokální úložiště a znovu načtěte stránku",
  },
  info: {
    appInfo: {
      title: "Info k aplikaci",
      overview: {
        title: "Přehled",
        description:
          "Vlevo je menu, kde se vybírají předměty, ročníky, atd. Data s rozvrahem se načítají ze stránek FITu z karet předmětů, tyto termíny nemusí vždy sedět s realitou nebo studisem. Některé data jsou doplňovány pro lepší přehlednost, např. týdny lekci nebo parita. (to lze najít v infu k lekci)",
      },
      schedule: {
        title: "Lekce",
        colors: "",
        lectures: "",
      },
    },
    fitInfo: {
      title: "FIT info",
      description: "Pro prváky.",
      content: {
        schedule: {
          title: "Rozvrh",
          description:
            "Jak už jste si asi všimli, tak na vejšce fungujou rozvrhy trochu jinak než na střední. Není žádnej jednotnej rozvrh pro každej ročník. Ale každý student si rozvrh sestavuje sám podle předmětů, které má zapsané a jak má čas.",
        },
        tuition: {
          title: "Výuka",
          description:
            "Výuka se skládá v základu z přednášek, democvičení a cvičení. Přednášky se konají v přednáškovnách, to jsou ty velké místnosti. Většinou v jedné velké hlavní (D105, E112), kam se ale šici nevejdou, proto jsou tu pro každou hlavní další dvě menší, kde se přednáška streamuje (D0207 a D0206, E104 a E105). Proto je např. v rozvrhu napsáno, že je přednáška v D105, D0206 a D0207. Jedna nebo obě z těch měnších se nemusí vždy oteřít, otevírá se podle počtu lidí co příjde. Přednáška trvá 2 nebo 3 hodiny.",
        },
        groups: {
          title: "Skupiny",
          description:
            "Jelikož se celý ročník nevejde na jednu přednášku (ani s přídavnejma menšíma přednáškovnama), tak je ročník rozdělen na 2 skupiny (1BIA a 1BIB) a každá má svou přednášku v týdnu. Proto je v týdnu přednáška od jednoho předmětu například 2x. A na vás je jakou si vyberete a jak to nakombinujete s ostatníma přednáškama, cvičeníma, pauzou na oběd a aby nevznikly kolize. To jaká je kdo skupina neřešte.",
        },
        timeSpan: {
          title: "Rozsahy",
          description:
            "Každý předmět má svůj rozsah přednášek. Semestr má 13 týdnů takže pokud má předmět rozsah přednášek 39 hodin, tak 39 / 13 = 3 hodiny přednášky za týden. Buď jsou přednášky tříhodinové bloky nebo 2 hodiny někdy a hodina jindy.",
        },
        demoLectures: {
          title: "Democvičení",
          description:
            "Democvičení je vylepšená přednáška kde přednášející ukazuje IRL vyučovanou látku např. počítá příklady (k tabuli se tady nechodí).",
        },
        exercises: {
          title: "Cvičení",
          description: `Cvičení se odehrávají v učebnách po cca 20 - 50 lidech. Na PC nebo v laboratořích atd. podle předmětu. Kolik jich má být za týden lze zjistit opět z rozsahu tak že se sečte "všechno ostatní" (většinou aby to bylo prostě dělitelný 13, je to tak různě nafixlovaný aby to sedělo papírově) a vydělí 13. Termíny cvičení jsou vypsané na stránkách předmětu ale je nutné si ho pak ve wisu zaregistrovat. Když vám to nevyjde musíte si rozvrh překopat. Cvičení většinou bývaj 2 hodiny týdně. Někdy to co je na stránkách předmětu vůbec nesouhlasí s wisem, ale... wis má vždycky pravdu.`,
        },
      },
    },
  },
  schedulerProvider: {
    importFromLocalStorage: {
      error: "Nepodařilo se načíst data z JSON",
      errorDescription: "Zkontrolujte zda je soubor ve správném formátu. více informací v konzoli",
      clearLocalStorageAction: "Vymazat lokální úložiště",
    },
  },
};

/*
studyPlan
course.detail.timeSpan.title
course.detail.timeSpan.data
course.detail.day
course.detail.weeks.EVEN
*/
