// import { fromURL } from 'cheerio';
import { fromURL } from 'cheerio';
import fs from 'fs';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { StudyApi } from '~/server/scraper/api';
import { LanguageProvider } from '~/server/scraper/languageProvider';
import { DEGREE, LANGUAGE, SEMESTER, type StudyApiTypes } from '~/server/scraper/types';

vi.mock("cheerio", async () => {
  const cheerio = await vi.importActual('cheerio') as any;
  const loadWebsite = (url: string) => {
    const getUrl = () => {
      const lang = url.includes('.en') ? 'en' : 'cs'
      if (url.includes('programs')) {
        return "/htmls/programs.html"
      } if (url.includes('program')) {
        // right after program
        const program = url.split('program/')[1].split('/')[0]
        return `/htmls/program-${program}.html`
      } if (url.includes('calendar')) {
        return `/htmls/calendar.${lang}.html`
      } if (url.includes('course')) {
        const id = url.split('course/')[1].split('/')[0]
        console.log("🚀 ~ file: api.test.ts:24 ~ getUrl ~ id:", id)
        return `/htmls/course-${id}.html`
      }
      return
    }
    const htmlUrl = getUrl()
    if (!htmlUrl) return ""
    const website = fs.readFileSync(__dirname + htmlUrl).toString()
    return website
  }
  return {
    fromURL: vi.fn(async (url: string) => cheerio.load(loadWebsite(url)))
  }
})


