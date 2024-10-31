import { fromURL } from "cheerio";
import { ObjectTyped } from "object-typed";
import { valueToEnumValue } from "~/lib/utils";
import type { LanguageProvider } from "~/server/scraper/languageProvider";
import { StudyApiTypes, type GradeKey, type ProgramStudyCourses, type StudyPrograms, type StudySpecialization } from "~/server/scraper/types";
import { createStudyId, parseWeek, removeSpaces } from "~/server/scraper/utils";
import { DEGREE, LECTURE_TYPE, SEMESTER, type DAY } from "./enums";

export class StudyApi {
  private readonly baseUrl = 'https://www.fit.vut.cz/study/'
  private _languageSet: Awaited<typeof this.languageProvider.languageSet> | undefined;
  private _timeSchedule: Map<string, StudyApiTypes.getStudyTimeScheduleReturn>;
  constructor(private readonly languageProvider: LanguageProvider, private readonly fetcher: typeof fromURL) {
    this._languageSet = undefined
    this._timeSchedule = new Map()
  }

  private getLanguageSet = async () => {
    if (this._languageSet) return this._languageSet
    this._languageSet = await this.languageProvider.languageSet
    return this._languageSet
  }

  // private getTimeSchedule = async () => {
  //   if (this._timeSchedule) return this._timeSchedule
  //   this._timeSchedule = await this.getTimeSchedule()
  //   return this._timeSchedule
  // }

  private fetchDocument(url: string) {
    return this.fetcher(url)
  }

  private get urlLanguage() {
    return `.${this.languageProvider.language}`
  }

  /**
   * I strongly recommend passing the year parameter, it helps caching the data
   */
  getTimeSchedule = async (config: StudyApiTypes.getStudyTimeScheduleConfig = { year: null }): Promise<StudyApiTypes.getStudyTimeScheduleReturn> => {
    const { year } = config
    if (year && this._timeSchedule?.has(year)) return this._timeSchedule.get(year)!
    const languageSet = await this.getLanguageSet();
    const calendarUrl = `${this.baseUrl}calendar/${year ? `${year}/` : ""}${this.urlLanguage}`;
    const $ = await this.fetchDocument(calendarUrl);
    const dates: [string, string][] = []
    $("main .grid .grid__cell").filter(":has(.c-schedule__subtitle)").each((_, element) => {
      // const title = $(element).find(".c-schedule__subtitle").text().trim();
      const date = $(element).find("ul.c-schedule__list li.c-schedule__item")
        .filter((_, element) => (Object.values(languageSet.studyPlan).some((text) => $(element).find(".c-schedule__label").text().includes(text))))
        .children(".c-schedule__time").find("time").map((_, element) => $(element).attr("datetime")).get()
      dates.push(date as [string, string])
    })
    const timeSchedule = ObjectTyped.fromEntries(Object.values(SEMESTER).map((semester, index) => [semester, { start: new Date(dates[index][0]), end: new Date(dates[index][1]) }] as const))

    let currentYear = {
      value: "",
      label: ""
    }
    const optionsEls = $("body main .f-subjects .inp select#year option")
    optionsEls.each((_, element) => {
      if ($(element).attr("selected") !== undefined) {
        currentYear = {
          value: $(element).attr("value") as string,
          label: $(element).text().trim()
        }
      }
    })
    currentYear.value && this._timeSchedule.set(currentYear.value, timeSchedule)
    return timeSchedule
  }

