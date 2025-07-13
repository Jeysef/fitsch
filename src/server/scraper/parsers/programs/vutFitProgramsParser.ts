import type { CheerioAPI } from "cheerio";
import type { StudyApiTypes, StudyPrograms, StudySpecialization } from "../../types";
import { ObjectTyped } from "object-typed";
import { DEGREE } from "../../enums";
import { createStudyId } from "../../utils";

export class ProgramsParser {
  public parse($: CheerioAPI): StudyApiTypes.getStudyProgramsReturn {
    const programs: StudyPrograms = ObjectTyped.fromEntries(Object.values(DEGREE).map((id) => [id, {}]));
    const elementIdDegrees = {
      bc: DEGREE.BACHELOR,
      mgr: DEGREE.MASTER,
      dr: DEGREE.DOCTORAL,
    };

    $("body main .c-programs").each((_, element) => {
      const studyDegree = elementIdDegrees[$(element).attr("id") as keyof typeof elementIdDegrees];
      $(element)
        .find(".c-programmes__list li.c-programmes__item")
        .each((_, element) => {
          const specialization: StudySpecialization[] = [];
          $(element)
            .find(".b-programme .c-branches ul.c-branches__list li.c-branches__item")
            .each((_ind, element) => {
              const titleEl = $(element).find(".b-branch .b-branch__title");
              const abbreviation = titleEl.children(".tag.tag--fit").first().text().trim();
              const name = titleEl.children("a").text().trim();
              const url = titleEl.children("a").attr("href")!;
              const id = createStudyId(url);

              if (abbreviation && name && url) {
                specialization.push({ abbreviation, name, url, id });
              }
            });

          const nameElement = $(element).find(".b-programme a.b-programme__link");
          const name = nameElement.text().trim();
          const url = nameElement.attr("href")!;
          const id = createStudyId(url);
          const isEnglish = $(element).find("span").is('[class="tag tag--xs"]');
          const abbreviation = $(element).find(".b-programme__link").next(".tag").first().text().trim();
          const attendanceType = $(element).find(".b-programme .b-branch__meta .b-branch__meta-item").last().text().trim();

          if (name && url) {
            programs[studyDegree][id] = {
              name,
              url,
              isEnglish,
              specializations: specialization,
              attendanceType,
              abbreviation,
              id,
            };
          }
        });
    });

    let currentYear = {
      value: "",
      label: "",
    };
    const optionsEls = $("body main .f-subjects .inp select#year option");
    const years = optionsEls
      .map((_, element) => {
        if ($(element).attr("selected") !== undefined) {
          currentYear = {
            value: $(element).attr("value") as string,
            label: $(element).text().trim(),
          };
        }
        const value = $(element).attr("value") as string;
        const label = $(element).text().trim();
        return { value, label };
      })
      .get();

    return { programs, years, currentYear };
  }
}
