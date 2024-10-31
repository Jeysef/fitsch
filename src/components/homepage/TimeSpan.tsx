import { ObjectTyped } from "object-typed";
import { createEffect, For } from "solid-js";
import { schedulerTimeDuration, type ParsedEvent, type SchedulerStore } from "~/components/scheduler/store";
import { LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture, MgetStudyCourseDetailsReturn } from "~/server/scraper/lectureMutator";

export interface TimeSpanProps {
  store: SchedulerStore
}

export default function TimeSpan(props: TimeSpanProps) {
  // show all courses
  // for every course it's clickable abbreviation timespan,and coursesLength 
  // console.log("🚀 ~ file: TimeSpan.tsx:26 ~ TimeSpan ~ props.store.courses:", props.store._courses)
  return (
    <div class="w-full max-w-4xl space-y-6">
      <For each={props.store.courses}>
        {(course) => TimeSpanCourse(course, Object.values(props.store.data).flatMap(day => day.events).filter((event) => event.event.abbreviation === course.detail.abbreviation))}
      </For>
    </div>
  )

}

function getLectureDuration(lecture: MCourseLecture) {
  const start = lecture.start.split(':').map(Number)
  const end = lecture.end.split(':').map(Number)
  return (end[0] * 60 + end[1]) - (start[0] * 60 + start[1])
}

function TimeSpanCourse(course: MgetStudyCourseDetailsReturn, events: ParsedEvent[]) {
  const trackedLectureType = [LECTURE_TYPE.LECTURE, LECTURE_TYPE.SEMINAR, LECTURE_TYPE.EXERCISE, LECTURE_TYPE.LABORATORY]

  const weeklyLectureLength: Record<LECTURE_TYPE, number> = ObjectTyped.fromEntries(course.data.map((lecture) => {
    const finalDuration = lecture.strongLinked.reduce((acc, linked) => {
      const linkedLecture = course.data.find((l) => l.id === linked.id)
      if (!linkedLecture) return acc
      return acc + getLectureDuration(linkedLecture)
    }, getLectureDuration(lecture))
    return [lecture.type, Math.ceil(finalDuration / 60)] as const
  }) as [LECTURE_TYPE, number][])
  // filter out exams
  ObjectTyped.entries(weeklyLectureLength).forEach(([key, value]) => {
    if (value === 0) delete weeklyLectureLength[key as keyof typeof weeklyLectureLength]
    else if (key === LECTURE_TYPE.EXAM) delete weeklyLectureLength[key as keyof typeof weeklyLectureLength]
  })
  const selected: Record<LECTURE_TYPE, number> = Object.values(events).reduce((acc, curr) => {
    acc[curr.event.type] += Math.ceil(schedulerTimeDuration(curr.event.start, curr.event.end) / 60)
    return acc
  }, ObjectTyped.fromEntries(trackedLectureType.map(t => [t, 0])))

  createEffect(() => {
    console.log("🚀 ~ file: TimeSpan.tsx:46 ~ constselected:Record<LECTURE_TYPE,number>=Object.values ~ selected:", selected)
  })
  // convert to hours
  // ObjectTyped.entries(selected).forEach(([key, value]) => {
  //   selected[key] = Math.ceil(value / 60)
  // })

  const lectureWeeks: Record<LECTURE_TYPE, number> = Object.values(course.data).reduce((acc, { weeks, type }) => {
    if (type === LECTURE_TYPE.EXAM) return acc;
    if (!Array.isArray(weeks.weeks)) return acc;
    console.log("🚀 ~ file: TimeSpan.tsx:64 ~ constlectureWeeks:Record<LECTURE_TYPE,number>=Object.values ~ weeks.weeks.length:", weeks.weeks.length)
    acc[type] = Math.max(acc[type], weeks.weeks.length)
    return acc
  }, ObjectTyped.fromEntries(trackedLectureType.map(t => [t, 0])))
  // filter out null values
  ObjectTyped.entries(lectureWeeks).forEach(([key, value]) => {
    if (value === 0) delete lectureWeeks[key as keyof typeof lectureWeeks]
    else if (key === LECTURE_TYPE.EXAM) delete lectureWeeks[key as keyof typeof lectureWeeks]
  })

  // let weeklyLectureLength: Record<LECTURE_TYPE, number> = ObjectTyped.fromEntries(trackedLectureType.map(t => [t, 0]))
  // let lectureWeeks: Record<LECTURE_TYPE, number | string> = ObjectTyped.fromEntries(trackedLectureType.map(t => [t, 0]))

  // for (const lecture of course.data) {
  //   if (lecture.type === LECTURE_TYPE.EXAM) continue;
  //   const finalDuration = lecture.strongLinked.reduce((acc, linked) => {
  //     const linkedLecture = course.data.find((l) => l.id === linked.id)
  //     if (!linkedLecture) return acc
  //     return acc + getLectureDuration(linkedLecture)
  //   }, getLectureDuration(lecture))
  //   weeklyLectureLength[lecture.type] = Math.max(weeklyLectureLength[lecture.type], Math.ceil(finalDuration / 60))

  //   if (Array.isArray(lecture.weeks.weeks)) {
  //     lectureWeeks[lecture.type] = typeof lectureWeeks[lecture.type] === "string" ? lecture.lecturesCount || lecture.weeks.weeks.length : Math.max(lectureWeeks[lecture.type] as number, lecture.lecturesCount || lecture.weeks.weeks.length)
  //   } else {
  //     lectureWeeks[lecture.type] = lecture.weeks.weeks
  //   }
  // }


  return (
    <div class="border border-gray-200 rounded-lg hover:border-gray-300 bg-white overflow-hidden">
      <div class="flex flex-col">
        {/* Left Column - Course ID & Total Hours */}
        <div class="p-4 bg-gray-50">
          <div class="text-xl font-semibold text-gray-700 mb-4">{course.detail.abbreviation}</div>
          <div class="space-y-1.5">
            <For each={course.detail.timeSpanText}>
              {(hours) => (
                <div class="text-sm text-gray-600">
                  {hours}
                </div>
              )}
            </For>
            {/* <Text variant="smallText">{course.detail.timeSpanText}</Text> */}
          </div>
        </div>

        {/* Right Column - Weekly & Semester Details */}
        <div class="p-4">
          <div class="grid grid-cols-2 gap-8">
            {/* Weekly Hours */}
            <div>
              <h3 class="text-sm uppercase tracking-wider text-gray-500 mb-3">Weekly Hours</h3>
              <div class="space-y-2">
                <For each={ObjectTyped.entries(weeklyLectureLength)}>
                  {(weekly) => (
                    <div class="grid grid-cols-3 items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div
                          class={`w-2 h-2 rounded-full ${selected[weekly[0]] === weekly[1] ? 'bg-emerald-500' : 'bg-red-500'}`}
                        />
                        <span class="text-sm text-gray-600 capitalize">{weekly[0]}</span>
                      </div>
                      <span class="text-sm font-medium">{weekly[1]} hrs/week</span>
                      {
                        selected[weekly[0]] !== weekly[1] &&
                        <span class="text-sm font-medium">selected {selected[weekly[0]]}</span>
                      }
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Semester Sessions */}
            <div>
              <h3 class="text-sm uppercase tracking-wider text-gray-500 mb-3">Semester Sessions</h3>
              <div class="space-y-2">
                <For each={ObjectTyped.entries(lectureWeeks)}>
                  {([type, count]) => (
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 capitalize">{type}</span>
                      <span class="text-sm font-medium">{count}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}