import { defineCachedFunction } from "~/server/utils/cache";
import type { HttpFetcher } from "../httpFetcher";
import type { ProgramsParser } from "../parsers/programs/vutFitProgramsParser";
import type { CourseDetailParser } from "../parsers/course/vutFitCourseParser";
import type { IStudyApi } from "./interface";
import type { LANGUAGE } from "~/enums";
import { DEGREE } from "../enums";
import type { ProgramStudyCourses, StudyApiTypes } from "../types";
import type { TimeScheduleParser } from "../parsers/timeSchedule/vutFitTimeScheduleParser";
import type { ProgramCoursesParser } from "../parsers/programCourses/vutFitProgramCoursesParser";

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

  public getTimeSchedule = defineCachedFunction(
    async (config: StudyApiTypes.getStudyTimeScheduleConfig): Promise<StudyApiTypes.getStudyTimeScheduleReturn> => {
      const { year } = config;
      const calendarUrl = `${this.baseUrl}calendar/${year ? `${year}/` : ""}${this.urlLanguage}`;
      const $ = await this.httpFetcher.getDocument(calendarUrl);
      return this.timeScheduleParser.parse($); // Use the dedicated parser
    },
    { name: "getTimeSchedule_vutFit", maxAge: cacheMaxAge }
  );

  // --- PUBLIC METHODS ---
  // Note how simple the methods are now. Caching is applied at this level.

  public getStudyPrograms = defineCachedFunction(
    async (config: StudyApiTypes.getStudyProgramsConfig) => {
      const programsUrl = this.buildProgramsUrl(config);
      const $ = await this.httpFetcher.getDocument(programsUrl);
      return this.programsParser.parse($);
    },
    { name: "getStudyPrograms_vutFit", maxAge: cacheMaxAge }
  );

  public getStudyCourseDetails = defineCachedFunction(
    async (config: StudyApiTypes.getStudyCourseDetailsConfig) => {
      const courseUrl = `${this.baseUrl}course/${config.courseId}/${this.urlLanguage}`;
      const $ = await this.httpFetcher.getDocument(courseUrl);
      return this.courseDetailParser.parse($, { ...config, courseUrl });
    },
    { name: "getStudyCourseDetails_vutFit", maxAge: cacheMaxAge }
  );

  public getStudyProgramCourses = async (
    config: StudyApiTypes.getStudyProgramCoursesConfig
  ): Promise<ProgramStudyCourses> => {
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

    const { degree, year } = config;
    const degreeQuery = degree ? `degree=${urlTypeDegrees[degree]}` : "";
    const yearQuery = year ? `year=${year}` : "";
    const queryStr = [degreeQuery, yearQuery].filter(Boolean).join("&");

    return `${this.baseUrl}programs/${this.urlLanguage}${queryStr ? `?${queryStr}` : ""}`;
  }

  public async getStudyCoursesDetails(
    config: StudyApiTypes.getStudyCoursesDetailsConfig
  ): Promise<StudyApiTypes.getStudyCoursesDetailsReturn> {
    const { courses, semester, year } = config;
    const timeSchedule = await this.getTimeSchedule({ year: year });
    const semesterTimeSchedule = timeSchedule[semester];
    const data = await Promise.all(
      courses.map((courseId) => this.getStudyCourseDetails({ courseId, semesterTimeSchedule }))
    );
    return { data, semesterTimeSchedule };
  }
}
