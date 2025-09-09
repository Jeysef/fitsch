import { Tooltip } from "@kobalte/core/tooltip";
import { flattenObject } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import ChevronRight from "lucide-solid/icons/chevron-right";
import Link from "lucide-solid/icons/link";
import { For, Show, Suspense, batch, createMemo, type JSXElement } from "solid-js";
import { ItemText, SectionHeading, SubSectionHeading } from "~/components/menu/MenuCommonComponents";
import { getData, getGroup } from "~/components/menu/MenuContent";
import { useLocalMenuData } from "~/components/menu/MenuLocalDataProvider";
import {
  getCurrentSelectedCourseId,
  getCurrentSelectedCourseIds,
  getSelectedCourseIds,
  handleCourseSelection,
  isSelectedEqual,
} from "~/components/menu/utils";
import { typographyVariants } from "~/components/typography";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxControl, CheckboxLabel } from "~/components/ui/checkbox";
import Loader from "~/components/ui/loader";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemInput,
  RadioGroupItemLabel,
} from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { OBLIGATION, SEMESTER, type DEGREE } from "~/enums/enums";
import { useI18n } from "~/i18n";
import { usePostHog } from "~/lib/posthog";
import type { CourseOverview } from "~/server/scraper/types/course.types";
import type { GradeOverview } from "~/server/scraper/types/grade.types";
import type { ProgramOverviewBase, ProgramUrl } from "~/server/scraper/types/program.types";
import type { OverviewYear } from "~/server/scraper/types/year.types";
import { asMerge } from "~/utils/asMerge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

const SelectedCountIndicator = (count: number) => {
  return (
    <span class="inline-block whitespace-nowrap rounded-full bg-orange-400 px-2 py-1 text-center align-baseline text-xxs font-bold leading-none text-white">
      {count}
    </span>
  );
};

export function YearSelect() {
  const group = getGroup();
  const data = getData();
  const { t } = useI18n();

  return (
    <Select
      options={data()?.data.years ?? []}
      optionValue="value"
      optionTextValue="label"
      value={group.controls.year.value}
      name="year"
      onChange={(year) => year && group.controls.year.setValue(year)}
      placeholder="Select a year"
      selectionBehavior="replace"
      onBlur={() => group.controls.year.markTouched(true)}
      disabled={group.controls.year.isDisabled}
      required={group.controls.year.isRequired}
      validationState={group.controls.year.errors ? "invalid" : "valid"}
      itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>}
    >
      <Select.Label as={SectionHeading}>{t("menu.year.title")}</Select.Label>
      <SelectTrigger>
        <SelectValue<OverviewYear, typeof ItemText> as={ItemText}>{(state) => state.selectedOption()?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent class="max-h-56 overflow-y-auto" />
    </Select>
  );
}

