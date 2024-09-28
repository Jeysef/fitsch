import type { ResourceFetcher } from "solid-js";
import { type StudyOverview, type StudyOverviewConfig, DEGREE, SEMESTER } from "~/server/scraper/types";

export const getData: ResourceFetcher<true, StudyOverview, StudyOverviewConfig> = async (source, { value, refetching }) => {
  "use server";
  console.log("getting Data")
  // const language = LANGUAGE.CZECH;

  // const languageProvider = new LanguageProvider(language);
  // const dataProvider = new DataProvider(languageProvider);
  // return await dataProvider.getStudyOverview(config ?? null);
  const mockStudyOverview: StudyOverview = {
    values: {
      year: { value: "2024", label: "2024/2025" },
      semester: SEMESTER.WINTER,
      degree: DEGREE.BACHELOR,
      grade: "1BIT",
    },
    data: {
      years: [
        { value: "2021", label: "2021/2022" },
        { value: "2022", label: "2022/2023" },
        { value: "2023", label: "2023/2024" },
        { value: "2024", label: "2024/2025" },
      ],
      semesters: [SEMESTER.WINTER, SEMESTER.SUMMER],
      degrees: [DEGREE.BACHELOR, DEGREE.MASTER],
      grades: ["1BIT", "2BIT", "3BIT", "ALL"],
      courses: {
        "1BIT": {
          [SEMESTER.WINTER]: {
            compulsory: [
              { name: "Introduction to Programming", abbreviation: "IntroProg", id: "101" },
              { name: "Mathematics I", abbreviation: "MathI", id: "102" },
            ],
            optional: [],
          },
          [SEMESTER.SUMMER]: {
            compulsory: [
              { name: "Object-Oriented Programming", abbreviation: "OOP", id: "103" },
              { name: "Mathematics II", abbreviation: "MathII", id: "104" },
            ],
            optional: [],
          },
        },
        "2BIT": {
          [SEMESTER.WINTER]: {
            compulsory: [
              { name: "Data Structures", abbreviation: "DataStruct", id: "201" },
              { name: "Algorithms", abbreviation: "Algo", id: "202" },
            ],
            optional: [],
          },
          [SEMESTER.SUMMER]: {
            compulsory: [
              { name: "Operating Systems", abbreviation: "OS", id: "203" },
              { name: "Database Systems", abbreviation: "DB", id: "204" },
            ],
            optional: [],
          },
        },
      },
    },
  };
  return mockStudyOverview
}