  public async getStudyPrograms(config?: StudyApiTypes.getStudyProgramsConfig): Promise<StudyApiTypes.getStudyProgramsReturn> {
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

    const programs: StudyPrograms = ObjectTyped.fromEntries(Object.values(DEGREE).map((id) => [id, {}]));
    $("body main .c-programs").each((_, element) => {
      const studyDegree = elementIdDegrees[$(element).attr('id') as keyof typeof elementIdDegrees];
      $(element).find('.c-programmes__list li.c-programmes__item').each((_, element) => {
        let specialization: StudySpecialization[] = [];
        $(element).find('.b-programme .c-branches ul.c-branches__list li.c-branches__item').each((ind, element) => {
          const titleEl = $(element).find('.b-branch .b-branch__title')
          const abbreviation = titleEl.children('.tag.tag--fit').first().text().trim();
          const name = titleEl.children('a').text().trim();
          const url = titleEl.children('a').attr('href');
          const id = createStudyId(url!);

          if (abbreviation && name && url) {
            specialization.push({ abbreviation, name, url, id });
          }
        });

        const nameElement = $(element).find('.b-programme a.b-programme__link');
        const name = nameElement.text().trim();
        const url = nameElement.attr('href');
        const id = createStudyId(url!);
        const isEnglish = $(element).find('span').is('[class="tag tag--xs"]');
        const abbreviation = $(element).find('.b-programme__link').next(".tag").first().text().trim();
        const attendanceType = $(element).find('.b-programme .b-branch__meta .b-branch__meta-item').last().text().trim();

        if (name && url) {
          programs[studyDegree][id] = ({ name, url, isEnglish, specializations: specialization, attendanceType, abbreviation, id });
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

  public async getStudyProgramCourses(config: StudyApiTypes.getStudyProgramCoursesConfig): Promise<ProgramStudyCourses> {
    const locales = await this.getLanguageSet();
    const { programUrl } = config;
    const $ = await this.fetchDocument(programUrl)

    // program data
    const abbreviation = $("main .b-detail .b-detail__summary strong").first().text().trim();
    const name = $("h1.b-detail__title").text().trim();

    const courses: ProgramStudyCourses = {};
    let prevYear: GradeKey = "0"; // this key does not exist
    $("main").has("#planh").find(".table-responsive").first().find("table").each((_, element) => {
      const year: GradeKey = (parseInt($(element).children("caption").text().trim()[0], 10) || "ALL").toString();

      const semester = prevYear === year ? SEMESTER.SUMMER : SEMESTER.WINTER;
      prevYear = year;
      if (!courses[year]) {
        courses[year] = { [SEMESTER.WINTER]: [], [SEMESTER.SUMMER]: [], name, abbreviation, id: createStudyId(programUrl), url: programUrl };
      }

      const rows = $(element).find('tbody tr');
      courses[year][semester] = rows.map((_, element) => {
        const rowBgColor = $(element).css('background-color');
        const abbreviation = $(element).children("th").text().trim();
        const name = $(element).children("td").first().children("a").text().trim();
        const url = $(element).children("td").first().children("a").attr("href")!;
        const id = url.match(/\/course\/(\d+)/)?.[1] ?? "";
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
        return ({ abbreviation, name, url, credits, obligation, completion, faculty, note, id });
      }).get()
    })

    return courses;
  }


  async getStudyCourseDetails(config: StudyApiTypes.getStudyCourseDetailsConfig): Promise<StudyApiTypes.getStudyCourseDetailsReturn> {
    const { courseId, semester, year } = config;
    const languageSet = await this.getLanguageSet();
    const timeSchedule = await this.getTimeSchedule({ year: year })
    const courseUrl = `${this.baseUrl}course/${courseId}/${this.urlLanguage}`;
    const $ = await this.fetchDocument(courseUrl)
    const courseTypeBasedOnColor = {
      // "#e8ffff": // exercise & seminar
      "#e0ffe0": LECTURE_TYPE.LECTURE,
      "#ffffdc": LECTURE_TYPE.LABORATORY,
      "#ffe6cc": LECTURE_TYPE.EXAM
    }

    const abbreviation = $(".b-detail__annot .b-detail__annot-item").first().text().trim();
    const name = $("h1.b-detail__title").text().trim();
    const link = courseUrl;

    const range = $("main div.b-detail__body div.grid__cell").filter((_, element) => {
      return $(element).find("p.b-detail__subtitle").text().trim().includes(languageSet.course.detail.timeSpan.title)
    })
    const rangeText = range.next().find("ul li").map((_, element) => $(element).text().trim()).get()

    const timeSpan = ObjectTyped.fromEntries(ObjectTyped.entries(languageSet.course.detail.timeSpan.data).map(([type, text]) => {
      const hours = parseInt(rangeText.find((rangeText) => rangeText.includes(text))?.split(" ")[0] ?? "0")
      return [valueToEnumValue(type, LECTURE_TYPE), hours] as const
    }))

    const timeSpanText = rangeText

    const noteText = $("main div.b-detail .b-detail__body .footnote").text().trim()

    const data: StudyApiTypes.getStudyCourseDetailsReturn["data"] = $("main table#schedule tbody tr").map((_, element) => {
      const day = $(element).children("th").text().trim();
      const rowBgColor = $(element).css('background');
      const rooms = $(element).children("td").eq(2).children("a").map((_, element) => $(element).text().trim()).get()
      const lectureGroup = $(element).children("td").eq(6).children("a").map((_, element) => $(element).text().trim()).get()
      const [_type, weeksText, _room, start, end, capacity, _group, groups, info] = $(element).children("td").map((_, element) => (removeSpaces($(element).text()))).get();
      const type = rowBgColor && rowBgColor in courseTypeBasedOnColor ?
        courseTypeBasedOnColor[rowBgColor as keyof typeof courseTypeBasedOnColor]
        : ObjectTyped.entries(languageSet.course.detail.timeSpan.data).find(([_, type]) => _type.includes(type))?.[0] as LECTURE_TYPE;

      const hasNote = _type.includes("*)")
      const normalizedDay = ObjectTyped.entries(languageSet.course.detail.day).find(([_, value]) => value === day)?.[0] as DAY
      // parseWeek may return null, but we expect an event not to
      const weeks = parseWeek(weeksText, timeSchedule[semester].start, languageSet)
      return {
        type,
        day: normalizedDay,
        weeks,
        room: rooms,
        start,
        end,
        capacity,
        lectureGroup,
        groups,
        info,
        note: hasNote ? noteText : null,
      }
    }).get()

    const detail: StudyApiTypes.getStudyCourseDetailsReturn["detail"] = {
      abbreviation,
      name,
      link,
      timeSpan,
      timeSpanText,
      id: courseId
    }

    return { data, detail }
  }
}