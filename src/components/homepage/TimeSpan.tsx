import ChevronRight from "lucide-solid/icons/chevron-right";
import { ObjectTyped } from "object-typed";
import { createMemo, For, Index, Show } from "solid-js";
import type { SchedulerStore } from "~/components/scheduler/store";
import type { Course } from "~/components/scheduler/types";
import { typographyVariants } from "~/components/typography";
import Text from "~/components/typography/text";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitleLink } from "~/components/ui/card";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import type { LECTURE_TYPE } from "~/server/scraper/enums";

export interface TimeSpanProps {
  store: SchedulerStore;
}

export default function TimeSpan(props: TimeSpanProps) {
  const { t } = useI18n();
  const fallback = (
    <Text variant="largeText" class="text-center">
      {t("scheduler.timeSpan.empty")}
    </Text>
  );
  const selected = createMemo(() => props.store.selected);
  return (
    <div class="w-full max-w-4xl space-y-6 px-4">
      <Index each={props.store.courses} fallback={fallback}>
        {(course, index) => <TimeSpanCourse course={course()} selected={selected()[index]} />}
      </Index>
    </div>
  );
}

function TimeSpanCourse(props: { course: Course; selected: Record<LECTURE_TYPE, number> }) {
  const { t } = useI18n();

  const getColor = (valid: boolean) => (valid ? "bg-green-500" : "bg-red-500");
  const isAllCourseSelected = ObjectTyped.entries(props.course.metrics).every(
    ([type, { weeklyLectures }]) => props.selected[type] === weeklyLectures
  );
  return (
    <Card class="overflow-hidden">
      <CardHeader class="bg-muted space-y-0 relative">
        <div class={`absolute top-0 left-0 bottom-0 w-1 ${getColor(isAllCourseSelected)} `} />
        <CardTitleLink
          href={props.course.detail.link}
          class={cn(
            buttonVariants({ variant: "link" }),
            typographyVariants({ variant: "h4" }),
            "justify-start text-card-foreground p-0"
          )}
        >
          {props.course.detail.abbreviation} <ChevronRight size={20} />
        </CardTitleLink>
        <CardDescription class="text-accent-foreground !mt-0 !mb-4">{props.course.detail.name}</CardDescription>
        <For each={props.course.detail.timeSpanText}>
          {(hours) => (
            <Text variant="smallText" class="text-sm text-muted-foreground">
              {hours}
            </Text>
          )}
        </For>
      </CardHeader>
      <CardContent class="pt-4">
        <h3 class="text-sm tracking-wider mb-3">{t("scheduler.timeSpan.hoursAWeek")}</h3>
        <div class="space-y-2">
          <div class="grid grid-cols-[repeat(3,_minmax(min-content,_auto)),1fr] gap-x-4 items-center justify-start overflow-auto">
            <For each={ObjectTyped.entries(props.course.metrics)}>
              {([type, { weeks, weeklyLectures }]) => (
                <>
                  <div class="flex items-center gap-2">
                    <div class={`w-2 h-2 rounded-full shrink-0 ${getColor(props.selected[type] === weeklyLectures)}`} />
                    <Text variant="smallText" class="text-inherit text-sm capitalize">
                      {t(`scheduler.timeSpan.type.${type}`)}
                    </Text>
                  </div>
                  <Text variant="smallText" class="text-inherit text-sm">
                    {t("scheduler.timeSpan.weekly", { hours: weeklyLectures })}
                  </Text>
                  <span class="text-sm font-medium">
                    <Show when={props.selected[type] !== weeklyLectures}>
                      {t("scheduler.timeSpan.selected", { selected: props.selected[type] || 0 })}
                    </Show>
                  </span>
                  <Text variant="smallText" class="text-muted-foreground w-full flex justify-end  text-sm">
                    {t("scheduler.timeSpan.weeks", { weeks })}
                  </Text>
                </>
              )}
            </For>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
