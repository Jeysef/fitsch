import { fromURL } from "cheerio";
import { ObjectTyped } from "object-typed";
import type { LanguageProvider } from "~/server/scraper/languageProvider";
import { COURSE_TYPE, DEGREE, SEMESTER, type CourseDetail, type DAY, type Program, type StudyCourse, type StudyCourses, type StudyOverviewConfig, type StudyPrograms, type StudySpecialization, type StudyTimeScheduleConfig, type StudyYear } from "~/server/scraper/types";

export class StudyApi {
  private readonly baseUrl = 'https://www.fit.vut.cz/study/'
  private _languageSet: Awaited<typeof this.languageProvider.languageSet> | undefined;
  constructor(private readonly languageProvider: LanguageProvider) { }

  private getLanguageSet = async () => {
    if (this._languageSet) return this._languageSet
    this._languageSet = await this.languageProvider.languageSet
    return this._languageSet
  }

  private fetchDocument(url: string) {
    return fromURL(url)
  }

  private get urlLanguage() {
    return `.${this.languageProvider.language}`
  }

  getTimeSchedule = async (config: StudyTimeScheduleConfig = { year: null }) => {
    const { year } = config
    const languageSet = await this.getLanguageSet();
    const calendarUrl = `${this.baseUrl}calendar/${year ? `${year}/` : ""}${this.urlLanguage}`;
    const $ = await this.fetchDocument(calendarUrl);
    const timeSchedule: Record<SEMESTER, Date> = {} as Record<SEMESTER, Date>;
    const dates = $("main .grid .grid__cell").filter(":has(.c-schedule__subtitle)").map((_, element) => {
      // const title = $(element).find(".c-schedule__subtitle").text().trim();
      const date = $(element).find("ul.c-schedule__list li.c-schedule__item")
        .filter((_, element) => (Object.values(languageSet.studyPlan).some((text) => $(element).find(".c-schedule__label").text().includes(text))))
        .children(".c-schedule__time").children("time").first().attr("datetime")
      return date
    }).get().slice(0, 2) as [string, string]
    return ObjectTyped.fromEntries(Object.values(SEMESTER).map((semester, index) => [semester, new Date(dates[index])]))
  }

  /**
   * This function was generated by AI, but it's fairly tested and should work
   */
  getWeekNumberInMonth(date: Date) {
    // Clone the date object to avoid modifying the original
    const currentDate = new Date(date);

    // Get the first day of the month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the day of the week for the first day (0-6, where 0 is Monday, 6 is Sunday)
    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    // Calculate the date of the Monday of the first week
    const firstMonday = new Date(firstDayOfMonth);
    firstMonday.setDate(firstMonday.getDate() - firstDayOfWeek);

    // Calculate the difference in days and divide by 7 to get the week number
    // @ts-expect-error - this is a valid operation
    const daysDifference = (currentDate - firstMonday) / (24 * 60 * 60 * 1000);
    return Math.floor(daysDifference / 7) + 1;
  }

