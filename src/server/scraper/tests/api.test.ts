import fs from "node:fs";
// import { fromURL } from 'cheerio';
import { load } from "cheerio";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { StudyApi } from "~/server/scraper/api";
import { LanguageProvider } from "~/server/scraper/languageProvider";
import type { StudyApiTypes } from "~/server/scraper/types";
import { LANGUAGE } from "../../../enums";
import { DEGREE, SEMESTER } from "../enums";

const loadWebsite = (url: string) => {
  const getUrl = () => {
    const lang = url.includes(".en") ? "en" : "cs";
    if (url.includes("programs")) {
      return "/htmls/programs.html";
    }
    if (url.includes("program")) {
      // right after program
      const program = url.split("program/")[1].split("/")[0];
      return `/htmls/program-${program}.html`;
    }
    if (url.includes("calendar")) {
      return `/htmls/calendar.${lang}.html`;
    }
    if (url.includes("course")) {
      const id = url.split("course/")[1].split("/")[0];
      return `/htmls/course-${id}.html`;
    }
    return;
  };
  const htmlUrl = getUrl();
  if (!htmlUrl) return "";
  const website = fs.readFileSync(__dirname + htmlUrl).toString();
  return website;
};
const fetcher = vi.fn().mockImplementation(async (url: string) => load(loadWebsite(url)));

