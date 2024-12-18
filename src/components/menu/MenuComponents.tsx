import { Tooltip } from "@kobalte/core/tooltip";
import ChevronDown from "lucide-solid/icons/chevron-down";
import CircleAlert from "lucide-solid/icons/circle-alert";
import Link from "lucide-solid/icons/link";
import {
  For,
  Show,
  Suspense,
  createMemo,
  createSignal,
  splitProps,
  type FlowComponent,
  type ValidComponent,
} from "solid-js";
import type { StrictOmit } from "ts-essentials";
import { getData, getGroup } from "~/components/menu/MenuContent";
import SchedulerGenerator from "~/components/scheduler/generator2.singlePass";
import { typographyVariants } from "~/components/typography";
import Heading, { type HeadingProps } from "~/components/typography/heading";
import Text, { type TextProps } from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxControl, CheckboxLabel } from "~/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
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
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useScheduler } from "~/providers/SchedulerProvider";
import type { SEMESTER } from "~/server/scraper/enums";
import type { StudyOverviewCourse, StudyOverviewGrade, StudyOverviewYear, StudyProgramBase } from "~/server/scraper/types";
import { asMerge } from "~/utils/asMerge";

const SectionHeading: FlowComponent<StrictOmit<HeadingProps<"h3">, "variant">> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);
  return (
    <Heading as="h3" variant="h5" class={cn("mb-1", local.class)} {...others}>
      {local.children}
    </Heading>
  );
};

const SubSectionHeading: FlowComponent<StrictOmit<HeadingProps<"p">, "variant">> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);
  return (
    <Heading as="p" variant="h6" class={cn("mb-1", local.class)} {...others}>
      {local.children}
    </Heading>
  );
};

const ItemText: FlowComponent<StrictOmit<TextProps<ValidComponent>, "variant">> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);
  return (
    <Text variant={null} class={cn("text-sm leading-6", local.class)} {...others}>
      {local.children}
    </Text>
  );
};

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
        <SelectValue<StudyOverviewYear, typeof ItemText> as={ItemText}>
          {(state) => state.selectedOption()?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}

