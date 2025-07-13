import type { CheerioAPI } from "cheerio";
import type { GradeKey, ProgramStudyCourses } from "../../types";
import { OBLIGATION, SEMESTER } from "../../enums";
import type { LanguageSetDictionary } from "../../languageProvider";
import { createStudyId } from "../../utils";


interface ProgramCoursesParserOptions {
  programUrl: string
}

export class ProgramCoursesParser {
  constructor(private readonly langSet: LanguageSetDictionary) {}
  public parse($: CheerioAPI, options: ProgramCoursesParserOptions): ProgramStudyCourses {
    const {programUrl} = options
    const abbreviation = $("main .b-detail .b-detail__summary strong").first().text().trim();
    const name = $("h1.b-detail__title").text().trim();

    const courses: ProgramStudyCourses = {};
    let prevYear: GradeKey = "0"; // this key does not exist
    $("main")
      .has("#planh")
      .find(".table-responsive")
      .first()
      .find("table")
      .each((_, element) => {
        const year: GradeKey = (Number.parseInt($(element).children("caption").text().trim()[0], 10) || "ALL").toString();

        const semester = prevYear === year ? SEMESTER.SUMMER : SEMESTER.WINTER;
        prevYear = year;
        if (!courses[year]) {
          courses[year] = {
            [SEMESTER.WINTER]: [],
            [SEMESTER.SUMMER]: [],
            name,
            abbreviation,
            id: createStudyId(programUrl),
            url: programUrl,
          };
        }

        const rows = $(element).find("tbody tr");
        courses[year][semester] = rows
          .map((_, element) => {
            const rowBgColor = $(element).css("background-color");
            const abbreviation = $(element).children("th").text().trim();
            const name = $(element).children("td").first().children("a").text().trim();
            const url = $(element).children("td").first().children("a").attr("href")!;
            const id = url.match(/\/course\/(\d+)/)?.[1] ?? "";
            // const credits = $(element).children("td").eq(1).text().trim();
            const obligationText = $(element).children("td").eq(2).text().trim();
            // const completion = $(element).children("td").eq(3).text().trim();
            // const faculty = $(element).children("td").last().text().trim();
            // const note = $(element).children("td").first().children("sup").length > 0;
            let obligation: OBLIGATION = OBLIGATION.ELECTIVE;
            if (obligationText.includes(this.langSet.course.obligation.compulsoryElective)) {
              obligation = OBLIGATION.COMPULSORY_ELECTIVE;
            } else if (obligationText.includes(this.langSet.course.obligation.compulsory)) {
              obligation = OBLIGATION.COMPULSORY;
            } else if (obligationText.includes(this.langSet.course.obligation.elective)) {
              obligation = OBLIGATION.ELECTIVE;
            } else {
              // fallback to colors if text doesn't match
              switch (rowBgColor) {
                case "#ffe4c0":
                  obligation = OBLIGATION.COMPULSORY;
                  break;
                case "#ffffd0":
                  obligation = OBLIGATION.ELECTIVE;
                  break;
              }
            }

            return {
              abbreviation,
              name,
              url,
              // credits,
              obligation,
              // completion,
              // faculty,
              // note,
              id,
            };
          })
          .get();
      });

    return courses;
  }
}