describe.each([LANGUAGE.ENGLISH, LANGUAGE.CZECH])("StudyApi lang: $lang", (lang: LANGUAGE) => {
  let languageProvider: LanguageProvider;
  let studyApi: StudyApi;

  beforeEach(() => {
    languageProvider = new LanguageProvider(lang);
    studyApi = new StudyApi(languageProvider, fetcher);
  });

  test(`should be correct language for ${lang} lang`, async () => {
    // @ts-expect-error private property
    const language = studyApi.languageProvider.language;
    expect(language).toBe(lang);
  });
  test(`should fetch the ${lang} language set`, async () => {
    // @ts-expect-error private property
    const languageSet = await studyApi.getLanguageSet();
    expect(languageSet).toEqual(await languageProvider.languageSet);
  });

  test("should fetch the document", async () => {
    // @ts-expect-error private property
    const document = await studyApi.fetchDocument("programs");
    expect(document).toBeDefined();
    expect(document.html()).toContain(
      '<select id="year" name="year" class="select js-select" onchange="this.form.submit()">'
    );
  });

  test("should get programs", async () => {
    const programs = await studyApi.getStudyPrograms();
    const expected = {
      currentYear: { label: "2024/2025", value: "2024" },
      programs: {
        BACHELOR: {
          "program-8953": {
            abbreviation: "BIT",
            attendanceType: "full-time study",
            id: "program-8953",
            isEnglish: false,
            name: "Information Technology",
            specializations: [],
            url: "https://www.fit.vut.cz/study/program/8953/",
          },
          "program-8954": {
            abbreviation: "BIT",
            attendanceType: "full-time study",
            id: "program-8954",
            isEnglish: true,
            name: "Information Technology",
            specializations: [],
            url: "https://www.fit.vut.cz/study/program/8954/",
          },
        },
        DOCTORAL: {
          "program-8955": {
            abbreviation: "DIT",
            attendanceType: "combined study",
            id: "program-8955",
            isEnglish: false,
            name: "Information Technology",
            specializations: [],
            url: "https://www.fit.vut.cz/study/program/8955/",
          },
          "program-8956": {
            abbreviation: "DIT",
            attendanceType: "full-time study",
            id: "program-8956",
            isEnglish: false,
            name: "Information Technology",
            specializations: [],
            url: "https://www.fit.vut.cz/study/program/8956/",
          },
          "program-8957": {
            abbreviation: "DIT-EN",
            attendanceType: "full-time study",
            id: "program-8957",
            isEnglish: true,
            name: "Information Technology",
            specializations: [],
            url: "https://www.fit.vut.cz/study/program/8957/",
          },
          "program-8958": {
            abbreviation: "DIT-EN",
            attendanceType: "combined study",
            id: "program-8958",
            isEnglish: true,
            name: "Information Technology",
            specializations: [],
            url: "https://www.fit.vut.cz/study/program/8958/",
          },
          "program-9229": {
            abbreviation: "VTI-DR-4",
            attendanceType: "full-time study",
            id: "program-9229",
            isEnglish: false,
            name: "Computer Science and Engineering",
            specializations: [
              {
                abbreviation: "DVI4",
                id: "field-17280",
                name: "Computer Science and Engineering",
                url: "https://www.fit.vut.cz/study/field/17280/",
              },
            ],
            url: "https://www.fit.vut.cz/study/program/9229/",
          },
          "program-9230": {
            abbreviation: "VTI-DR-4",
            attendanceType: "combined study",
            id: "program-9230",
            isEnglish: false,
            name: "Computer Science and Engineering",
            specializations: [
              {
                abbreviation: "DVI4",
                id: "field-17281",
                name: "Computer Science and Engineering",
                url: "https://www.fit.vut.cz/study/field/17281/",
              },
            ],
            url: "https://www.fit.vut.cz/study/program/9230/",
          },
          "program-9231": {
            abbreviation: "VTI-DR-4",
            attendanceType: "full-time study",
            id: "program-9231",
            isEnglish: true,
            name: "Computer Science and Engineering",
            specializations: [
              {
                abbreviation: "DVI4",
                id: "field-17282",
                name: "Computer Science and Engineering",
                url: "https://www.fit.vut.cz/study/field/17282/",
              },
            ],
            url: "https://www.fit.vut.cz/study/program/9231/",
          },
        },
        MASTER: {
          "program-8966": {
            abbreviation: "MIT-EN",
            attendanceType: "full-time study",
            id: "program-8966",
            isEnglish: true,
            name: "Master of Information Technology",
            specializations: [],
            url: "https://www.fit.vut.cz/study/program/8966/",
          },
          "program-8967": {
            abbreviation: "MITAI",
            attendanceType: "full-time study",
            id: "program-8967",
            isEnglish: false,
            name: "Information Technology and Artificial Intelligence",
            specializations: [
              {
                abbreviation: "NADE",
                id: "field-16809",
                name: "Application Development",
                url: "https://www.fit.vut.cz/study/field/16809/",
              },
              {
                abbreviation: "NBIO",
                id: "field-16824",
                name: "Bioinformatics and Biocomputing",
                url: "https://www.fit.vut.cz/study/field/16824/",
              },
              {
                abbreviation: "NGRI",
                id: "field-16808",
                name: "Computer Graphics and Interaction",
                url: "https://www.fit.vut.cz/study/field/16808/",
              },
              {
                abbreviation: "NNET",
                id: "field-16814",
                name: "Computer Networks",
                url: "https://www.fit.vut.cz/study/field/16814/",
              },
              {
                abbreviation: "NVIZ",
                id: "field-16826",
                name: "Computer Vision",
                url: "https://www.fit.vut.cz/study/field/16826/",
              },
              {
                abbreviation: "NCPS",
                id: "field-16816",
                name: "Cyberphysical Systems",
                url: "https://www.fit.vut.cz/study/field/16816/",
              },
              {
                abbreviation: "NSEC",
                id: "field-16812",
                name: "Cybersecurity",
                url: "https://www.fit.vut.cz/study/field/16812/",
              },
              {
                abbreviation: "NEMB",
                id: "field-16823",
                name: "Embedded Systems",
                url: "https://www.fit.vut.cz/study/field/16823/",
              },
              {
                abbreviation: "NHPC",
                id: "field-16817",
                name: "High Performance Computing",
                url: "https://www.fit.vut.cz/study/field/16817/",
              },
              {
                abbreviation: "NISD",
                id: "field-16810",
                name: "Information Systems and Databases",
                url: "https://www.fit.vut.cz/study/field/16810/",
              },
              {
                abbreviation: "NIDE",
                id: "field-16819",
                name: "Intelligent Devices",
                url: "https://www.fit.vut.cz/study/field/16819/",
              },
              {
                abbreviation: "NISY",
                id: "field-16820",
                name: "Intelligent Systems",
                url: "https://www.fit.vut.cz/study/field/16820/",
              },
              {
                abbreviation: "NMAL",
                id: "field-16815",
                name: "Machine Learning",
                url: "https://www.fit.vut.cz/study/field/16815/",
              },
              {
                abbreviation: "NMAT",
                id: "field-16811",
                name: "Mathematical Methods",
                url: "https://www.fit.vut.cz/study/field/16811/",
              },
              {
                abbreviation: "NSEN",
                id: "field-16825",
                name: "Software Engineering",
                url: "https://www.fit.vut.cz/study/field/16825/",
              },
              {
                abbreviation: "NVER",
                id: "field-16818",
                name: "Software Verification and Testing",
                url: "https://www.fit.vut.cz/study/field/16818/",
              },
              {
                abbreviation: "NSPE",
                id: "field-16822",
                name: "Sound, Speech and Natural Language Processing",
                url: "https://www.fit.vut.cz/study/field/16822/",
              },
            ],
            url: "https://www.fit.vut.cz/study/program/8967/",
          },
        },
      },
      years: [
        { label: "2024/2025", value: "2024" },
        { label: "2023/2024", value: "2023" },
        { label: "2022/2023", value: "2022" },
        { label: "2021/2022", value: "2021" },
        { label: "2020/2021", value: "2020" },
        { label: "2019/2020", value: "2019" },
        { label: "2018/2019", value: "2018" },
        { label: "2017/2018", value: "2017" },
        { label: "2016/2017", value: "2016" },
        { label: "2015/2016", value: "2015" },
        { label: "2014/2015", value: "2014" },
        { label: "2013/2014", value: "2013" },
        { label: "2012/2013", value: "2012" },
        { label: "2011/2012", value: "2011" },
        { label: "2010/2011", value: "2010" },
        { label: "2009/2010", value: "2009" },
        { label: "2008/2009", value: "2008" },
        { label: "2007/2008", value: "2007" },
        { label: "2006/2007", value: "2006" },
        { label: "2005/2006", value: "2005" },
        { label: "2004/2005", value: "2004" },
        { label: "2003/2004", value: "2003" },
        { label: "2002/2003", value: "2002" },
        { label: "2001/2002", value: "2001" },
      ],
    };
    expect(programs).toEqual(expected);
    expect(programs).toBeDefined();
    expect(programs.programs).toBeDefined();
    expect(programs.years).toBeInstanceOf(Array);
    expect(programs.currentYear).toBeDefined();

    // Verify structure for bachelor programs
    const bachelorPrograms = programs.programs[DEGREE.BACHELOR];
    expect(bachelorPrograms).toBeDefined();
    expect(Object.values(bachelorPrograms)[0]).toMatchObject({
      name: expect.any(String),
      url: expect.any(String),
      isEnglish: expect.any(Boolean),
      specializations: expect.any(Array),
      attendanceType: expect.any(String),
      abbreviation: expect.any(String),
      id: expect.any(String),
    });
  });

  test("should get program courses", async () => {
    const courses = await studyApi.getStudyProgramCourses({
      programUrl: "https://www.fit.vut.cz/study/program/8953/",
    });
    expect(courses).toBeDefined();

    // Check structure of courses
    const firstYearCourses = courses["1"];
    expect(firstYearCourses).toBeDefined();
    expect(firstYearCourses[SEMESTER.WINTER]).toBeInstanceOf(Array);
    expect(firstYearCourses[SEMESTER.WINTER][0]).toMatchObject({
      abbreviation: expect.any(String),
      name: expect.any(String),
      url: expect.any(String),
      credits: expect.any(String),
      obligation: expect.any(String),
      completion: expect.any(String),
      faculty: expect.any(String),
      note: expect.any(Boolean),
      id: expect.any(String),
    });
  });

  test.each(Object.values(DEGREE).flatMap((d) => [2024, 2023, 2022, 2020].map((y) => [d, y] as [DEGREE, number])))(
    "should use config in url",
    async (degree, year) => {
      const config: StudyApiTypes.getStudyProgramsConfig = {
        degree,
        year: year.toString(),
      };
      const urlTypeDegrees = {
        [DEGREE.BACHELOR]: "B",
        [DEGREE.MASTER]: "N",
        [DEGREE.DOCTORAL]: "D",
      };
      const programs = await studyApi.getStudyPrograms(config);
      expect(fetcher).toBeCalledWith(
        `https://www.fit.vut.cz/study/programs/.${lang}?degree=${urlTypeDegrees[degree]}&year=${year}`
      );
    }
  );

  test.each(["2024", "2023", "2022"])(`should get calendar ${lang}`, async (year) => {
    // @ts-expect-error private property
    const schedule = await studyApi.getTimeSchedule({ year });
    const expected = {
      [SEMESTER.WINTER]: {
        start: new Date("2024-09-16T00:00:00.000Z"),
        end: new Date("2024-12-13T00:00:00.000Z"),
      },
      [SEMESTER.SUMMER]: { start: new Date("2025-02-10T00:00:00.000Z"), end: new Date("2025-05-09T00:00:00.000Z") },
    };
    expect(fetcher).toBeCalledWith(`https://www.fit.vut.cz/study/calendar/${year}/.${lang}`);
    expect(schedule).toEqual(expected);
  });

  test("should get BIT study program courses", async () => {
    const courses = await studyApi.getStudyProgramCourses({ programUrl: "https://www.fit.vut.cz/study/program/8953/" });
    expect(Object.keys(courses).length).toBe(3);
    expect(courses[1].WINTER.length).toBe(34);
  });

  test("should get MIT study program courses", async () => {
    const courses = await studyApi.getStudyProgramCourses({ programUrl: "https://www.fit.vut.cz/study/program/8967/" });
    // MIT has specializations so there are no courses
    expect(Object.keys(courses).length).toBe(0);
  });

  test("should get MIT-NET study program courses", async () => {
    // real url is https://www.fit.vut.cz/study/field/16809/.en but for mocking purposes we use the program url
    const courses = await studyApi.getStudyProgramCourses({ programUrl: "https://www.fit.vut.cz/study/program/16809/.cs" });
    expect(Object.keys(courses).length).toBe(3);
    expect(courses.ALL).toBeDefined();
    expect(courses.ALL.WINTER.length).toBe(51);
  });

  test("should get course details", async () => {
    const courseDetails = await studyApi.getStudyCoursesDetails({
      courses: ["281030"],
      year: "2024",
      semester: SEMESTER.WINTER,
    });
    expect(courseDetails).toBeDefined();
    expect(courseDetails.semesterTimeSchedule).toMatchObject({
      start: expect.any(Date),
      end: expect.any(Date),
    });

    const firstCourse = courseDetails.data[0];
    expect(firstCourse.detail).toMatchObject({
      abbreviation: expect.any(String),
      name: expect.any(String),
      link: expect.any(String),
      timeSpan: expect.any(Object),
      timeSpanText: expect.any(Array),
      id: expect.any(String),
    });

    expect(firstCourse.data[0]).toMatchObject({
      capacity: expect.any(String),
      groups: expect.any(String),
      info: expect.any(String),
      lectureGroup: expect.any(Array),
      room: expect.any(Array),
      timeSpan: expect.any(Object),
      type: expect.any(String),
      weeks: expect.any(Object),
    });
  });

  test("should handle empty course list", async () => {
    const courseDetails = await studyApi.getStudyCoursesDetails({
      courses: [],
      year: "2024",
      semester: SEMESTER.WINTER,
    });
    expect(courseDetails.data).toHaveLength(0);
    expect(courseDetails.semesterTimeSchedule).toBeDefined();
  });

  test("should get time schedule", async () => {
    const schedule = await studyApi.getStudyCoursesDetails({
      courses: ["281030"],
      year: "2024",
      semester: SEMESTER.WINTER,
    });
    expect(schedule.semesterTimeSchedule).toMatchObject({
      start: new Date("2024-09-16T00:00:00.000Z"),
      end: new Date("2024-12-13T00:00:00.000Z"),
    });
  });
});
