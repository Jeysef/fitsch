import { ObjectTyped } from "object-typed";
import { FACULTY, LANGUAGE } from "~/enums";
import { DEGREE, SEMESTER } from "~/enums/enums";
import type { GradeOverview } from "~/server/scraper/types/grade.types";
import type {
  Overview,
  OverviewCurrent,
  OverviewData,
  OverviewPayload,
  OverviewPrograms,
} from "~/server/scraper/types/overview.types";
import type { ProgramOverview } from "~/server/scraper/types/program.types";
import { constructGradeLabel } from "~/server/scraper/utils";
import type { IStudyApi } from "../api/interface";

export class OverviewDataProvider {
  constructor(private readonly studyApi: IStudyApi) {}

  public async getStudyOverview(config: OverviewPayload, language: LANGUAGE): Promise<Overview> {
    const { programs: studyPrograms, years, currentYear } = await this.studyApi.getStudyPrograms(config);
    // TODO: multiple languages
    const isEnglish = language === LANGUAGE.ENGLISH;
    const filterLanguage = (programs: ProgramOverview[]) => {
      return programs.filter((studyProgram) => studyProgram.isEnglish === isEnglish);
    };
    const current: OverviewCurrent = {
      language: language,
      year: currentYear,
      degree: config?.degree ?? DEGREE.BACHELOR,
      faculty: FACULTY.FIT,
    };

    // all programs foe each degree
    const programs: OverviewPrograms = ObjectTyped.fromEntries(
      ObjectTyped.entries(studyPrograms).map(
        ([degree, programs]) => [degree, Object.values(filterLanguage(programs))] as const
      )
    );

    const data: OverviewData = {
      years,
      semesters: Object.values(SEMESTER),
      degrees: Object.values(DEGREE),
      programs,
      grades: null,
      courses: null,
    };

    const degreePrograms = studyPrograms[current.degree!];
    const filteredDegreePrograms = filterLanguage(degreePrograms);
    const programAndSpecializations = filteredDegreePrograms.flatMap((program) => [program, ...program.specializations]);
    if (config?.program) {
      current.program = programAndSpecializations.find(
        (programOrSpecialization) => programOrSpecialization.url === config.program
      )?.url;
    }
    if (!current.program && programAndSpecializations.length === 1) {
      current.program = programAndSpecializations[0].url;
    }

    if (!current.program) {
      return {
        current,
        data,
      };
    }

    const programData = await this.studyApi.getStudyProgramCourses({ programUrl: current.program });

    data.grades = ObjectTyped.keys(programData.data).map(
      (grade) =>
        ({ key: grade, label: constructGradeLabel(grade, programData.detail.abbreviation) }) satisfies GradeOverview
    );

    data.courses = programData.data;

    return {
      current,
      data,
    };
  }
}
