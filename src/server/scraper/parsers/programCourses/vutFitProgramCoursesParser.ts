import type { CheerioAPI } from "cheerio";
import type { ProgramCoursesParserOptions } from "~/server/scraper/parsers/programCourses/ProgramCoursesParser.types";
import type { CourseOverview } from "~/server/scraper/types/course.types";
import type { GradeKey } from "~/server/scraper/types/grade.types";
import type { Program } from "~/server/scraper/types/program.types";
import { OBLIGATION, SEMESTER } from "../../../../enums/enums";
import type { LanguageSetDictionary } from "../../languageProvider";

export class ProgramCoursesParser {
  constructor(private readonly langSet: LanguageSetDictionary) {}
  public parse($: CheerioAPI, options: ProgramCoursesParserOptions): Program {
    const { programUrl } = options;
    const abbreviation = $("main .b-detail .b-detail__summary strong").first().text().trim();
    const name = $("h1.b-detail__title").text().trim();

    const courses: Program = {
      detail: {
        name,
        abbreviation,
        url: programUrl,
      },
      data: {},
    };
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
        if (!courses.data[year]) {
          courses.data[year] = {
            [SEMESTER.WINTER]: [],
            [SEMESTER.SUMMER]: [],
          };
        }

        const rows = $(element).find("tbody tr");
        courses.data[year][semester] = rows
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
              name,
              abbreviation,
              url,
              // credits,
              obligation,
              // completion,
              // faculty,
              // note,
              id,
            } satisfies CourseOverview;
          })
          .get();
      });

    return courses;
  }
}
