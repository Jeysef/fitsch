import type { CheerioAPI } from "cheerio";
import { ObjectTyped } from "object-typed";
import { Time, TimeSpan } from "~/components/scheduler/time";
import type { CourseDetailParserOptions } from "~/server/scraper/parsers/course/CourseDetailParser.types";
import { parseCourseTimeSpan, parseWeek } from "~/server/scraper/parsers/course/utils";
import type { StudyApiTypes } from "~/server/scraper/types/api.types";
import { LECTURE_TYPE, type DAY } from "../../enums";
import type { LanguageSetDictionary } from "../../languageProvider";
import { removeSpaces } from "../../utils";

export class CourseDetailParser {
  constructor(private readonly langSet: LanguageSetDictionary) {}
  public parse($: CheerioAPI, options: CourseDetailParserOptions): StudyApiTypes.getStudyCourseDetailsReturn {
    const { courseUrl: url, semesterTimeSchedule, courseId } = options;
    const courseTypeBasedOnColor = {
      // "#e8ffff": // exercise & seminar
      "#e0ffe0": LECTURE_TYPE.LECTURE,
      "#ffffdc": LECTURE_TYPE.LABORATORY,
      "#ffe6cc": LECTURE_TYPE.EXAM,
    };

    const abbreviation = $(".b-detail__annot .b-detail__annot-item").first().text().trim();
    const name = $("h1.b-detail__title").text().trim();

    const range = $("main div.b-detail__body div.grid__cell").filter((_, element) => {
      return $(element).find("p.b-detail__subtitle").text().trim().includes(this.langSet.course.detail.timeSpan.title);
    });
    const rangeText = range
      .next()
      .find("ul li")
      .map((_, element) => $(element).text().trim())
      .get();

    const timeSpan = parseCourseTimeSpan(rangeText, this.langSet);
    const timeSpanText = rangeText;

    const noteText = $("main div.b-detail .b-detail__body .footnote").text().trim();

    const data: StudyApiTypes.getStudyCourseDetailsReturn["data"] = $("main table#schedule tbody tr")
      .map((_, element) => {
        const day = $(element).children("th").text().trim();
        const rowBgColor = $(element).css("background");
        const rooms = $(element)
          .children("td")
          .eq(2)
          .children("a")
          .map((_, element) => $(element).text().trim())
          .get();
        const lectureGroup = $(element)
          .children("td")
          .eq(6)
          .children("a")
          .map((_, element) => $(element).text().trim())
          .get();
        const [_type, weeksText, _room, start, end, capacity, _group, groups, info] = $(element)
          .children("td")
          .map((_, element) => removeSpaces($(element).text()))
          .get();
        const type =
          rowBgColor && rowBgColor in courseTypeBasedOnColor
            ? courseTypeBasedOnColor[rowBgColor as keyof typeof courseTypeBasedOnColor]
            : (ObjectTyped.entries(this.langSet.course.detail.timeSpan.data).find(([_, type]) =>
                _type.includes(type)
              )?.[0] as LECTURE_TYPE);

        const hasNote = _type.includes("*)");
        const normalizedDay = ObjectTyped.entries(this.langSet.course.detail.day).find(
          ([_, value]) => value === day
        )?.[0] as DAY;
        // parseWeek may return null, but we expect an event not to
        const weeks = parseWeek(weeksText, semesterTimeSchedule.start, this.langSet);

        return {
          type,
          day: normalizedDay,
          weeks,
          room: rooms,
          timeSpan: new TimeSpan(Time.fromString(start), Time.fromString(end)),
          lectureGroup,
          groups,
          info,
          note: hasNote ? noteText : null,
          capacity,
        } satisfies StudyApiTypes.getStudyCourseDetailsReturn["data"][number];
      })
      .get();

    const detail: StudyApiTypes.getStudyCourseDetailsReturn["detail"] = {
      abbreviation,
      name,
      url,
      timeSpan,
      timeSpanText,
      id: courseId,
    };

    return { data, detail };
  }
}
