import { compact } from "es-toolkit";
import { ObjectTyped } from "object-typed";
import { semesterWeeks } from "~/server/scraper/constants";
import { WEEK_PARITY } from "~/server/scraper/enums";
import type { LanguageSetDictionary } from "~/server/scraper/languageProvider";
import type { CourseTimeSpan } from "~/server/scraper/types/types";
import { getParityOfWeeks, getWeekFromSemesterStart } from "~/server/scraper/utils";

export function getWeekParityFromName(week: string, languageSet: LanguageSetDictionary) {
  if (week.includes(languageSet.course.detail.weeks.EVEN)) return WEEK_PARITY.EVEN;
  if (week.includes(languageSet.course.detail.weeks.ODD)) return WEEK_PARITY.ODD;
  return null;
}

export function getWeekFromName(week: string, languageSet: LanguageSetDictionary) {
  if (week.includes(languageSet.course.detail.weeks.ALL)) return Array.from({ length: semesterWeeks }, (_, i) => i + 1);
  return week;
}

export function parseWeek(week: string, semesterStart: Date, languageSet: LanguageSetDictionary) {
  // '1., 2., 3., 4., 5., 6. výuky' => [1, 2, 3, 4, 5, 6]
  if (week.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
    const weekNum = getWeekFromSemesterStart(new Date(week), semesterStart);
    return {
      weeks: [weekNum],
      parity: getParityOfWeeks([weekNum], semesterStart),
    };
  }
  // const parsedWeek = week.replace("výuky", "").
  //use regex to get the week numbers
  const parsedWeek = week.match(/\d+/g) ?? week;
  // if is array of numbers, return the array
  if (Array.isArray(parsedWeek)) {
    const numberized = parsedWeek.map(Number);
    return {
      weeks: numberized,
      parity: getParityOfWeeks(numberized, semesterStart),
    };
  }
  return {
    weeks: getWeekFromName(week, languageSet),
    parity: getWeekParityFromName(week, languageSet),
  };
}

export function parseCourseTimeSpan(timeSpan: string[], languageSet: LanguageSetDictionary): CourseTimeSpan {
  return ObjectTyped.fromEntries(
    compact(
      timeSpan.map((timeSpan) => {
        const [hoursText, ...typeText] = timeSpan.split(" ");
        const hours = Number.parseInt(hoursText ?? "0");
        const typeTextJoined = typeText.join(" ");
        const type = ObjectTyped.entries(languageSet.course.detail.timeSpan.data).find(([_, text]) =>
          typeTextJoined.includes(text)
        )?.[0];
        if (!type) {
          console.warn(`Could not find type for time span ${timeSpan}`);
          return null;
        }
        return [type, hours];
      })
    )
  );
}