  async getStudyPrograms(config: StudyOverviewConfig | null) {
    const { degree, year } = config ?? { degree: null, year: null }
    const urlTypeDegrees = {
      [DEGREE.BACHELOR]: 'B',
      [DEGREE.MASTER]: 'N',
      [DEGREE.DOCTORAL]: 'D',
    }

    const elementIdDegrees = {
      "bc": DEGREE.BACHELOR,
      "mgr": DEGREE.MASTER,
      "dr": DEGREE.DOCTORAL,
    }
    const degreeQuery = degree ? `degree=${urlTypeDegrees[degree]}` : ""
    const yearQuery = year ? `year=${year}` : ""
    const queryStr = [degreeQuery, yearQuery].filter(Boolean).join("&")

    const programsUrl = `${this.baseUrl}programs/${this.urlLanguage}${queryStr ? `?${queryStr}` : ""}`;
    const $ = await this.fetchDocument(programsUrl)

    const programs: StudyPrograms = ObjectTyped.fromEntries(Object.values(DEGREE).map((id) => [id, []]));
    $("body main .c-programs").each((_, element) => {
      const studyDegree = elementIdDegrees[$(element).attr('id') as keyof typeof elementIdDegrees];
      $(element).find('.c-programmes__list li.c-programmes__item').each((_, element) => {
        let specialization: StudySpecialization[] = [];
        $(element).find('.b-programme .c-branches ul.c-branches__list li.c-branches__item').each((ind, element) => {
          const titleEl = $(element).find('.b-branch .b-branch__title')
          const abbreviation = titleEl.children('.tag').text().trim();
          const name = titleEl.children('a').text().trim();
          const url = titleEl.children('a').attr('href');

          if (abbreviation && name && url) {
            specialization.push({ abbreviation, name, url });
          }
        });

        const nameElement = $(element).find('.b-programme a.b-programme__link');
        const name = nameElement.text().trim();
        const url = nameElement.attr('href');
        const isEnglish = $(element).find('span').is('[class="tag tag--xs"]');
        const abbreviation = $(element).find('.b-programme__link').next(".tag").first().text().trim();
        const attendanceType = $(element).find('.b-programme .b-branch__meta .b-branch__meta-item').last().text().trim();

        if (name && url) {
          programs[studyDegree].push({ name, url, isEnglish, specializations: specialization, attendanceType, abbreviation });
        }
      })
    })

    let currentYear = {
      value: "",
      label: ""
    }
    const optionsEls = $("body main .f-subjects .inp select#year option")
    const years = optionsEls.map((_, element) => {
      if ($(element).attr("selected") !== undefined) {
        currentYear = {
          value: $(element).attr("value") as string,
          label: $(element).text().trim()
        }
      }
      const value = $(element).attr("value") as string
      const label = $(element).text().trim();
      return { value, label }
    }).get()





    return { programs, years, currentYear }
  }

  async getStudyProgramCourses(programUrl: string) {
    const locales = await this.getLanguageSet();
    const $ = await this.fetchDocument(programUrl)

    const abbreviation = $("main .b-detail .b-detail__summary strong").first().text().trim() as Program;
    const name = $("h1.b-detail__title").text().trim();

    const courses: StudyCourses = {};
    let prevYear: keyof StudyCourses = "0";
    $("main").has("#planh").find(".table-responsive").first().find("table").each((_, element) => {
      const year: StudyYear = `${parseInt($(element).children("caption").text().trim()[0])}${abbreviation}` || "ALL";

      const semester = prevYear === year ? SEMESTER.SUMMER : SEMESTER.WINTER;
      prevYear = year;
      if (!courses[year]) {
        courses[year] = { [SEMESTER.WINTER]: [], [SEMESTER.SUMMER]: [], name };
      }
      const list: StudyCourse[] = courses[year][semester]


      const rows = $(element).find('tbody tr');
      rows.each((_, element) => {
        const rowBgColor = $(element).css('background-color');
        const abbreviation = $(element).children("th").text().trim();
        const name = $(element).children("td").first().children("a").text().trim();
        const link = $(element).children("td").first().children("a").attr("href")!;
        const id = parseInt(link.match(/\/course\/(\d+)/)?.[1] ?? "", 10);
        const credits = $(element).children("td").eq(1).text().trim();
        const obligationText = $(element).children("td").eq(2).text().trim();
        const completion = $(element).children("td").eq(3).text().trim();
        const faculty = $(element).children("td").last().text().trim();
        const note = $(element).children("td").first().children("sup").length > 0
        let obligation = false;
        switch (rowBgColor) {
          case "#ffe4c0":
            obligation = true;
            break;
          case "#ffffd0":
            obligation = false;
            break;
          default:
            // fallback to text
            if (obligationText === locales.course.obligation.compulsory) { obligation = true }
            else if (obligationText === locales.course.obligation.compulsoryElective) { obligation = true }
            else if (obligationText === locales.course.obligation.elective) { obligation = false }
            break;
        }
        list.push({ abbreviation, name, link, credits, obligation, completion, faculty, note, id });
      });
    })
    return courses;
  }

