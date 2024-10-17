import { DAY } from "~/server/scraper/types";

export interface IData {
  name: string;
  link: string;
  day: string;
  room: string;
  start: string;
  end: string;
  type: string;
}

export function getData() {
  return [
    {
      name: "IUS",
      link: "https://www.google.com",
      day: DAY.MON,
      room: "A1",
      start: "07:00",
      end: "09:00",
      type: "lecture",
    },
    {
      name: "IEL",
      link: "https://www.google.com",
      day: DAY.MON,
      room: "A2",
      start: "07:00",
      end: "10:00",
      type: "lecture",
    },
    {
      name: "IEL",
      link: "https://www.google.com",
      day: DAY.MON,
      room: "A2",
      start: "19:00",
      end: "20:00",
      type: "lecture",
    },
    {
      name: "ILG",
      link: "https://www.google.com",
      day: DAY.MON,
      room: "A3",
      start: "08:00",
      end: "09:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: DAY.TUE,
      room: "A1",
      start: "08:00",
      end: "09:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: DAY.WED,
      room: "A1",
      start: "09:00",
      end: "10:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: DAY.THU,
      room: "A1",
      start: "10:00",
      end: "11:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: DAY.FRI,
      room: "A1",
      start: "11:00",
      end: "12:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: DAY.FRI,
      room: "A1",
      start: "11:00",
      end: "12:00",
      type: "lecture",
    },
  ];
}