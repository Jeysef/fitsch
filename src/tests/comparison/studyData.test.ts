import { load } from "cheerio";
import { type Browser, chromium } from "playwright";
import { createMutable } from "solid-js/store";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createColumns, SchedulerStore } from "~/components/scheduler/store";
import { days, end, start, step } from "~/config/scheduler";
import { LANGUAGE } from "~/enums";
import { DataProvider } from "~/server/scraper/dataProvider";
import { type DAY, LECTURE_TYPE, SEMESTER } from "~/server/scraper/enums";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";
import { ScheduleComparer } from "../helpers/compareData";
import { OldAppScraper } from "../helpers/oldAppScraper";

describe("Schedule Data Comparison", () => {
  let browser: Browser;
  let oldAppScraper: OldAppScraper;

  beforeAll(async () => {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 2000 });
    const context = page.context();
    await context.clearCookies();
    // Set JS priority and wait for network to be idle
    await page.goto("https://www.kubosh.net/apps/fitsch/", {
      waitUntil: "networkidle",
    });
    // // Wait for JS to be fully loaded
    // @ts-ignore
    await page.waitForFunction(() => window.jQuery);
    await page.evaluate(() => window.localStorage.clear());
    console.log("page loaded");
    // print page to console
    oldAppScraper = new OldAppScraper(page);
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  test.each([
    {
      year: "2024",
      semester: SEMESTER.WINTER,
      program: "BIT",
      grade: 1,
      course: ["281068", "281030", "281066", "281002", "280953"],
    },
    // { year: "2024", semester: SEMESTER.WINTER, program: "BIT", grade: 2 },
    // Add more test cases as needed
  ])("should match old app data for $program grade $grade in $semester $year", { timeout: 30000 }, async (params) => {
    // Setup old app
    await oldAppScraper.setYear(params.year);
    console.log("year set");
    await oldAppScraper.setSemester(params.semester);
    console.log("semester set");

    if (params.program === "BIT") {
      await oldAppScraper.setBitYear(params.grade - 1);
    } else {
      await oldAppScraper.setMitSpecialization(params.program);
    }
    console.log("program set");

    if (params.course) {
      for (const courseId of params.course) {
        await oldAppScraper.selectCourse(courseId);
      }
    }
    console.log("courses selected");

    await oldAppScraper.loadSchedule();
    console.log("schedule loaded");

    // await oldAppScraper.page.screenshot({
    //   path: `screenshots/screenshot-${params.program}-${params.grade}-${params.semester}-${params.year}.png`,
    //   fullPage: true,
    // });
    // console.log("screenshot taken");

    // Get reference data from old app
    const oldAppData = await oldAppScraper.scrapeSchedule();

    // Get data from current app
    const formatTime = (start: { hour: number; minute: number }, end: { hour: number; minute: number }) =>
      `${start.hour.toString().padStart(2, "0")}:${start.minute.toString().padStart(2, "0")}\u00A0- ${end.hour.toString().padStart(2, "0")}:${end.minute.toString().padStart(2, "0")}`;
    const formatDay = (day: DAY) => ({ day });
    const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM);
    // must be mutable to allow setting and reading to data setter.
    const scheduler = createMutable(
      new SchedulerStore(
        {
          columns: createColumns({
            start: start,
            step: step,
            end: end,
            getTimeHeader: formatTime,
          }),
          rows: days.map(formatDay),
        },
        filter
      )
    );

    // Load same courses as in old app
    const courseIds = params.course;
    const languageProvider = new LanguageProvider(LANGUAGE.CZECH);
    const fetcher = async (url: string) => {
      const browser = await chromium.launch();
      try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });
        const html = await page.content();
        return load(html);
      } finally {
        await browser.close();
      }
    };
    const dataProvider = new DataProvider(languageProvider, fetcher as any);
    const courses = await dataProvider.getStudyCoursesDetails({
      courses: Array.from(courseIds),
      year: params.year,
      semester: params.semester,
    });

    scheduler.newCourses = courses;

    // Replace compareData implementation with new ScheduleComparer
    const comparer = new ScheduleComparer(oldAppData, scheduler);
    const compareData = comparer.compare();

    // Calculate overall match percentages
    const totals = compareData.reduce(
      (acc, d) => ({
        exactMatches: acc.exactMatches + d.exactMatches,
        partialMatches: acc.partialMatches + d.partialMatchCount,
        total: acc.total + d.totalCount,
      }),
      { exactMatches: 0, partialMatches: 0, total: 0 }
    );

    const exactMatchPercentage = (totals.exactMatches / totals.total) * 100;
    const partialMatchPercentage = (totals.partialMatches / totals.total) * 100;

    // Main results summary
    console.log("\n=== Schedule Comparison Summary ===");
    console.log(`Total events across all days: ${totals.total}`);
    console.log(`Exact matches: ${totals.exactMatches} (${exactMatchPercentage.toFixed(2)}%)`);
    console.log(`Partial matches: ${totals.partialMatches} (${partialMatchPercentage.toFixed(2)}%)`);
    console.log(`Issues found: ${totals.total - totals.exactMatches}`);

    // Only show detailed day info if there are issues
    const daysWithIssues = compareData.filter(
      (d) => d.partialMatches.length > 0 || d.extraEvents.length > 0 || d.missingEvents.length > 0
    );

    // Updated logging section
    if (daysWithIssues.length > 0) {
      console.log("\n=== Detailed Issues By Day ===");

      for (const dayData of daysWithIssues) {
        console.log(`\n${dayData.day}`);
        console.log(
          `Total events: ${dayData.totalCount}, Matches: ${dayData.exactMatches}, Issues: ${dayData.totalCount - dayData.exactMatches}`
        );

        if (dayData.extraEvents.length > 0) {
          console.log("\n  Extra Events (in new only):");
          for (const event of dayData.extraEvents) {
            console.log(JSON.stringify(comparer.logEventDetails(event.newEvent, "new"), null, 2));
          }
        }

        if (dayData.missingEvents.length > 0) {
          console.log("\n  Missing Events (in old only):");
          for (const event of dayData.missingEvents) {
            console.log(JSON.stringify(comparer.logEventDetails(event.oldEvent, "old"), null, 2));
          }
        }
      }

      // Assertions explanation if they might fail
      if (exactMatchPercentage <= 80) {
        console.log("\n=== Test Failure Analysis ===");
        console.log(`Match rate (${exactMatchPercentage.toFixed(2)}%) is below required 80%`);
        console.log("Common causes:");
        console.log("1. Time parsing differences");
        console.log("2. Week format mismatches");
        console.log("3. Room notation differences");
        console.log("4. Data source inconsistencies");
      }
    } else {
      console.log("\n✅ All events matched perfectly!");
    }

    // Assertions remain the same
    expect(exactMatchPercentage + partialMatchPercentage).toBeGreaterThan(95);
    expect(exactMatchPercentage).toBeGreaterThan(80);

    // ...rest of the test...
  });
});
