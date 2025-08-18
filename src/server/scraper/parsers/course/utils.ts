import { WEEK_PARITY } from "~/server/scraper/enums";
import type { LanguageSetDictionary } from "~/server/scraper/languageProvider";
import { getParityOfWeeks, getWeekFromSemesterStart } from "~/server/scraper/utils";

export function getWeekParityFromName(week: string, languageSet: LanguageSetDictionary) {
  if (week.includes(languageSet.course.detail.weeks.EVEN)) return WEEK_PARITY.EVEN;
  if (week.includes(languageSet.course.detail.weeks.ODD)) return WEEK_PARITY.ODD;
  return null;
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
    weeks: week,
    parity: getWeekParityFromName(week, languageSet),
  };
}
