import { describe, expect, it } from "vitest";
import { Time, TimeSpan } from "~/components/scheduler/time";
import { parseWeek } from "~/server/scraper/utils";
import { DAY, LECTURE_TYPE } from "../enums";
import { conjunctLectures, type FilteredCourseLecture } from "../lectureMutator";

describe("conjunctLectures", () => {
  it("should conjunct lectures with same time and day", () => {
    const semesterStart = new Date("2024-09-16");
    const languageSet = {} as any;
    const lecturesCount = 4;

    const lecture1 = {
      id: "test-id-lecture1",
      day: DAY.THU,
      type: LECTURE_TYPE.EXERCISE,
      timeSpan: new TimeSpan(new Time({ hour: 13, minute: 0 }), new Time({ hour: 14, minute: 50 })),
      room: ["IO/E339"],
      groups: "xx",
      lectureGroup: [],
      capacity: "47",
      info: "Test info",
      weeks: {
        // parity: WEEK_PARITY.EVEN,
        // weeks: [3, 5, 7],
        ...parseWeek("3., 5., 7. výuky", semesterStart, languageSet),
        calculated: false,
      },
      lecturesCount,
    } as unknown as FilteredCourseLecture;

    const lecture2 = {
      id: "test-id-lecture2",
      day: DAY.THU,
      type: LECTURE_TYPE.EXERCISE,
      timeSpan: new TimeSpan(new Time({ hour: 13, minute: 0 }), new Time({ hour: 14, minute: 50 })),
      room: ["IO/E339"],
      groups: "xx",
      lectureGroup: [],
      capacity: "47",
      info: "Test info",
      weeks: {
        // parity: WEEK_PARITY.ODD,
        // weeks: [4, 6, 10],
        ...parseWeek("4., 6., 10. výuky", semesterStart, languageSet),
        calculated: false,
      },
      lecturesCount,
    } as unknown as FilteredCourseLecture;

    const lecture3 = {
      id: "test-id-lecture3",
      day: DAY.THU,
      type: LECTURE_TYPE.EXERCISE,
      timeSpan: new TimeSpan(new Time({ hour: 13, minute: 0 }), new Time({ hour: 14, minute: 50 })),
      room: ["IO/E339"],
      groups: "xx",
      lectureGroup: [],
      capacity: "47",
      info: "Test info",
      weeks: {
        // parity: WEEK_PARITY.ODD,
        // weeks: [8],
        ...parseWeek("2024-11-07", semesterStart, languageSet),
        calculated: false,
      },
      lecturesCount,
    } as unknown as FilteredCourseLecture;
    const lecture4 = {
      id: "test-id-lecture4",
      day: DAY.THU,
      type: LECTURE_TYPE.EXERCISE,
      timeSpan: new TimeSpan(new Time({ hour: 13, minute: 0 }), new Time({ hour: 14, minute: 50 })),
      room: ["IO/E339"],
      groups: "xx",
      lectureGroup: [],
      capacity: "47",
      info: "Test info",
      weeks: {
        // parity: WEEK_PARITY.EVEN,
        // weeks: [9],
        ...parseWeek("2024-11-14", semesterStart, languageSet),
        calculated: false,
      },
      lecturesCount,
    } as unknown as FilteredCourseLecture;

    const data = [lecture1, lecture2, lecture3, lecture4];
    // for (const [i, lecture] of data.entries()) {
    //   if (i === data.length - 1) break;
    //   console.log("🚀 ~ file: lectureMutator.test.ts:114 ~ it ~ lecture:", lecture);
    //   const nextLectures = data.slice(i + 1);
    //   conjunctLectures(lecture, nextLectures, 0, data);
    // }
    for (let i = 0; i < data.length; i++) {
      if (i === data.length - 1) break;
      const nextLectures = data.slice(i + 1);
      conjunctLectures(data[i], nextLectures, i, data);
    }
    // let index = 0;
    // let nextLectures = data.slice(index + 1);
    // conjunctLectures(data[index], nextLectures, index, data);

    // index = 1;
    // nextLectures = data.slice(index + 1);
    // conjunctLectures(data[index], nextLectures, index, data);

    // index = 2;
    // console.log("🚀 ~ file: lectureMutator.test.ts:137 ~ it ~ data[index]:", data[index]);
    // // nextLectures = data.slice(index + 1);
    // // conjunctLectures(data[index], nextLectures, index, data);

    // console.log(data);
    // print weeks
    // console.log(data.map((d) => d.weeks.weeks));
    expect(data.length).toBe(2);
    expect(data[0].weeks.weeks).toEqual([3, 5, 7, 9]);
    expect(data[1].weeks.weeks).toEqual([4, 6, 8, 10]);
    // expect(data[0].room).toEqual(["T9:105", "T9:107"]);
  });
  // it("should conjunct lectures with same time and day", () => {
  //   const lecture1 = createBaseLecture({
  //     id: "lecture1",
  //     room: ["T9:105"],
  //   });

  //   const lecture2 = createBaseLecture({
  //     id: "lecture2",
  //     room: ["T9:107"],
  //   });

  //   const data = [lecture1, lecture2];
  //   conjunctLectures(lecture1, [lecture2], 0, data);

  //   expect(data.length).toBe(1);
  //   expect(data[0].room).toEqual(["T9:105", "T9:107"]);
  // });

  // it("should not conjunct lectures with different days", () => {
  //   const lecture1 = createBaseLecture({
  //     id: "lecture1",
  //     day: "po",
  //   });

  //   const lecture2 = createBaseLecture({
  //     id: "lecture2",
  //     day: "ut",
  //   });

  //   const data = [lecture1, lecture2];
  //   conjunctLectures(lecture1, [lecture2], 0, data);

  //   expect(data.length).toBe(2);
  // });

  // it("should not conjunct lectures with different types", () => {
  //   const lecture1 = createBaseLecture({
  //     id: "lecture1",
  //     type: LECTURE_TYPE.LECTURE,
  //   });

  //   const lecture2 = createBaseLecture({
  //     id: "lecture2",
  //     type: LECTURE_TYPE.PRACTICE,
  //   });

  //   const data = [lecture1, lecture2];
  //   conjunctLectures(lecture1, [lecture2], 0, data);

  //   expect(data.length).toBe(2);
  // });

  // it("should conjunct lectures with same groups and merge weeks", () => {
  //   const lecture1 = createBaseLecture({
  //     id: "lecture1",
  //     weeks: {
  //       parity: WEEK_PARITY.EVEN,
  //       weeks: [2, 4, 6],
  //       calculated: true,
  //     },
  //   });

  //   const lecture2 = createBaseLecture({
  //     id: "lecture2",
  //     weeks: {
  //       parity: WEEK_PARITY.ODD,
  //       weeks: [1, 3, 5],
  //       calculated: true,
  //     },
  //   });

  //   const data = [lecture1, lecture2];
  //   conjunctLectures(lecture1, [lecture2], 0, data);

  //   expect(data.length).toBe(1);
  //   expect(data[0].weeks.weeks).toEqual([1, 2, 3, 4, 5, 6]);
  // });
});
