
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
      day: "Po",
      room: "A1",
      start: "07:00",
      end: "09:00",
      type: "lecture",
    },
    {
      name: "IEL",
      link: "https://www.google.com",
      day: "Po",
      room: "A2",
      start: "07:00",
      end: "10:00",
      type: "lecture",
    },
    {
      name: "IEL",
      link: "https://www.google.com",
      day: "Po",
      room: "A2",
      start: "19:00",
      end: "20:00",
      type: "lecture",
    },
    {
      name: "ILG",
      link: "https://www.google.com",
      day: "Po",
      room: "A3",
      start: "08:00",
      end: "09:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: "Út",
      room: "A1",
      start: "08:00",
      end: "09:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: "St",
      room: "A1",
      start: "09:00",
      end: "10:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: "Čt",
      room: "A1",
      start: "10:00",
      end: "11:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: "Pá",
      room: "A1",
      start: "11:00",
      end: "12:00",
      type: "lecture",
    },
    {
      name: "IUS",
      link: "https://www.google.com",
      day: "Pá",
      room: "A1",
      start: "11:00",
      end: "12:00",
      type: "lecture",
    },
  ];
}