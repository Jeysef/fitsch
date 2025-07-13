// file: ~/server/scraper/api/factory.ts

import type { IStudyApi } from './interface';
import { VutFitApi } from './vutFitApi'; // Assuming this is the FIT-specific API
// import { FektApi } from './fektApi'; // You would create this for another faculty

import type { HttpFetcher } from '../httpFetcher';
import type { LanguageSetDictionary } from '../languageProvider';
import { FACULTY, type LANGUAGE } from '~/enums';
import { ProgramsParser } from '../parsers/programs/vutFitProgramsParser';
import { CourseDetailParser } from '../parsers/course/vutFitCourseParser';
import { ProgramCoursesParser } from '../parsers/programCourses/vutFitProgramCoursesParser';
import { TimeScheduleParser } from '../parsers/timeSchedule/vutFitTimeScheduleParser';

export class ApiFactory {
  constructor(
    private readonly httpFetcher: HttpFetcher,
    private readonly langSet: LanguageSetDictionary
  ) {}

  public create(faculty: FACULTY, language: LANGUAGE): IStudyApi {
    switch (faculty) {
      case FACULTY.FIT: {
        // Create all the parsers needed specifically for the FIT faculty
        const programsParser = new ProgramsParser();
        const courseDetailsParser = new CourseDetailParser(this.langSet);
        const programCourseParser = new ProgramCoursesParser(this.langSet);
        const timeScheduleParser = new TimeScheduleParser(this.langSet);

        // Create and return the FIT-specific API implementation
        return new VutFitApi(
          language,
          this.httpFetcher,
          programsParser,
          courseDetailsParser,
          timeScheduleParser,
          programCourseParser,
        );
      }

      default:
        // This ensures that if a new faculty is added to the enum, we get a compile-time error
        // or a runtime error if not handled.
        throw new Error(`Unsupported faculty provided: ${faculty}`);
    }
  }
}