export function DegreeSelect() {
  const group = getGroup();
  const data = getData();
  const { t } = useI18n();

  return (
    <RadioGroup
      value={group.controls.degree.value}
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
            <RadioGroupItemControl as="button" type="button" />
            <RadioGroupItemLabel as={asMerge([ItemText, RadioGroupItemLabel])}>
              {t(`menu.degree.data.${degree}`)}
            </RadioGroupItemLabel>
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

  const ProgramRadioLabel = (props: { program: StudyProgramBase }) => {
    const program = props.program;
    return (
      <Tooltip placement="right" flip="top" gutter={12}>
        <TooltipTrigger as={asMerge([RadioGroupItemLabel, ItemText])} class="cursor-pointer">
          {program.abbreviation}
        </TooltipTrigger>
        <TooltipContent class="bg-secondary text-secondary-foreground space-x-1 flex items-center">
          <ItemText class="text-secondary-foreground">{program.name}</ItemText>
          <a href={program.url} target="_blank" rel="noopener noreferrer" class="text-link">
            <Link class="w-4 h-4" />
          </a>
        </TooltipContent>
      </Tooltip>
    );
  };

  const RadioItem = (program: StudyProgramBase) => (
    <RadioGroupItem value={program.id} class="flex items-center gap-2">
      <RadioGroupItemInput />
      <RadioGroupItemControl as="button" type="button" />
      <ProgramRadioLabel program={program} />
    </RadioGroupItem>
  );

  return (
    <Show
      when={
        group.controls.program && group.controls.degree.value && data()?.data.programs[group.controls.degree.value].length
      }
    >
      <RadioGroup
        value={group.controls.program.value}
        onChange={(program) => program && group.controls.program.setValue(program)}
        name="program"
        // onBlur={() => group.controls.program!.markTouched(true)}
        disabled={group.controls.program.isDisabled}
        required={group.controls.program.isRequired}
        validationState={group.controls.program.errors ? "invalid" : "valid"}
        class="grid gap-x-2"
      >
        <RadioGroup.Label as={SectionHeading}>{t("menu.program.title")}</RadioGroup.Label>
        <For each={data()!.data.programs[group.controls.degree!.value]}>
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

  const SelectedHiddenCourses = ({ grade }: { grade: StudyOverviewGrade }) => {
    const count = createMemo(() => {
      const courses = data()!.data.courses[grade.key][group.controls.semester.value];
      const compulsorySelected = courses.compulsory.filter((course) =>
        group.controls.coursesCompulsory.value.includes(course.id)
      ).length;
      const optionalSelected = courses.voluntary.filter((course) =>
        group.controls.coursesVoluntary.value.includes(course.id)
      ).length;
      return compulsorySelected + optionalSelected || null;
    });

    return (
      <Show when={group.controls.grade.value !== grade.key && count()} keyed>
        {SelectedCountIndicator}
      </Show>
    );
  };

  return (
    <RadioGroup
      value={group.controls.grade.value}
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
        <Show when={data() && group.controls.degree.value === data()!.values.degree} fallback={<Fallback />}>
          <For each={data()!.data.grades}>
            {(grade) => {
              return (
                <RadioGroupItem value={grade.key} class="flex items-center gap-2 relative">
                  <RadioGroupItemInput class="bottom-0" />
                  <RadioGroupItemControl as="button" type="button" />
                  <RadioGroupItemLabel as={asMerge([ItemText, RadioGroupItemLabel])}>{grade.label}</RadioGroupItemLabel>
                  <SelectedHiddenCourses grade={grade} />
                </RadioGroupItem>
              );
            }}
          </For>
        </Show>
      </Suspense>
    </RadioGroup>
  );
}

export function SemesterSelect() {
  const group = getGroup();
  const data = getData();
  const { t } = useI18n();

  const SelectedHiddenCourses = ({ semester }: { semester: SEMESTER }) => {
    const count = createMemo(() => {
      return data()!.data.grades.reduce((acc, grade) => {
        const courses = data()!.data.courses[grade.key][semester];
        const compulsorySelected = courses.compulsory.filter((course) =>
          group.controls.coursesCompulsory.value.includes(course.id)
        ).length;
        const optionalSelected = courses.voluntary.filter((course) =>
          group.controls.coursesVoluntary.value.includes(course.id)
        ).length;
        return acc + compulsorySelected + optionalSelected;
      }, 0);
    });

    return (
      <Show when={group.controls.semester.value !== semester && count()} keyed>
        {SelectedCountIndicator}
      </Show>
    );
  };

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
      <For each={data()?.data.semesters}>
        {(semester) => {
          return (
            <RadioGroupItem value={semester} class="flex items-center gap-2">
              <RadioGroupItemInput />
              <RadioGroupItemControl as="button" type="button" />
              <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>
                {t(`menu.semester.data.${semester}`)}
              </RadioGroupItemLabel>
              <SelectedHiddenCourses semester={semester} />
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

  const compulsoryCourses = createMemo(
    () =>
      !!group.controls.grade.value &&
      data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value].compulsory
  );
  const optionalCourses = createMemo(
    () =>
      !!group.controls.grade.value &&
      data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value].voluntary
  );

  const handleChange = (checked: boolean, type: "coursesCompulsory" | "coursesVoluntary", courseId: string) => {
    group.controls[type].setValue(
      checked ? [...group.controls[type].value, courseId] : group.controls[type].value.filter((id) => id !== courseId)
    );
  };

  const CourseCheckboxLabel = (props: { course: StudyOverviewCourse }) => {
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
          <a href={course.url} target="_blank" rel="noopener noreferrer" class="text-link">
            <Link class="w-4 h-4" />
          </a>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <Show when={group.controls.degree.value === data()?.values.degree}>
      <SectionHeading>{t("menu.courses.title")}</SectionHeading>
      <section class="ml-2">
        <SubSectionHeading>{t("menu.courses.compulsaory")}</SubSectionHeading>
        <Show when={compulsoryCourses()} fallback={<Fallback />} keyed>
          {(compulsoryCourses) => (
            <>
              <Checkbox
                class="flex items-center cursor-pointer"
                value="all"
                checked={group.controls.coursesCompulsory.value!.length === compulsoryCourses.length}
                onChange={(checked) =>
                  checked
                    ? group.controls.coursesCompulsory.setValue(compulsoryCourses.map((e) => e.id))
                    : group.controls.coursesCompulsory.setValue([])
                }
              >
                <CheckboxControl />
                <CheckboxLabel
                  as={asMerge([ItemText, CheckboxLabel])}
                  class={"ml-2  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}
                >
                  {t("menu.courses.all")}
                </CheckboxLabel>
              </Checkbox>
              <For each={compulsoryCourses}>
                {(course) => (
                  <Checkbox
                    class="flex items-center cursor-pointer"
                    value={course.id}
                    checked={group.controls.coursesCompulsory.value.includes(course.id)}
                    onChange={(checked) => handleChange(checked, "coursesCompulsory", course.id)}
                  >
                    <CheckboxControl />
                    <CourseCheckboxLabel course={course} />
                  </Checkbox>
                )}
              </For>
            </>
          )}
        </Show>
        <SubSectionHeading>{t("menu.courses.voluntary")}</SubSectionHeading>
        <Show when={optionalCourses()} fallback={<Fallback />} keyed>
          {(optionalCourses) => (
            <For each={optionalCourses}>
              {(course) => (
                <Checkbox
                  checked={group.controls.coursesVoluntary.value.includes(course.id)}
                  class="flex items-center cursor-pointer"
                  value={course.id}
                  onChange={(checked) => handleChange(checked, "coursesVoluntary", course.id)}
                >
                  <CheckboxControl />
                  <CourseCheckboxLabel course={course} />
                </Checkbox>
              )}
            </For>
          )}
        </Show>
      </section>
    </Show>
  );
}

export function Actions() {
  const { persistedStore, recreateStore } = useScheduler();
  const store = persistedStore();
  const { t } = useI18n();

  const exportJSON = () => {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(store)], { type: "application/json" });
    a.href = URL.createObjectURL(file);
    a.download = "schedule.json";
    a.click();
    a.remove();
  };

  const importJSON = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = ".json";
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          recreateStore(data);
        } catch (e) {
          console.error(e);
        }
      };
      reader.readAsText(file);
    };
    input.remove();
  };

  const generator = SchedulerGenerator();
  const [tooltipOpen, setTooltipOpen] = createSignal(false);

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger class="flex w-full overflow-hidden items-center">
        <SectionHeading>{t("menu.actions.title")}</SectionHeading>
        <ChevronDown />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ItemText as="div">
          <Button
            type="button"
            size={null}
            variant={"ghost"}
            class="px-2 py-1 text-link hover:text-link hover:saturate-150"
            on:click={exportJSON}
          >
            {t("menu.actions.exportJson")}
          </Button>
        </ItemText>
        <ItemText as="div">
          <Button
            type="button"
            size={null}
            variant={"ghost"}
            class="px-2 py-1 text-link hover:text-link hover:saturate-150"
            on:click={importJSON}
          >
            {t("menu.actions.importJson")}
          </Button>
        </ItemText>
        <ItemText as="div" class="flex items-center gap-1">
          <Button
            type="button"
            size={null}
            variant={"ghost"}
            class="px-2 py-1"
            on:click={() => generator.generateNext()}
            disabled={generator.isGenerating()}
          >
            {generator.isGenerating() ? t("menu.actions.generate.generating") : t("menu.actions.generate.next")}
          </Button>
          <Tooltip placement="right" flip="top" gutter={12} open={tooltipOpen()} hideWhenDetached>
            <TooltipTrigger type="button" on:click={() => setTooltipOpen((p) => !p)}>
              <CircleAlert class="w-4 h-4 text-amber-400" />
            </TooltipTrigger>
            <TooltipContent>{t("menu.actions.generate.warning")}</TooltipContent>
          </Tooltip>
        </ItemText>
        <ItemText as="div">
          <Button
            type="button"
            size={null}
            variant={"ghost"}
            class="px-2 py-1"
            on:click={() => generator.generatePrevious()}
            disabled={!generator.canGeneratePrevious() || generator.isGenerating()}
          >
            {generator.isGenerating() ? t("menu.actions.generate.generating") : t("menu.actions.generate.previous")}
          </Button>
        </ItemText>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SubmitButton() {
  const { t } = useI18n();
  return (
    <Button class="w-full !mt-8 sticky bottom-0" type="submit">
      {t("menu.load")}
    </Button>
  );
}
