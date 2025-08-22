import type { LANGUAGE } from "~/enums";
import type { StudyApiTypes } from "~/server/scraper/types/api.types";
import { defineCachedFunction } from "~/server/utils/cache";
import { DEGREE } from "../enums";
import type { HttpFetcher } from "../httpFetcher";
import type { CourseDetailParser } from "../parsers/course/vutFitCourseParser";
import type { ProgramCoursesParser } from "../parsers/programCourses/vutFitProgramCoursesParser";
import type { ProgramsParser } from "../parsers/programs/vutFitProgramsParser";
import type { TimeScheduleParser } from "../parsers/timeSchedule/vutFitTimeScheduleParser";
import type { IStudyApi } from "./interface";

const cacheMaxAge = 60 * 60 * 24 * 30;

export class VutFitApi implements IStudyApi {
  private readonly baseUrl = "https://www.fit.vut.cz/study/";
  private readonly urlLanguage: `.${LANGUAGE}`;

  constructor(
    private readonly language: LANGUAGE,
    private readonly httpFetcher: HttpFetcher,
    private readonly programsParser: ProgramsParser,
    private readonly courseDetailParser: CourseDetailParser,
    private readonly timeScheduleParser: TimeScheduleParser,
    private readonly programCoursesParser: ProgramCoursesParser
  ) {
    this.urlLanguage = `.${this.language}`;
  }

  public getTimeSchedule = defineCachedFunction<
    StudyApiTypes.getStudyTimeScheduleReturn,
    [StudyApiTypes.getStudyTimeScheduleConfig]
  >(
    async (config) => {
      const { year } = config;
      const calendarUrl = `${this.baseUrl}calendar/${year ? `${year}/` : ""}${this.urlLanguage}`;
      const $ = await this.httpFetcher.getDocument(calendarUrl);
      return this.timeScheduleParser.parse($); // Use the dedicated parser
    },
    { name: "getTimeSchedule_vutFit", maxAge: cacheMaxAge }
  );

  // --- PUBLIC METHODS ---
  // Note how simple the methods are now. Caching is applied at this level.

  public getStudyPrograms = defineCachedFunction<
    StudyApiTypes.getStudyProgramsReturn,
    [StudyApiTypes.getStudyProgramsConfig]
  >(
    async (config) => {
      const programsUrl = this.buildProgramsUrl(config);
      const $ = await this.httpFetcher.getDocument(programsUrl);
      return this.programsParser.parse($);
    },
    { name: "getStudyPrograms_vutFit", maxAge: cacheMaxAge }
  );

  public getStudyCourseDetails = defineCachedFunction<
    StudyApiTypes.getStudyCourseDetailsReturn,
    [StudyApiTypes.getStudyCourseDetailsConfig]
  >(
    async (config) => {
      const courseUrl = `${this.baseUrl}course/${config.courseId}/${this.urlLanguage}`;
      const $ = await this.httpFetcher.getDocument(courseUrl);
      return this.courseDetailParser.parse($, { ...config, courseUrl });
    },
    { name: "getStudyCourseDetails_vutFit", maxAge: cacheMaxAge }
  );

  public getStudyProgramCourses = async (
    config: StudyApiTypes.getStudyProgramCoursesConfig
  ): Promise<StudyApiTypes.getStudyProgramCoursesReturn> => {
    const { programUrl } = config;
    const $ = await this.httpFetcher.getDocument(programUrl);
    return this.programCoursesParser.parse($, config);
  };

  private buildProgramsUrl(config: StudyApiTypes.getStudyProgramsConfig): string {
    const urlTypeDegrees = {
      [DEGREE.BACHELOR]: "B",
      [DEGREE.MASTER]: "N",
      [DEGREE.DOCTORAL]: "D",
    };

    /**
     * Get current study year
     * If the current month is before June, return the previous year
     * Otherwise, return the current year
     * example: 2023-06-01 -> 2022 (label will be 2022/2023)
     */
    const getYear = () => {
      const now = new Date();
      const defaultYear = now.getFullYear();
      const month = now.getMonth();
      if (month < 6) return defaultYear - 1;
      return defaultYear;
    };

    const { degree, year } = config;
    const degreeQuery = degree ? `degree=${urlTypeDegrees[degree]}` : "";
    const yearQuery = `year=${year ?? getYear()}`;
    const queryStr = [degreeQuery, yearQuery].filter(Boolean).join("&");

    return `${this.baseUrl}programs/${this.urlLanguage}${queryStr ? `?${queryStr}` : ""}`;
  }

  public async getStudyCoursesDetails(
    config: StudyApiTypes.getStudyCoursesDetailsConfig
  ): Promise<StudyApiTypes.getStudyCoursesDetailsReturn> {
    const { courseIds, semester, year } = config;
    const timeSchedule = await this.getTimeSchedule({ year: year });
    const semesterTimeSchedule = timeSchedule[semester];
    const data = await Promise.all(
      courseIds.map((courseId) => this.getStudyCourseDetails({ courseId, semesterTimeSchedule }))
    );
    return { data, semesterTimeSchedule };
  }
}
