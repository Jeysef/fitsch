// file: ~/server/scraper/parsers/timeScheduleParser.ts

import { ObjectTyped } from "object-typed";
import type { CheerioAPI } from "cheerio";
import { SEMESTER } from "../../enums";
import type { LanguageSetDictionary } from "../../languageProvider";
import type { StudyApiTypes } from "../../types";

export class TimeScheduleParser {
  // It needs the language set to find the right elements
  constructor(private readonly langSet: LanguageSetDictionary) {}

  public parse($: CheerioAPI): StudyApiTypes.getStudyTimeScheduleReturn {
    const dates: [string, string][] = [];

    $("main .grid .grid__cell")
      .filter(":has(.c-schedule__subtitle)")
      .each((_, element) => {
        const date = $(element)
          .find("ul.c-schedule__list li.c-schedule__item")
          .filter((_, element) =>
            // Use the injected langSet
            Object.values(this.langSet.studyPlan).some((text) =>
              $(element).find(".c-schedule__label").text().includes(text)
            )
          )
          .children(".c-schedule__time")
          .find("time")
          .map((_, element) => $(element).attr("datetime"))
          .get();
        dates.push(date as [string, string]);
      });

    const timeSchedule = ObjectTyped.fromEntries(
      Object.values(SEMESTER).map(
        (semester, index) => [semester, { start: new Date(dates[index][0]), end: new Date(dates[index][1]) }] as const
      )
    );
    return timeSchedule;
  }
}