  conjunctRooms(rooms: string[]) {
    const conjunctedRooms = [
      { main: "E112", streamed: ["E104", "E105"] },
      { main: "D105", streamed: ["D0206", "D0207"] },
      { main: "N103", streamed: ["N104", "N105"] },
    ];

    // Iterate through conjunctedRooms to find matches
    const result = conjunctedRooms
      .map(({ main, streamed }) => {
        // Check if the input rooms include any of the rooms in the main and streamed set
        if (rooms.includes(main) && rooms.some(room => streamed.includes(room))) {
          // Create the formatted string
          const streamedNumbers = streamed
            .filter(room => rooms.includes(room))
            .map(room => room.slice(-1)); // Get the last digit of the room (e.g. '4' from 'E104')

          const rest = rooms.filter(room => ![main, ...streamed].includes(room));

          return `${main}+${streamedNumbers.join(',')}${rest.length ? ` ${rest.join(' ')}` : ""}`;
        }
        return null;
      })
      .filter(result => result !== null) // Filter out null values
      .join(' ; '); // Join the results with a semicolon and space

    // If result is empty, return the original rooms joined by commas
    return result || rooms.join(' ');
  };

  async getCourseDetail(courseId: string): Promise<CourseDetail[]> {
    const languageSet = await this.getLanguageSet();
    const courseUrl = `${this.baseUrl}course/${courseId}/${this.urlLanguage}`;
    const $ = await this.fetchDocument(courseUrl)
    const courseTypeBasedOnColor = {
      "#e8ffff": COURSE_TYPE.DEMO_EXERCISE,
      "#e0ffe0": COURSE_TYPE.LECTURE,
      "#ffffdc": COURSE_TYPE.LABORATORY,
      "#ffe6cc": COURSE_TYPE.EXAM
    }

    const abbreviation = $(".b-detail__annot .b-detail__annot-item").first().text().trim() as Program;
    const link = courseUrl;

    const range = $("main div.b-detail__body div.grid__cell").filter((_, element) => {
      return $(element).find("p.b-detail__subtitle").text().trim().includes(languageSet.course.detail.timeSpan.timeSpan)
    })
    const rangeText = range.next().find("ul li").map((_, element) => $(element).text().trim()).get()

    const hours = {
      lecture: parseInt(rangeText.find((text) => text.includes(languageSet.course.detail.timeSpan.lecture))?.split(" ")[0] ?? "0"),
      exercise: parseInt(rangeText.find((text) => text.includes(languageSet.course.detail.timeSpan.exercises))?.split(" ")[0] ?? "0"),
    }
    const noteText = $("main div.b-detail .b-detail__body .footnote").text().trim()

    let courses = [];
    //   var lesson = {
    //     "id": "",
    //     "name": sub.name,
    //     "link": sub.link,
    //     "day":  parseDay($(tr).children("th").html()),
    //     "week": parseWeek($(tr).children("td").eq(1).html()),
    //     "from": parseTimeFrom($(tr).children("td").eq(3).html()),
    //     "to":   parseTimeTo($(tr).children("td").eq(4).html()),
    //     "group": $(tr).children("td").eq(7).html().replace("xx", "").trim(),
    //     "info": $(tr).children("td").eq(8).html(),
    //     "type": "unknown",
    //     "rooms": [],
    //     "layer": 1,
    //     "selected": false,
    //     "deleted": false
    // };
    const removeSpaces = (text: string) => {
      // "sdsd\n\n           ds" => "sdsd ds"
      return text.replaceAll("\n", "").replace(/\s+/g, ' ').trim()
    }

    return $("main table#schedule tbody tr").map((_, element) => {
      const day = $(element).children("th").text().trim();
      const rowBgColor = $(element).css('background');
      const type = rowBgColor && rowBgColor in courseTypeBasedOnColor ? courseTypeBasedOnColor[rowBgColor as keyof typeof courseTypeBasedOnColor] : null;
      const room = this.conjunctRooms($(element).children("td").eq(2).children("a").map((_, element) => $(element).text().trim()).get())
      const lectureGroup = $(element).children("td").eq(6).children("a").map((_, element) => $(element).text().trim()).get()
      const [_type, weeksText, __, start, end, capacity, ___, groups, info] = $(element).children("td").map((_, element) => (removeSpaces($(element).text()))).get();
      const hasNote = _type.includes("*)")
      const normalizedDay = ObjectTyped.entries(languageSet.course.detail.day).find(([_, value]) => value === day)?.[0] as DAY
      return {
        abbreviation,
        name: abbreviation,
        link,
        type,
        day: normalizedDay,
        weeks: weeksText,
        room,
        start,
        end,
        capacity,
        lectureGroup,
        groups,
        info,
        note: hasNote ? noteText : null,
      } satisfies CourseDetail
    }).get()
  }
}