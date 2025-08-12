import { FACULTY, type LANGUAGE } from "~/enums";
import type { HttpFetcher } from "../httpFetcher";
import { LanguageProvider } from "../languageProvider";
import { CourseDetailParser } from "../parsers/course/vutFitCourseParser";
import { ProgramCoursesParser } from "../parsers/programCourses/vutFitProgramCoursesParser";
import { ProgramsParser } from "../parsers/programs/vutFitProgramsParser";
import { TimeScheduleParser } from "../parsers/timeSchedule/vutFitTimeScheduleParser";
import type { IStudyApi } from "./interface";
import { VutFitApi } from "./vutFitApi";

export class ApiFactory {
  constructor(private readonly httpFetcher: HttpFetcher) {}

  public async create(faculty: FACULTY, language: LANGUAGE): Promise<IStudyApi> {
    switch (faculty) {
      case FACULTY.FIT: {
        const languageProvider = await LanguageProvider.create(language);
        const langSet = languageProvider.languageSet;
        // Create all the parsers needed specifically for the FIT faculty
        const programsParser = new ProgramsParser();
        const courseDetailsParser = new CourseDetailParser(langSet);
        const programCourseParser = new ProgramCoursesParser(langSet);
        const timeScheduleParser = new TimeScheduleParser(langSet);

        // Create and return the FIT-specific API implementation
        return new VutFitApi(
          language,
          this.httpFetcher,
          programsParser,
          courseDetailsParser,
          timeScheduleParser,
          programCourseParser
        );
      }

      default:
        // This ensures that if a new faculty is added to the enum, we get a compile-time error
        // or a runtime error if not handled.
        throw new Error(`Unsupported faculty provided: ${faculty}`);
    }
  }
}