describe.each([
  LANGUAGE.ENGLISH, LANGUAGE.CZECH
])('StudyApi lang: $lang', (lang: LANGUAGE) => {
  let languageProvider: LanguageProvider;
  let studyApi: StudyApi;

  beforeEach(() => {
    languageProvider = new LanguageProvider(lang);
    studyApi = new StudyApi(languageProvider);
  });

  afterAll(() => {
    vi.clearAllMocks()
  })

  test(`should be correct language for ${lang} lang`, async () => {
    const language = await studyApi["languageProvider"].language;
    expect(language).toBe(lang);
  });
  test(`should fetch the ${lang} language set`, async () => {
    const languageSet = await studyApi['getLanguageSet']();
    expect(languageSet).toEqual(await languageProvider.languageSet);
  });

  test('should fetch the document', async () => {
    const document = await studyApi['fetchDocument']("programs");
    expect(document).toBeDefined();
    expect(document.html()).toContain('<select id="year" name="year" class="select js-select" onchange="this.form.submit()">');
  });

  test("should get programs", async () => {
    const programs = await studyApi.getStudyPrograms();
    const expected = {
      programs: {
        BACHELOR: [
          {
            name: 'Information Technology',
            url: 'https://www.fit.vut.cz/study/program/8953/',
            isEnglish: false,
            specializations: [],
            attendanceType: 'full-time study',
            abbreviation: 'BIT'
          },
          {
            name: 'Information Technology',
            url: 'https://www.fit.vut.cz/study/program/8954/',
            isEnglish: true,
            specializations: [],
            attendanceType: 'full-time study',
            abbreviation: 'BIT'
          }
        ],
        MASTER: [
          {
            name: 'Master of Information Technology',
            url: 'https://www.fit.vut.cz/study/program/8966/',
            isEnglish: true,
            specializations: [],
            attendanceType: 'full-time study',
            abbreviation: 'MIT-EN'
          },
          {
            name: 'Information Technology and Artificial Intelligence',
            url: 'https://www.fit.vut.cz/study/program/8967/',
            isEnglish: false,
            specializations: [
              {
                abbreviation: 'NADE',
                name: 'Application Development',
                url: 'https://www.fit.vut.cz/study/field/16809/'
              },
              {
                abbreviation: 'NBIO',
                name: 'Bioinformatics and Biocomputing',
                url: 'https://www.fit.vut.cz/study/field/16824/'
              },
              {
                abbreviation: 'NGRI',
                name: 'Computer Graphics and Interaction',
                url: 'https://www.fit.vut.cz/study/field/16808/'
              },
              {
                abbreviation: 'NNET',
                name: 'Computer Networks',
                url: 'https://www.fit.vut.cz/study/field/16814/'
              },
              {
                abbreviation: 'NVIZ',
                name: 'Computer Vision',
                url: 'https://www.fit.vut.cz/study/field/16826/'
              },
              {
                abbreviation: 'NCPS',
                name: 'Cyberphysical Systems',
                url: 'https://www.fit.vut.cz/study/field/16816/'
              },
              {
                abbreviation: 'NSEC',
                name: 'Cybersecurity',
                url: 'https://www.fit.vut.cz/study/field/16812/'
              },
              {
                abbreviation: 'NEMB',
                name: 'Embedded Systems',
                url: 'https://www.fit.vut.cz/study/field/16823/'
              },
              {
                abbreviation: 'NHPC',
                name: 'High Performance Computing',
                url: 'https://www.fit.vut.cz/study/field/16817/'
              },
              {
                abbreviation: 'NISD',
                name: 'Information Systems and Databases',
                url: 'https://www.fit.vut.cz/study/field/16810/'
              },
              {
                abbreviation: 'NIDE',
                name: 'Intelligent Devices',
                url: 'https://www.fit.vut.cz/study/field/16819/'
              },
              {
                abbreviation: 'NISY',
                name: 'Intelligent Systems',
                url: 'https://www.fit.vut.cz/study/field/16820/'
              },
              {
                abbreviation: 'NMAL',
                name: 'Machine Learning',
                url: 'https://www.fit.vut.cz/study/field/16815/'
              },
              {
                abbreviation: 'NMAT',
                name: 'Mathematical Methods',
                url: 'https://www.fit.vut.cz/study/field/16811/'
              },
              {
                abbreviation: 'NSEN',
                name: 'Software Engineering',
                url: 'https://www.fit.vut.cz/study/field/16825/'
              },
              {
                abbreviation: 'NVER',
                name: 'Software Verification and Testing',
                url: 'https://www.fit.vut.cz/study/field/16818/'
              },
              {
                abbreviation: 'NSPE',
                name: 'Sound, Speech and Natural Language Processing',
                url: 'https://www.fit.vut.cz/study/field/16822/'
              }
            ],
            attendanceType: 'full-time study',
            abbreviation: 'MITAI'
          }
        ],
        DOCTORAL: [
          {
            name: 'Information Technology',
            url: 'https://www.fit.vut.cz/study/program/8956/',
            isEnglish: false,
            specializations: [],
            attendanceType: 'full-time study',
            abbreviation: 'DIT'
          },
          {
            name: 'Information Technology',
            url: 'https://www.fit.vut.cz/study/program/8955/',
            isEnglish: false,
            specializations: [],
            attendanceType: 'combined study',
            abbreviation: 'DIT'
          },
          {
            name: 'Information Technology',
            url: 'https://www.fit.vut.cz/study/program/8957/',
            isEnglish: true,
            specializations: [],
            attendanceType: 'full-time study',
            abbreviation: 'DIT-EN'
          },
          {
            name: 'Information Technology',
            url: 'https://www.fit.vut.cz/study/program/8958/',
            isEnglish: true,
            specializations: [],
            attendanceType: 'combined study',
            abbreviation: 'DIT-EN'
          },
          {
            name: 'Computer Science and Engineering',
            url: 'https://www.fit.vut.cz/study/program/9229/',
            isEnglish: false,
            specializations: [
              {
                abbreviation: 'FieldDVI42007-2024',
                name: 'Computer Science and Engineering',
                url: 'https://www.fit.vut.cz/study/field/17280/'
              }
            ],
            attendanceType: 'full-time study',
            abbreviation: 'VTI-DR-4'
          },
          {
            name: 'Computer Science and Engineering',
            url: 'https://www.fit.vut.cz/study/program/9230/',
            isEnglish: false,
            specializations: [
              {
                abbreviation: 'FieldDVI42007-2024',
                name: 'Computer Science and Engineering',
                url: 'https://www.fit.vut.cz/study/field/17281/'
              }
            ],
            attendanceType: 'combined study',
            abbreviation: 'VTI-DR-4'
          },
          {
            name: 'Computer Science and Engineering',
            url: 'https://www.fit.vut.cz/study/program/9231/',
            isEnglish: true,
            specializations: [
              {
                abbreviation: 'FieldDVI42007-2024English',
                name: 'Computer Science and Engineering',
                url: 'https://www.fit.vut.cz/study/field/17282/'
              }
            ],
            attendanceType: 'full-time study',
            abbreviation: 'VTI-DR-4'
          }
        ]
      },
      years: [
        { value: '2024', label: '2024/2025' },
        { value: '2023', label: '2023/2024' },
        { value: '2022', label: '2022/2023' },
        { value: '2021', label: '2021/2022' },
        { value: '2020', label: '2020/2021' },
        { value: '2019', label: '2019/2020' },
        { value: '2018', label: '2018/2019' },
        { value: '2017', label: '2017/2018' },
        { value: '2016', label: '2016/2017' },
        { value: '2015', label: '2015/2016' },
        { value: '2014', label: '2014/2015' },
        { value: '2013', label: '2013/2014' },
        { value: '2012', label: '2012/2013' },
        { value: '2011', label: '2011/2012' },
        { value: '2010', label: '2010/2011' },
        { value: '2009', label: '2009/2010' },
        { value: '2008', label: '2008/2009' },
        { value: '2007', label: '2007/2008' },
        { value: '2006', label: '2006/2007' },
        { value: '2005', label: '2005/2006' },
        { value: '2004', label: '2004/2005' },
        { value: '2003', label: '2003/2004' },
        { value: '2002', label: '2002/2003' },
        { value: '2001', label: '2001/2002' }
      ],
      currentYear: { value: '2024', label: '2024/2025' }
    }
    expect(programs).toEqual(expected);
  });

  test.each(Object.values(DEGREE).map(d => [2024, 2023, 2022, 2020].map(y => [d, y] as [DEGREE, number])).flat())("should use config in url", async (degree, year) => {
    const config: StudyApiTypes.getStudyProgramsConfig = {
      degree,
      year: year.toString()
    }
    const urlTypeDegrees = {
      [DEGREE.BACHELOR]: 'B',
      [DEGREE.MASTER]: 'N',
      [DEGREE.DOCTORAL]: 'D',
    }
    const programs = await studyApi.getStudyPrograms(config);
    expect(fromURL).toBeCalledWith(`https://www.fit.vut.cz/study/programs/.${lang}?degree=${urlTypeDegrees[degree]}&year=${year}`);

  })

  test.each([2024, 2023, 2022])(`should get calendar ${lang}`, async (year) => {
    const schedule = await studyApi.getTimeSchedule({ year });
    const expected = {
      [SEMESTER.WINTER]: new Date("2024-09-16"),
      [SEMESTER.SUMMER]: new Date("2025-02-10")
    }
    expect(fromURL).toBeCalledWith(`https://www.fit.vut.cz/study/calendar/${year}/.${lang}`);
    expect(schedule).toEqual(expected);
  })

  test("should get week number", async () => {
    let weekNumber = await studyApi.getWeekNumberInMonth(new Date("2024-09-16"));
    expect(weekNumber).toBe(4);

    // 2024 starts on Monday

    let date = new Date(2024, 0, 1);
    expect(await studyApi.getWeekNumberInMonth(date)).toBe(1);

    date = new Date(2024, 0, 8);
    expect(await studyApi.getWeekNumberInMonth(date)).toBe(2);

    date = new Date(2024, 0, 31);
    expect(await studyApi.getWeekNumberInMonth(date)).toBe(5);

    date = new Date(2024, 9, 1);
    expect(await studyApi.getWeekNumberInMonth(date)).toBe(1);

    date = new Date(2024, 9, 20);
    expect(await studyApi.getWeekNumberInMonth(date)).toBe(3);

    date = new Date(2023, 4, 1);
    expect(await studyApi.getWeekNumberInMonth(date)).toBe(1);

    date = new Date(2023, 3, 1);
    expect(await studyApi.getWeekNumberInMonth(date)).toBe(1);

    // 2024 january
    for (let i = 1; i <= 31; i++) {
      date = new Date(2024, 0, i);
      expect(await studyApi.getWeekNumberInMonth(date)).toBe(Math.ceil(i / 7));
    }
    // 2025 september
    for (let i = 1; i < 31; i++) {
      date = new Date(2025, 8, i);
      expect(await studyApi.getWeekNumberInMonth(date)).toBe(Math.ceil(i / 7));
    }

  });

  test("should get BIT study program courses", async () => {
    const courses = await studyApi.getStudyProgramCourses({ programUrl: "https://www.fit.vut.cz/study/program/8953/" });
    expect(Object.keys(courses).length).toBe(3);
    expect(courses[1].WINTER.length).toBe(34);
  })

  test("should get MIT study program courses", async () => {
    const courses = await studyApi.getStudyProgramCourses({ programUrl: "https://www.fit.vut.cz/study/program/8967/" });
    // MIT has specializations so there are no courses
    expect(Object.keys(courses).length).toBe(0);
  })

  test("should get MIT-NET study program courses", async () => {
    // real url is https://www.fit.vut.cz/study/field/16809/.en but for mocking purposes we use the program url
    const courses = await studyApi.getStudyProgramCourses({ programUrl: "https://www.fit.vut.cz/study/program/16809/.cs" });
    expect(Object.keys(courses).length).toBe(3);
    expect(courses["ALL"]).toBeDefined();
    expect(courses["ALL"]?.WINTER.length).toBe(51);
  })

  test("should get course details", async () => {
    const courses = await studyApi.getCourseDetail("281030");
    // TODO: add test when the interface is defined
  })
})


