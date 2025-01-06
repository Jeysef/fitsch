import type { Page } from "playwright";
import { Time, TimeSpan } from "~/components/scheduler/time";
import { DAY, LECTURE_TYPE, SEMESTER } from "~/server/scraper/enums";

export interface ScrapedEvent {
  courseId: string;
  courseName: string;
  room: string;
  weeks: string;
  info: string;
  type: LECTURE_TYPE;
  row: number;
  timeSpan: TimeSpan;
}

export interface ScrapedLectureData {
  day: DAY;
  events: ScrapedEvent[];
}

export class OldAppScraper {
  constructor(public page: Page) {}

  async loadSchedule() {
    // await this.page.click(".menu_submit_button[value='Načíst předměty']", { timeout: 3000, strict: true });
    await this.page.waitForSelector(".menu_submit_button", { timeout: 3000 });
    const button = await this.page.$(".menu_submit_button");
    // await button?.click({
    //   timeout: 3000,
    //   force: true,
    // });
    await button?.click({ timeout: 3000 });
    // await this.page.dispatchEvent(".menu_submit_button", "click");
    // Additional wait to ensure all animations and dynamic content is loaded
    // await this.page.waitForSelector(".schedule_row_layer:not(:empty)");
    await this.page.waitForTimeout(3000);
  }
  async setYear(year: string) {
    await this.page.selectOption(".year_select", year);
  }

  async setSemester(semester: SEMESTER) {
    const value = semester === SEMESTER.WINTER ? "winter" : "summer";
    await this.page.check(`input[value="${value}"]`, { timeout: 3000, strict: true });
  }

  async setBitYear(year: number) {
    await this.page.waitForTimeout(2000);
    await this.page.waitForSelector(".menu_bit_checkbox", { timeout: 7000 });
    const bitCheckbox = await this.page.$(".menu_bit_checkbox[value='BIT']");
    await bitCheckbox?.check({ force: true, timeout: 3000 });
    await this.page.waitForTimeout(100);
    await this.page.waitForSelector(`.menu_grade_checkbox[value="${year}_BIT"]`, { timeout: 7000 });
    const yearCheckbox = await this.page.$(`.menu_grade_checkbox[value="${year}_BIT"]`);
    await yearCheckbox?.check({ force: true, timeout: 3000 });
    await this.page.waitForTimeout(100);
  }

  async setMitSpecialization(spec: string) {
    await this.page.click(`.menu_mit_radio[value="${spec}"]`, { timeout: 3000, strict: true });
  }

  async selectCourse(courseId: string) {
    await this.page.waitForTimeout(100);
    await this.page.waitForSelector(`.menu_sub_checkbox[value="course-${courseId}"]`, { timeout: 3000 });
    const input = await this.page.$(`.menu_sub_checkbox[value="course-${courseId}"]`);
    // await input?.waitForElementState("visible", { timeout: 3000 });
    await input?.check({ force: true, timeout: 3000 });
    // await input?.click({
    //   timeout: 3000,
    //   delay: 100,
    //   force: true,
    // });
    // await this.page.dispatchEvent(`.menu_sub_checkbox[value="course-${courseId}"]`, "click", undefined, {
    //   strict: true,
    //   timeout: 3000,
    // });
  }

  private parseLectureType(className: string): LECTURE_TYPE {
    if (className.includes("green")) return LECTURE_TYPE.LECTURE;
    if (className.includes("blue")) return LECTURE_TYPE.EXERCISE;
    if (className.includes("yellow")) return LECTURE_TYPE.LABORATORY;
    // Add more types as needed
    return LECTURE_TYPE.EXERCISE;
  }

  private parseTimeSpan(style: string) {
    // Parse left position and width from style
    const left = Number.parseFloat(style.match(/left: ([\d.]+)px/)?.[1] || "0");
    const width = Number.parseFloat(style.match(/width: ([\d.]+)px/)?.[1] || "0");

    // Get the full width of the container (from the style calculation)
    const fullLength = 1175; // container width

    // Reverse the calculations from the original app
    // Original: left = (from * (fullLength / 14)) + 3
    // Therefore: from = (left - 3) / (fullLength / 14)
    const fromHour = (left - 3) / (fullLength / 14);

    // Original: width = ((to - from) * (fullLength / 14)) - 12
    // Therefore: to = (width + 12) / (fullLength / 14) + from
    const toHour = (width + 12) / (fullLength / 14) + fromHour;

    return new TimeSpan(
      new Time({ hour: Math.floor(fromHour) + 7, minute: Math.round((fromHour % 1) * 60) }),
      new Time({ hour: Math.floor(toHour) + 7, minute: Math.round((toHour % 1) * 60) })
    );
  }

  async scrapeSchedule(): Promise<ScrapedLectureData[]> {
    const schedule: ScrapedLectureData[] = [];

    // Wait for the schedule to load
    await (await this.page.waitForSelector(".schedule_all")).$$(".schedule_row");

    const days = await (await this.page.$$(".schedule_all"))[0].$$(".schedule_row");

    for (const [index, dayElement] of days.entries()) {
      const events: ScrapedEvent[] = [];

      const layers = await dayElement.$$(".schedule_row_layer");
      for (const layer of layers) {
        const cells = await layer.$$(".schedule_cell");
        for (const cell of cells) {
          const className = (await cell.getAttribute("class")) || "";
          const style = (await cell.getAttribute("style")) || "";

          events.push({
            courseId: await cell.$eval(".schedule_cell_name a", (el) => el.getAttribute("href")?.split("/").pop() || ""),
            courseName: await cell.$eval(".schedule_cell_name", (el) => el.textContent || ""),
            room: await cell.$eval(".schedule_cell_rooms", (el) => el.textContent?.trim() || ""),
            weeks: await cell.$eval(".schedule_cell_desc", (el) => el.textContent?.trim() || ""),
            info: await cell.$eval(".schedule_cell_info", (el) => el.textContent || ""),
            type: this.parseLectureType(className),
            row: await layer.evaluate((el) => Array.from(el.parentElement?.children || []).indexOf(el) + 1),
            timeSpan: this.parseTimeSpan(style),
          });
        }
      }

      schedule.push({
        day: Object.values(DAY)[index],
        events,
      });
    }

    return schedule;
  }
}