export function DegreeSelect() {
  const group = getGroup();
  const data = getData();
  const { t } = useI18n();

  const SelectedHiddenDegrees = ({ degree }: { degree: DEGREE }) => {
    const count = createMemo(() => {
      const allCurrentSelectedCoursesforGrade = getSelectedCourseIds(group, { degree }).length;

      return allCurrentSelectedCoursesforGrade || null;
    });

    return (
      <Show when={group.controls.degree.value !== degree && count()} keyed>
        {SelectedCountIndicator}
      </Show>
    );
  };

  return (
    <RadioGroup
      value={group.controls.degree.value!}
      onChange={group.controls.degree.setValue as (value: string) => void}
      name="degree"
      onBlur={() => group.controls.degree.markTouched(true)}
      disabled={group.controls.degree.isDisabled}
      required={group.controls.degree.isRequired}
      class="grid gap-x-2"
    >
      <RadioGroup.Label as={SectionHeading}>{t("menu.degree.title")}</RadioGroup.Label>
      <For each={data()?.data.degrees}>
        {(degree) => (
          <RadioGroupItem value={degree} class="flex items-center gap-2">
            <RadioGroupItemInput />
            <RadioGroupItemControl class="cursor-pointer" />
            <RadioGroupItemLabel as={asMerge([ItemText, RadioGroupItemLabel])}>
              {t(`menu.degree.data.${degree}`)}
            </RadioGroupItemLabel>
            <SelectedHiddenDegrees degree={degree} />
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  );
}

export function ProgramSelect() {
  const group = getGroup();
  const data = getData();
  const { t } = useI18n();

  const SelectedHiddenPrograms = ({ program }: { program: ProgramUrl }) => {
    const count = createMemo(() => {
      const allCurrentSelectedCoursesforGrade = getSelectedCourseIds(group, {
        degree: group.controls.degree.value,
        program,
      }).length;

      return allCurrentSelectedCoursesforGrade || null;
    });

    return (
      <Show when={group.controls.program.value !== program && count()} keyed>
        {SelectedCountIndicator}
      </Show>
    );
  };

  const ProgramRadioLabel = (props: { program: ProgramOverviewBase }) => {
    const program = props.program;
    return (
      <Tooltip placement="right" flip="top" gutter={12}>
        <TooltipTrigger as={asMerge([RadioGroupItemLabel, ItemText])} class="cursor-pointer">
          {program.abbreviation}
        </TooltipTrigger>
        <TooltipContent class="bg-secondary text-secondary-foreground space-x-1 flex items-center">
          <ItemText class="text-secondary-foreground">{program.name}</ItemText>
          <a href={program.url} target="_blank" rel="noopener noreferrer">
            <Link class="w-4 h-4" />
          </a>
        </TooltipContent>
      </Tooltip>
    );
  };

  const RadioItem = (program: ProgramOverviewBase) => (
    <RadioGroupItem value={program.url} class="flex items-center gap-2">
      <RadioGroupItemInput />
      <RadioGroupItemControl class="cursor-pointer" />
      <ProgramRadioLabel program={program} />
      <SelectedHiddenPrograms program={program.url} />
    </RadioGroupItem>
  );

  return (
    <Show
      when={
        group.controls.program && group.controls.degree.value && data()?.data.programs[group.controls.degree.value].length
      }
    >
      <RadioGroup
        value={group.controls.program.value!}
        onChange={(program) => program && group.controls.program.setValue(program)}
        name="program"
        // onBlur={() => group.controls.program!.markTouched(true)}
        disabled={group.controls.program.isDisabled}
        required={group.controls.program.isRequired}
        validationState={group.controls.program.errors ? "invalid" : "valid"}
        class="grid gap-x-2"
      >
        <RadioGroup.Label as={SectionHeading}>{t("menu.program.title")}</RadioGroup.Label>
        <For each={data()?.data.programs[group.controls.degree.value!]}>
          {(program) => (
            <section class="ml-2">
              <Show when={program.specializations.length > 0} fallback={RadioItem(program)}>
                <SubSectionHeading>{program.abbreviation}</SubSectionHeading>
                <For each={program.specializations}>{RadioItem}</For>
              </Show>
            </section>
          )}
        </For>
      </RadioGroup>
    </Show>
  );
}

export function GradeSelect() {
  const group = getGroup();
  const data = getData();
  const { t } = useI18n();

  const Fallback = () => (
    <Text class={typographyVariants({ class: "!mt-0 text-sm ml-2" })}>{t("menu.grade.selectToShow")}</Text>
  );

  const RenderContent = () => {
    const ddata = data()?.data;
    if (!ddata) {
      return null;
    }

    const SelectedHiddenCourses = ({ grade }: { grade: GradeOverview }) => {
      const count = createMemo(() => {
        const allCurrentSelectedCoursesforGrade = getCurrentSelectedCourseIds(group, { grade: grade.key }).length;

        return allCurrentSelectedCoursesforGrade || null;
      });

      return (
        <Show when={group.controls.grade.value !== grade.key && count()} keyed>
          {SelectedCountIndicator}
        </Show>
      );
    };
    return (
      <For each={ddata.grades}>
        {(grade) => {
          return (
            <RadioGroupItem value={grade.key} class="flex items-center gap-2 relative">
              <RadioGroupItemInput class="bottom-0" />
              <RadioGroupItemControl class="cursor-pointer" />
              <RadioGroupItemLabel as={asMerge([ItemText, RadioGroupItemLabel])}>{grade.label}</RadioGroupItemLabel>
              <SelectedHiddenCourses grade={grade} />
            </RadioGroupItem>
          );
        }}
      </For>
    );
  };

  return (
    <RadioGroup
      value={group.controls.grade.value!}
      onChange={group.controls.grade.setValue as (value: string) => void}
      name="yearOfStudy"
      onBlur={() => group.controls.grade.markTouched(true)}
      disabled={group.controls.grade.isDisabled}
      required={group.controls.grade.isRequired}
      validationState={group.controls.grade.errors ? "invalid" : "valid"}
      class="grid gap-x-2"
    >
      <RadioGroup.Label as={SectionHeading}>{t("menu.grade.title")}</RadioGroup.Label>
      <Suspense fallback={<Loader />}>
        <Show when={group.controls.degree.value === data()?.current.degree} fallback={<Fallback />}>
          <RenderContent />
        </Show>
      </Suspense>
    </RadioGroup>
  );
}

export function SemesterSelect() {
  const group = getGroup();
  const data = getData();
  const { t } = useI18n();

  const semesetrs = () => data()?.data.semesters ?? Object.values(SEMESTER);

  return (
    <RadioGroup
      value={group.controls.semester.value}
      onChange={group.controls.semester.setValue as (value: string) => void}
      name="semester"
      onBlur={() => group.controls.semester.markTouched(true)}
      disabled={group.controls.semester.isDisabled}
      required={group.controls.semester.isRequired}
      class="grid gap-x-2"
    >
      <RadioGroup.Label as={SectionHeading}>{t("menu.semester.title")}</RadioGroup.Label>
      <For each={semesetrs()}>
        {(semester) => {
          return (
            <RadioGroupItem value={semester} class="flex items-center gap-2">
              <RadioGroupItemInput />
              <RadioGroupItemControl class="cursor-pointer" />
              <RadioGroupItemLabel as={asMerge([ItemText, RadioGroupItemLabel])}>
                {t(`menu.semester.data.${semester}`)}
              </RadioGroupItemLabel>
            </RadioGroupItem>
          );
        }}
      </For>
    </RadioGroup>
  );
}

export function CoursesSelect() {
  const group = getGroup();
  const data = getData();
  const { t } = useI18n();

  const Fallback = () => <ItemText>{group.controls.grade.value ? "no courses to show" : "select grade to show"}</ItemText>;

  const handleChange = (checked: boolean, type: OBLIGATION, courseId: string) => {
    console.log("🚀 ~ handleChange:", checked, type, courseId);
    handleCourseSelection(group, type, courseId, checked);
  };

  const CourseCheckboxLabel = (props: { course: CourseOverview }) => {
    const course = props.course;
    return (
      <Tooltip placement="right" flip="top" gutter={12}>
        <TooltipTrigger
          as={asMerge([ItemText, CheckboxLabel])}
          class={"ml-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"}
        >
          {course.abbreviation}
        </TooltipTrigger>
        <TooltipContent class="bg-secondary space-x-1 flex items-center">
          <Text variant={null} class="text-secondary-foreground">
            {course.name}
          </Text>
          <a href={course.url} target="_blank" rel="noopener noreferrer" class="text-link-external">
            <Link class="w-4 h-4" />
          </a>
        </TooltipContent>
      </Tooltip>
    );
  };

  const SectionRender = (props: {
    obligation: OBLIGATION;
    alwaysShowHEading?: boolean;
    preChild?: (courses: CourseOverview[]) => JSXElement;
  }) => {
    const courses = createMemo(
      () =>
        !!group.controls.grade.value &&
        data()?.data.courses?.[group.controls.grade.value]?.[group.controls.semester.value].filter(
          (course) => course.obligation === props.obligation
        )
    );
    const Subsection = () => (
      <CollapsibleTrigger class="flex pl-2" as={SubSectionHeading}>
        {t(`menu.courses.${props.obligation}`)}
        <ChevronRight class="ml-auto transition-transform group-data-[expanded]/collapsible:rotate-90" />
      </CollapsibleTrigger>
    );

    return (
      <Collapsible defaultOpen class="group/collapsible">
        <Show when={props.alwaysShowHEading}>
          <Subsection />
        </Show>
        <Show when={courses()} keyed fallback={props.alwaysShowHEading ? <Fallback /> : null}>
          {(courses) => (
            <>
              <Show when={!props.alwaysShowHEading} fallback={null}>
                <Subsection />
              </Show>
              <CollapsibleContent class="pl-2">
                <Show when={props.preChild} keyed>
                  {(render) => render(courses)}
                </Show>
                <For each={courses}>
                  {(course) => (
                    <Checkbox
                      class="flex items-center"
                      value={course.id}
                      checked={getCurrentSelectedCourseId(group, props.obligation, course.id)}
                      onChange={(checked) => handleChange(checked, props.obligation, course.id)}
                    >
                      <CheckboxControl />
                      <CourseCheckboxLabel course={course} />
                    </Checkbox>
                  )}
                </For>
              </CollapsibleContent>
            </>
          )}
        </Show>
      </Collapsible>
    );
  };

  const CheckAll = (obligation: OBLIGATION) => {
    const handleChange = (checked: boolean, couses: CourseOverview[]) => {
      batch(() => {
        for (const course of couses) {
          handleCourseSelection(group, obligation, course.id, checked);
        }
      });
    };
    return (courses: CourseOverview[]) => (
      <Checkbox
        class="flex items-center cursor-pointer"
        value={`all-${obligation}`}
        checked={courses.every((course) => getCurrentSelectedCourseId(group, obligation, course.id))}
        onChange={(checked) => handleChange(checked, courses)}
      >
        <CheckboxControl />
        <CheckboxLabel
          as={asMerge([ItemText, CheckboxLabel])}
          class={"ml-2  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}
        >
          {t("menu.courses.all")}
        </CheckboxLabel>
      </Checkbox>
    );
  };

  return (
    <Show when={group.controls.degree.value === data()?.current.degree}>
      <SectionHeading>{t("menu.courses.title")}</SectionHeading>
      <section>
        <SectionRender obligation={OBLIGATION.COMPULSORY} alwaysShowHEading preChild={CheckAll(OBLIGATION.COMPULSORY)} />
        <SectionRender obligation={OBLIGATION.COMPULSORY_ELECTIVE} />
        <SectionRender obligation={OBLIGATION.ELECTIVE} />
      </section>
    </Show>
  );
}

export function SubmitButton() {
  const posthog = usePostHog();
  const group = getGroup();
  const { submittedData } = useLocalMenuData();
  const t = useI18n().t;

  const onClick = () => {
    posthog().capture("menu-submit_clicked", {
      button_name: "Get Started",
    });
  };

  const menuLoadState = createMemo(() => getMenuLoadState(group.controls.selected.value, submittedData()));
  return (
    <>
      <Button class="w-full" type="submit" onClick={onClick}>
        {t(menuLoadState())}
      </Button>
      <Text variant={"smallText"} class="text-xs text-muted-foreground text-center">
        {t("menu.load.announcement")}
      </Text>
    </>
  );
}

enum MENU_LOAD_STATE {
  NEW = "menu.load.new",
  CLEAN = "menu.load.clean",
  UPDATE = "menu.load.update",
}

const getMenuLoadState = (current: {} | undefined, submitted: {} | undefined) => {
  // if group.selected is empty, we're in the clean state
  if (current === undefined || isEmpty(flattenObject(current))) {
    return MENU_LOAD_STATE.CLEAN;
  }
  // if group.selected is same as submittedData, we're in the update state
  if (isSelectedEqual(current, submitted)) {
    return MENU_LOAD_STATE.UPDATE;
  }
  return MENU_LOAD_STATE.NEW;
};
