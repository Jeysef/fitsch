// import { describe, expect, test } from 'vitest';
// import { coonjunctLectures } from '~/server/scraper/dataProvider';

// describe('dataProvider', () => {
//   test("should conjunct rooms", async () => {
//     let lectures = [
//       {
//         "type": "LABORATORY",
//         "day": "TUE",
//         "weeks": {
//           "weeks": [
//             1,
//             2,
//             3,
//             4,
//             5,
//             6,
//             8,
//             9,
//             10,
//             11,
//             12,
//             13
//           ],
//           "parity": null
//         },
//         "room": [
//           "N103"
//         ],
//         "start": "16:00",
//         "end": "17:50",
//         "capacity": "20",
//         "lectureGroup": [
//           "1BIA",
//           "1BIB",
//           "2BIA",
//           "2BIB"
//         ],
//         "groups": "xx",
//         "info": "Husa",
//         "note": null
//       },
//       {
//         "type": "LABORATORY",
//         "day": "TUE",
//         "weeks": {
//           "weeks": [
//             1,
//             2,
//             3,
//             4,
//             5,
//             6,
//             8,
//             9,
//             10,
//             11,
//             12,
//             13
//           ],
//           "parity": null
//         },
//         "room": [
//           "N104"
//         ],
//         "start": "16:00",
//         "end": "17:50",
//         "capacity": "20",
//         "lectureGroup": [
//           "1BIA",
//           "1BIB",
//           "2BIA",
//           "2BIB"
//         ],
//         "groups": "xx",
//         "info": "Dolejška",
//         "note": null
//       },
//       {
//         "type": "LABORATORY",
//         "day": "TUE",
//         "weeks": {
//           "weeks": [
//             1,
//             2,
//             3,
//             5,
//             6,
//             8,
//             9,
//             10,
//             11,
//             12,
//             13
//           ],
//           "parity": null
//         },
//         "room": [
//           "N105"
//         ],
//         "start": "16:00",
//         "end": "17:50",
//         "capacity": "20",
//         "lectureGroup": [
//           "1BIA",
//           "1BIB",
//           "2BIA",
//           "2BIB"
//         ],
//         "groups": "xx",
//         "info": "Ondrušková",
//         "note": null
//       },
//       {
//         "type": "LABORATORY",
//         "day": "TUE",
//         "weeks": {
//           "weeks": [
//             4
//           ],
//           "parity": null
//         },
//         "room": [
//           "N105"
//         ],
//         "start": "16:00",
//         "end": "17:50",
//         "capacity": "20",
//         "lectureGroup": [
//           "1BIA",
//           "1BIB",
//           "2BIA",
//           "2BIB"
//         ],
//         "groups": "xx",
//         "info": "Veigend",
//         "note": null
//       },
//     ]
//     const result = coonjunctLectures(lectures as any);
//     console.log("🚀 ~ file: dataProvider.test.ts:63 ~ test ~ result:", result)
//     expect(result).toEqual([
//       {
//         type: 'LABORATORY',
//         day: 'TUE',
//         weeks: { parity: null, weeks: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13] },
//         room: 'N103+4,5',
//         start: '16:00',
//         end: '17:50',
//         capacity: '20',
//         lectureGroup: ['1BIA', '1BIB', '2BIA', '2BIB'],
//         groups: 'xx',
//         info: 'Husa, Dolejška, Ondrušková, Veigend',
//         note: ', , , '
//       }
//     ]);
//   })
// })