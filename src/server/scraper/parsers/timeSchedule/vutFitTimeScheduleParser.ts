import type { CheerioAPI } from "cheerio";
import { ObjectTyped } from "object-typed";
import type { StudyApiTypes } from "~/server/scraper/types/api.types";
import { parseAsUtc } from "~/server/scraper/utils";
import { SEMESTER } from "../../../../enums/enums";
import type { LanguageSetDictionary } from "../../languageProvider";

export class TimeScheduleParser {
  // It needs the language set to find the right elements
  constructor(private readonly langSet: LanguageSetDictionary) {}

  public parse($: CheerioAPI): StudyApiTypes.getStudyTimeScheduleReturn {
    const dates = $("main .grid .grid__cell:has(.c-schedule__subtitle) ul.c-schedule__list li.c-schedule__item")
      .filter((_, element) => {
        return Object.values(this.langSet.studyPlan).some((textArray) =>
          textArray.some((text) => $(element).find(".c-schedule__label").text().includes(text))
        );
      })
      .toArray()
      .map((element) =>
        $(element)
          .find("time")
          .map((_, element) => $(element).attr("datetime"))
          .toArray()
      );

    const timeSchedule = ObjectTyped.fromEntries(
      Object.values(SEMESTER).map(
        (semester, index) => [semester, { start: parseAsUtc(dates[index][0]), end: parseAsUtc(dates[index][1]) }] as const
      )
    );
    return timeSchedule;
  }
}
