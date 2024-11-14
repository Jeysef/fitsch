import ChevronRight from "lucide-solid/icons/chevron-right";
import { ObjectTyped } from "object-typed";
import { For, Show } from "solid-js";
import { type SchedulerStore } from "~/components/scheduler/store";
import type { CourseData } from "~/components/scheduler/types";
import { typographyVariants } from "~/components/typography";
import Text from "~/components/typography/text";
import { buttonVariants } from "~/components/ui/button";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import type { LECTURE_TYPE } from "~/server/scraper/enums";

export interface TimeSpanProps {
  store: SchedulerStore
}

export default function TimeSpan(props: TimeSpanProps) {
  const { t } = useI18n()
  const fallback = <Text variant="largeText" class="text-center">{t("scheduler.timeSpan.empty")}</Text>
  return (
    <div class="w-full max-w-4xl space-y-6">
      <For each={props.store.courses} fallback={fallback}>
        {(course, index) => TimeSpanCourse(course, props.store.selected[index()])}
      </For>
    </div>
  )
}

function TimeSpanCourse(course: CourseData, selected: Record<LECTURE_TYPE, number>) {
  const { t } = useI18n()
  return (
    <div class="border border-gray-200 rounded-lg hover:border-gray-300 bg-white overflow-hidden whitespace-nowrap flex flex-col">
      <div class="flex flex-col p-4 bg-muted text-muted-foreground">
        <div class="flex flex-col mb-4">
          <a href={course.detail.link} class={cn(buttonVariants({ variant: "link" }), typographyVariants({ variant: "h4" }), "justify-normal text-card-foreground p-0")}>{course.detail.abbreviation} <ChevronRight size={20} /></a>
          <Text variant="smallText" class="text-accent-foreground">{course.detail.name}</Text>
        </div>
        <div class="space-y-1.5 flex flex-col">
          <For each={course.detail.timeSpanText}>
            {(hours) => <Text variant="smallText" class="text-inherit text-sm">{hours}</Text>}
          </For>
        </div>
      </div>

      <div class="p-4 text-foreground flex flex-col">
        <h3 class="text-sm tracking-wider mb-3">{t("scheduler.timeSpan.hoursAWeek")}</h3>
        <div class="space-y-2">
          <div class="grid grid-cols-[repeat(3,_minmax(min-content,_auto)),1fr] gap-x-4 items-center justify-start overflow-auto">
            <For each={ObjectTyped.entries(course.metrics)}>
              {([type, { weeks, weeklyLectures }]) => (
                <>
                  <div class="flex items-center gap-2">
                    <div class={`w-2 h-2 rounded-full shrink-0 ${selected[type] === weeklyLectures ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <Text variant="smallText" class="text-inherit text-sm capitalize">{t(`scheduler.timeSpan.type.${type}`)}</Text>
                  </div>
                  <Text variant="smallText" class="text-inherit text-sm">{t(`scheduler.timeSpan.weekly`, { hours: weeklyLectures })}</Text>
                  <span class="text-sm font-medium">
                    <Show when={selected[type] !== weeklyLectures}>
                      {t("scheduler.timeSpan.selected", { selected: selected[type] || 0 })}
                    </Show>
                  </span>
                  <Text variant="smallText" class="text-muted-foreground w-full flex justify-end  text-sm">{t("scheduler.timeSpan.weeks", { weeks })}</Text>
                </>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  )
}
