import ChevronRight from "lucide-solid/icons/chevron-right";
import { ObjectTyped } from "object-typed";
import { For, Show } from "solid-js";
import { type SchedulerStore } from "~/components/scheduler/store";
import type { CourseData } from "~/components/scheduler/types";
import Text from "~/components/typography/text";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { LECTURE_TYPE } from "~/server/scraper/enums";

export interface TimeSpanProps {
  store: SchedulerStore
}

export default function TimeSpan(props: TimeSpanProps) {
  const fallback = <Text variant="largeText" class="text-center text-gray-500">No courses</Text>
  const selected = props.store.selected
  return (
    <div class="w-full max-w-4xl space-y-6">
      <For each={props.store.courses} fallback={fallback}>
        {(course, index) => TimeSpanCourse(course, selected[index()])}
      </For>
    </div>
  )
}

function TimeSpanCourse(course: CourseData, selected: Record<LECTURE_TYPE, number>) {
  // const trackedLectureType = [LECTURE_TYPE.LECTURE, LECTURE_TYPE.SEMINAR, LECTURE_TYPE.EXERCISE, LECTURE_TYPE.LABORATORY]

  // const selected: Record<LECTURE_TYPE, number> = Object.values(events).reduce((acc, curr) => {
  //   acc[curr.event.type] += Math.ceil(schedulerTimeDurationMinutes(curr.event.start, curr.event.end) / 60)
  //   return acc
  // }, ObjectTyped.fromEntries(trackedLectureType.map(t => [t, 0])))

  // const lectureWeeks: Record<LECTURE_TYPE, { weeks: number, weeklyLectures: number }> = Object.values(course.data).reduce((acc, lecture) => {
  //   const { weeks, type, strongLinked } = lecture
  //   if (type === LECTURE_TYPE.EXAM) return acc;
  //   // weeklyLectureLength
  //   const finalDuration = strongLinked.reduce((acc, linked) => {
  //     const linkedLecture = course.data.find((l) => l.id === linked.id)
  //     if (!linkedLecture) return acc
  //     return acc + getLectureDuration(linkedLecture)
  //   }, getLectureDuration(lecture))
  //   acc[type].weeklyLectures = Math.max(acc[type].weeklyLectures, Math.ceil(finalDuration / 60))
  //   // lectureWeeks
  //   if (!Array.isArray(weeks.weeks)) return acc;
  //   acc[type].weeks = Math.max(acc[type].weeks, weeks.weeks.length)
  //   return acc
  // }, ObjectTyped.fromEntries(trackedLectureType.map(t => [t, { weeks: 0, weeklyLectures: 0 }])))
  // // filter out null values
  // ObjectTyped.entries(lectureWeeks).forEach(([key, value]) => {
  //   if (value.weeks === 0 && value.weeklyLectures === 0) delete lectureWeeks[key as keyof typeof lectureWeeks]
  //   else if (key === LECTURE_TYPE.EXAM) delete lectureWeeks[key as keyof typeof lectureWeeks]
  // })
  // const selected = course.
  return (
    <div class="border border-gray-200 rounded-lg hover:border-gray-300 bg-white overflow-hidden whitespace-nowrap">
      <div class="flex flex-col">
        {/* Left Column - Course ID & Total Hours */}
        <div class="p-4 bg-gray-50">
          <a href={course.detail.link} class={cn(buttonVariants({ variant: "link" }), "text-xl font-semibold text-gray-700 mb-4 p-0")}>{course.detail.abbreviation} <ChevronRight size={20} /></a>
          <div class="space-y-1.5">
            <For each={course.detail.timeSpanText}>
              {(hours) => (
                <div class="text-sm text-gray-600">
                  {hours}
                </div>
              )}
            </For>
          </div>
        </div>

        <div class="p-4">
          <div class="flex flex-col">
            <h3 class="text-sm uppercase tracking-wider text-gray-500 mb-3">Weekly Hours</h3>
            <div class="space-y-2">
              <div class="grid grid-cols-[repeat(3,_minmax(min-content,_auto)),1fr] gap-x-4 items-center justify-start overflow-auto">
                <For each={ObjectTyped.entries(course.metrics)}>
                  {([type, { weeks, weeklyLectures }]) => (
                    <>
                      <div class="flex items-center gap-2">
                        <div class={`w-2 h-2 rounded-full shrink-0 ${selected[type] === weeklyLectures ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span class="text-sm text-gray-600 capitalize">{type}</span>
                      </div>
                      <span class="text-sm font-medium">{weeklyLectures} hrs/week</span>
                      <span class="text-sm font-medium">
                        <Show when={selected[type] !== weeklyLectures}>
                          selected {selected[type] || 0}
                        </Show>
                      </span>
                      <span class="text-sm font-medium w-full flex justify-end">{weeks} weeks</span>
                    </>
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
