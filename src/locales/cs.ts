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
      saveImage: {
        title: "Uložit jako obrázek",
        info: "Bude uložen aktuálně otevřený rozvrh",
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
    heading: "Info",
    appInfo: {
      overview: {
        title: "Info k aplikaci",
        description:
          "Vlevo je menu, kde se vybírají předměty. Data se načítají ze stránek FITu, jednotlivé bloky nemusí vždy sedět s ISVUT a realitou!",
      },
      colors: {
        title: "Barevná konvence",
        description: "Podle mobilní aplikace.",
      },
      weekParity: {
        title: "Parita týdne",
        description:
          "Červená barva rámečku značí, že je vždy v sudých kalendářních týdnech. Modrá pak značí liché kalendářní týdny.",
      },
      functionality: {
        title: "Funkčnost",
        description: [
          "Kliknutím na zaškrtávací políčko si předmět přidáte do výsedného rozvrhu.",
          "V kartě „Rozsahy“ je kontrola vyklikání všech přednášek a cvičení dle rozsahů předmětu. Nemusí to vždy fungovat spolehlivě!",
          "Rozvrh je automaticky ukládán do prohlížeče.",
          "V menu jsou tlačítka „Otevřít JSON“ a „Uložit JSON“, pomocí kterých si můžete rozvrh uložit a potom ho někomu poslat, přenést na jiné zařízení atd. Rozvrh v každém případě zůstává uložen v prohlížeči. Navíc lze rozvrh vyexportovat jako fotka.",
        ],
      },
      liabilityWarning: {
        title: "Aplikace za nic neručí!",
        description:
          "Vždy si ověřte, že vaše vybrané rozvrhové bloky skutečně jdou vybrat v <a href='https://www.vut.cz/studis/student.phtml?sn=registrace_vyucovani' target='_blank' rel='noreferrer'>registraci vyučování</a> v IS VUT.",
      },
      links: {
        title: "Odkazy",
        description: ["Pokud si chcete svůj rozvrh skládat sami, zde jsou odkazy na užitečné stránky:"],
        links: [
          {
            title: "Studijní programy",
            link: "https://www.fit.vut.cz/study/programs",
          },
          {
            title: "Seznam předmětů",
            link: "https://www.fit.vut.cz/study/courses/",
          },
          {
            title: "Časový plán",
            link: "https://www.fit.vut.cz/study/calendar",
          },
        ],
      },
      thanks: {
        title: "Poděkování",
        description:
          "Děkuji všem, kteří se podíleli na vzniku předchozí aplikace nalezitelné na „https://www.kubosh.net/apps/fitsch/“, kerá mi poskytla předlohu a přiměla mě udělat tuto aplikaci jako její náhradu.",
      },
      createdBy: {
        title: "Vytvořil:",
      },
    },
    fitInfo: {
      title: "Úvod do rozvrhů na FITu",
      description:
        "O registracích rozvrhů se všechno dozvíte na Start@FITu. Demonstraci najdete taky v <a target='_blank' rel='noreferrer' href='https://www.youtube.com/watch?v=BY0KzPEw7qc&list=PLjMy008M-9Q5ig8LKhU8_Jyt3CyLvd3hn&index=8'>tomhle videu</a>.",
      content: {
        schedule: {
          title: "Rozvrh",
          description:
            "Na VŠ fungují rozvrhy dost jinak než na střední. Neexistuje žádný jednotný rozvrh pro každý ročník. Svůj rozvrh si sestavíte sami podle předmětů, které si zapíšete.",
        },
        tuition: {
          title: "Výuka",
          description:
            "Výuka se skládá v základu z přednášek, seminářů (democvičení) a cvičení/laboratoří. Přednášky se konají typicky ve velkých přednáškovkách. Většinou jsou v jedné velké hlavní (D105, E112), kam se ale všichni nevejdou, proto jsou tu pro obě velké ještě další dvě menší, do kterých se přednáška streamuje (D0207 a D0206, E104 a E105). Proto je v rozvrhu někdy napsáno, že je přednáška v D105, D0206 a D0207. Jedna nebo obě z těch menších se nemusí vždy oteřít, otevírá se podle počtu lidí. Přednáška většinou trvá 2 nebo 3 hodiny.",
        },
        groups: {
          title: "Skupiny",
          description:
            "Prváků a druháků je moc, nevejdou se tedy na jednu přednášku. Prvák je proto rozdělen na 2 skupiny (1BIA a 1BIB) a všechny povinné předměty mají dva termíny přednášky. Je zcela na vás, jaký z nich si vyberete (a jak to nakombinujete s ostatními přednáškami, cvičeními, pauzami na oběd...). Technicky jsou skupiny rozděleny podle jména, ale to neřešte! Vyberte si, jak potřebujete.",
        },
        timeSpan: {
          title: "Rozsahy",
          description:
            "Každý předmět má svůj rozsah přednášek. Semestr má 13 týdnů. Pokud má předmět rozsah přednášek 39 hodin, vychází to na 39 / 13 = 3 hodiny přednášky za týden.",
        },
        splitedLectures: {
          title: "Rozdělené přednášky",
          description:
            "Většinou jsou přednášky tříhodinové bloky. Občas jsou některé ale řízlé na 2 + 1 hodinu. Pamatujte ale, že přednášky mají dvě skupiny (1BIA a 1BIB). V těchto případech (pouze) si musíte dávat pozor, abyste si vybrali dvouhodinový a jednohodinový blok, které sedí do stejné skupiny.",
        },
        demoLectures: {
          title: "Democvičení / Seminář",
          description:
            "Seminář (democvičení) je trochu jiná přednáška, kde přednášející praktičtěji demonstruje vyučovanou látku, např. počítá příklady. K tabuli se tady nechodí",
        },
        exercises: {
          title: "Cvičení",
          description: `Cvičení (a laboratoře) se odehrávají v učebnách po cca 20–50 lidech. Někdy bývají každý týden, někdy každý druhý týden a někdy jen v konkrétních týdnech výuky. Odhadnout to lze tak, že se podíváte do rozsahů, kolik má být hodin cvičení celkem a vydělíte to délkou bloku. Pokud vám vyjde ±13, pravděpodobně bude cviko ±každý týden. Termíny cvičení jsou vypsané na kartě předmětu a v <a target='_blank' rel='noreferrer' href="https://www.vut.cz/studis/student.phtml?sn=registrace_vyucovani">registraci vyučování</a> v IS VUT, kde si je taky budete muset zaregistrovat. Když vám to nevyjde, musíte si rozvrh překopat.`,
        },
      },
      welcome: "Welcome to FIT! It takes a lot but it's worth it.",
      ask: "Pokud něčemu nebudete rozumět, nebojte se <a href='https://su.fit.vut.cz/kontakt' target='_blank' rel='noreferrer'>zeptat</a>!",
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
