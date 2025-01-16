// import { load } from "cheerio";
// import fs from "node:fs/promises";
// import path from "node:path";
// import { chromium, type Browser } from "playwright";
// import { createMutable } from "solid-js/store";
// import { afterAll, beforeAll, describe, test } from "vitest";
// import { createColumns, SchedulerStore } from "~/components/scheduler/store";
// import { days, end, start, step } from "~/config/scheduler";
// import { LANGUAGE } from "~/enums";
// import { DataProvider } from "~/server/scraper/dataProvider";
// import { DEGREE, LECTURE_TYPE, SEMESTER, type DAY } from "~/server/scraper/enums";
// import { LanguageProvider } from "~/server/scraper/languageProvider";
// import type { MCourseLecture } from "~/server/scraper/lectureMutator";
// import { getUrlContent } from "~/tests/helpers/loadContent";

// const TEST_DATA_DIR = path.join(__dirname, "../../__testData__/schedules");
// console.log("🚀 ~ file: compareDataAcrossVersions.test.ts:17 ~ TEST_DATA_DIR:", TEST_DATA_DIR);

// interface TestCase {
//   year: string;
//   semester: SEMESTER;
//   program: string | undefined;
//   grade: number;
//   courses: string[];
// }

// interface SavedTestData {
//   timestamp: string;
//   testCase: TestCase;
//   scheduleData: any;
// }

// async function saveTestData(testCase: TestCase, scheduleData: any) {
//   const timestamp = new Date().toISOString();
//   const fileName = `${testCase.year}_${testCase.semester}_${testCase.program}_${testCase.grade}-2.json`;
//   const filePath = path.join(TEST_DATA_DIR, fileName);

//   const data: SavedTestData = {
//     timestamp,
//     testCase,
//     scheduleData,
//   };

//   await fs.mkdir(TEST_DATA_DIR, { recursive: true });
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }

// async function loadTestData(testCase: TestCase): Promise<SavedTestData | null> {
//   const fileName = `${testCase.year}_${testCase.semester}_${testCase.program}_${testCase.grade}-2.json`;
//   const filePath = path.join(TEST_DATA_DIR, fileName);

//   try {
//     const data = await fs.readFile(filePath, "utf-8");
//     return JSON.parse(data);
//   } catch (error) {
//     return null;
//   }
// }

// describe(
//   "Schedule Data Comparison",
//   () => {
//     async function getScheduleData(testCase: TestCase) {
//       const formatTime = (start: { hour: number; minute: number }, end: { hour: number; minute: number }) =>
//         `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}\u00A0- ${end.hour
//           .toString()
//           .padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;
//       const formatDay = (day: DAY) => ({ day });
//       const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);

//       const scheduler = createMutable(
//         new SchedulerStore(
//           {
//             columns: createColumns({
//               start,
//               step,
//               end,
//               getTimeHeader: formatTime,
//             }),
//             rows: days.map(formatDay),
//           },
//           filter
//         )
//       );

//       const languageProvider = new LanguageProvider(LANGUAGE.CZECH);
//       const fetcher = async (url: string) => load(await getUrlContent(url, browser));
//       const dataProvider = new DataProvider(languageProvider, fetcher as any);

//       const courses = await dataProvider.getStudyCoursesDetails({
//         courses: testCase.courses,
//         year: testCase.year,
//         semester: testCase.semester,
//         mutatorConfig: {
//           fillWeeks: false,
//         },
//       });

//       scheduler.newCourses = courses;
//       return scheduler.data;
//     }

//     async function getCourseIds(year: string, semester: SEMESTER, program: string | undefined = undefined, grade = 1) {
//       const languageProvider = new LanguageProvider(LANGUAGE.CZECH);
//       const fetcher = async (url: string) => load(await getUrlContent(url, browser));
//       const dataProvider = new DataProvider(languageProvider, fetcher as any);

//       const overview = await dataProvider.getStudyOverview({
//         year,
//         degree: DEGREE.BACHELOR,
//         language: LANGUAGE.CZECH,
//         program,
//       });

//       const courses = overview.data.courses[grade.toString()]?.[semester];
//       if (!courses) return [];

//       return Object.values(courses)
//         .flat()
//         .map((course) => course.id.replace("course-", ""));
//     }

//     let browser: Browser;
//     const testCases: TestCase[] = [
//       {
//         year: "2024",
//         semester: SEMESTER.WINTER,
//         program: undefined,
//         grade: 1,
//         courses: [], // Will be filled by getCourseIds
//       },
//       {
//         year: "2024",
//         semester: SEMESTER.SUMMER,
//         program: undefined,
//         grade: 1,
//         courses: [], // Will be filled by getCourseIds
//       },
//       {
//         year: "2025",
//         semester: SEMESTER.WINTER,
//         program: undefined,
//         grade: 1,
//         courses: [], // Will be filled by getCourseIds
//       },
//     ];

//     beforeAll(async () => {
//       browser = await chromium.launch({
//         headless: true, // Run in headless mode
//         timeout: 60000, // Set the timeout to 60 seconds
//       });
//       // Fill course IDs for test cases
//       for (const testCase of testCases) {
//         testCase.courses = await getCourseIds(testCase.year, testCase.semester, testCase.program, testCase.grade);
//       }
//     }, 60000);

//     afterAll(async () => {
//       await browser.close();
//     });

//     test.each(testCases)(
//       "compare $program grade $grade in $semester $year",
//       async (testCase) => {
//         const currentData = await getScheduleData(testCase);
//         const savedData = await loadTestData(testCase);
//         console.log("data loaded");

//         if (!savedData) {
//           await saveTestData(testCase, currentData);
//           console.log("Saved initial test data");
//           return;
//         }

//         // const exactMatchPercentage = (totals.exactMatches / totals.total) * 100;
//         // expect(exactMatchPercentage).toBeGreaterThan(95);

//         // // Save new data if test passes
//         // await saveTestData(testCase, currentData);
//       },
//       { timeout: 300000 }
//     );
//   },
//   { timeout: 300000 }
// );

// // class ScheduleComparer
