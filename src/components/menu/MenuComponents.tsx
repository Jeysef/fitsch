import { Tooltip } from "@kobalte/core/tooltip";
import { flatMap, reduce } from "lodash-es";
import Link from "lucide-solid/icons/link";
import { For, Show, Suspense, createEffect, createMemo, type JSXElement } from "solid-js";
import type { StrictExtract } from "ts-essentials";
import { ItemText, SectionHeading, SubSectionHeading } from "~/components/menu/MenuCommonComponents";
import { getData, getGroup } from "~/components/menu/MenuContent";
import type { NavigationSchemaKey } from "~/components/menu/schema";
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
import { useI18n } from "~/i18n";
import { OBLIGATION, SEMESTER } from "~/server/scraper/enums";
import type { StudyOverviewCourse, StudyOverviewGrade, StudyOverviewYear, StudyProgramBase } from "~/server/scraper/types";
import { asMerge } from "~/utils/asMerge";

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
        <For each={data()?.data.programs[group.controls.degree.value]}>
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

    const SelectedHiddenCourses = ({ grade }: { grade: StudyOverviewGrade }) => {
      const count = createMemo(() => {
        const courses = ddata.courses[grade.key][group.controls.semester.value];
        const selected = reduce(
          courses,
          (acc, courseType) =>
            acc +
            courseType.filter((course) => flatMap(OBLIGATION, (type) => group.controls[type].value).includes(course.id))
              .length,
          0
        );

        return selected || null;
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
              <RadioGroupItemControl as="button" type="button" />
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
        <Show when={group.controls.degree.value === data()?.values.degree} fallback={<Fallback />}>
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

  const SelectedHiddenCourses = ({ semester }: { semester: SEMESTER }) => {
    const ddata = data()?.data;
    if (!ddata) {
      return null;
    }
    const count = createMemo(() => {
      return ddata.grades.reduce((acc, grade) => {
        const courses = ddata.courses[grade.key][semester];
        const selected = reduce(
          courses,
          (acc, courseType) =>
            acc +
            courseType.filter((course) => flatMap(OBLIGATION, (type) => group.controls[type].value).includes(course.id))
              .length,
          0
        );
        return acc + selected;
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
      <For each={semesetrs()}>
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

  createEffect(() => {
    console.log(
      "🚀 ~ file: MenuComponents.tsx:317 ~ createEffect ~ data()?.data.courses[group.controls.grade.value]:",
      group.controls.grade.value,
      group.controls.grade.value && data()?.data.courses[group.controls.grade.value]
    );
  });

  const compulsoryCourses = createMemo(
    () =>
      !!group.controls.grade.value &&
      data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value][OBLIGATION.COMPULSORY]
  );
  const compulsoryElectiveCourses = createMemo(
    () =>
      !!group.controls.grade.value &&
      data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value][OBLIGATION.COMPULSORY_ELECTIVE]
  );
  const optionalCourses = createMemo(
    () =>
      !!group.controls.grade.value &&
      data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value][OBLIGATION.ELECTIVE]
  );

  const handleChange = (checked: boolean, type: StrictExtract<NavigationSchemaKey, OBLIGATION>, courseId: string) => {
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

  const SectionRender = (props: {
    obligation: OBLIGATION;
    alwaysShowHEading?: boolean;
    preChild?: (courses: StudyOverviewCourse[]) => JSXElement;
  }) => {
    const courses = createMemo(
      () =>
        !!group.controls.grade.value &&
        data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value][props.obligation]
    );
    const Subsection = () => <SubSectionHeading>{t(`menu.courses.${props.obligation}`)}</SubSectionHeading>;

    return (
      <>
        {props.alwaysShowHEading && <Subsection />}
        <Show when={courses()} keyed fallback={props.alwaysShowHEading ? <Fallback /> : null}>
          {(courses) => (
            <>
              <Show when={!props.alwaysShowHEading} fallback={null}>
                <Subsection />
              </Show>
              <Show when={props.preChild} keyed>
                {(render) => render(courses)}
              </Show>
              <For each={courses}>
                {(course) => (
                  <Checkbox
                    class="flex items-center cursor-pointer"
                    value={course.id}
                    checked={group.controls[props.obligation].value.includes(course.id)}
                    onChange={(checked) => handleChange(checked, props.obligation, course.id)}
                  >
                    <CheckboxControl />
                    <CourseCheckboxLabel course={course} />
                  </Checkbox>
                )}
              </For>
            </>
          )}
        </Show>
      </>
    );
  };

  const CheckAll = (obligation: OBLIGATION) => {
    return (courses: StudyOverviewCourse[]) => (
      <Checkbox
        class="flex items-center cursor-pointer"
        value={`all-${obligation}`}
        checked={courses.every((course) => group.controls[obligation].value.includes(course.id))}
        onChange={(checked) =>
          checked ? group.controls[obligation].setValue(courses.map((e) => e.id)) : group.controls[obligation].setValue([])
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
    );
  };

  return (
    <Show when={group.controls.degree.value === data()?.values.degree}>
      <SectionHeading>{t("menu.courses.title")}</SectionHeading>
      <section class="ml-2">
        <SectionRender obligation={OBLIGATION.COMPULSORY} alwaysShowHEading preChild={CheckAll(OBLIGATION.COMPULSORY)} />
        <SectionRender obligation={OBLIGATION.COMPULSORY_ELECTIVE} />
        <SectionRender obligation={OBLIGATION.ELECTIVE} />
      </section>
    </Show>
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
