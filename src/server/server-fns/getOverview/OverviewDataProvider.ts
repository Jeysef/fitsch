import { chain, mapValues } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { LANGUAGE } from "~/enums";
import type { StudyApi } from "~/server/scraper/api";
import { DEGREE, OBLIGATION, SEMESTER } from "~/server/scraper/enums";
import type {
  DataProviderTypes,
  StudyOverview,
  StudyOverviewCourse,
  StudyOverviewGrade,
  StudyProgram,
  StudyPrograms,
} from "~/server/scraper/types";
import { constructGradeLabel } from "~/server/scraper/utils";

export class OverviewDataProvider {
  constructor(
    private readonly studyApi: StudyApi,
    private readonly language: LANGUAGE
  ) {}

  public async getStudyOverview(
    config?: DataProviderTypes.getStudyOverviewConfig
  ): Promise<DataProviderTypes.getStudyOverviewReturn> {
    const { programs: studyPrograms, years, currentYear } = await this.studyApi.getStudyPrograms(config);
    const isEnglish = this.language === LANGUAGE.ENGLISH;
    const values: StudyOverview["values"] = {
      language: this.language,
      year: currentYear,
      degree: config?.degree ?? DEGREE.BACHELOR,
    };

    let degreePrograms = studyPrograms[values.degree];
    // filter language
    const filterLanguage = (program: StudyPrograms[DEGREE]) =>
      ObjectTyped.fromEntries(
        Object.entries(program)
          .filter(([pid, studyProgram]) => studyProgram.isEnglish === isEnglish)
          .map(([id, program]) => [id, program] as const)
      );

    degreePrograms = filterLanguage(degreePrograms);
    const programAndSpecializations = Object.values(degreePrograms).flatMap((program) => [
      program,
      ...program.specializations,
    ]);
    if (config?.program) {
      values.program = programAndSpecializations.find(
        (programOrSpecialization) => programOrSpecialization.id === config.program
      );
    }
    if (!values.program && programAndSpecializations.length === 1) {
      values.program = programAndSpecializations[0];
    }
    // all programs foe each degree
    const programs: Record<DEGREE, StudyProgram[]> = ObjectTyped.fromEntries(
      ObjectTyped.entries(studyPrograms).map(
        ([degree, programs]) => [degree, Object.values(filterLanguage(programs))] as const
      )
    );

    const programData = values.program
      ? await this.studyApi.getStudyProgramCourses({ programUrl: values.program.url })
      : {};

    const grades = Object.entries(programData).map(
      ([grade, data]) => ({ key: grade, label: constructGradeLabel(grade, data.abbreviation) }) as StudyOverviewGrade
    );
    const degrees = Object.values(DEGREE);
    const semesters = Object.values(SEMESTER);

    const courses: DataProviderTypes.getStudyOverviewReturn["data"]["courses"] = mapValues(programData, (gradeData) =>
      ObjectTyped.fromEntries(
        semesters.map((semester) => [
          semester,
          chain(gradeData[semester])
            .groupBy("obligation")
            .defaults(mapValues(OBLIGATION, () => []))
            .value() as Record<OBLIGATION, StudyOverviewCourse[]>,
        ])
      )
    );

    return {
      values,
      data: {
        years,
        semesters,
        degrees,
        grades,
        programs,
        courses,
      },
    } satisfies StudyOverview;
  }
}
