import type { CheerioAPI } from "cheerio";
import type { Program } from "~/server/scraper/types/program.types";

export interface ProgramCoursesParserOptions {
  programUrl: string;
}

export interface ProgramCoursesParser {
  parse: ($: CheerioAPI, options: ProgramCoursesParserOptions) => Program;
}
