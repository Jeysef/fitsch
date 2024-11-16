import { Tooltip } from "@kobalte/core/tooltip";
import { trackStore } from "@solid-primitives/deep";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { useAction } from "@solidjs/router";
import { mapValues } from "lodash-es";
import LoaderCircle from "lucide-solid/icons/loader-circle";
import { createContext, createEffect, createMemo, createRenderEffect, createResource, createSignal, createUniqueId, ErrorBoundary, For, on, Show, startTransition, Suspense, useContext, type Accessor, type JSX, type ResourceReturn } from "solid-js";
import ErrorFallback from "~/components/menu/ErrorFallback";
import { navigationSchema, type NavigationSchema } from "~/components/menu/schema";
import { Typography, typographyVariants } from "~/components/typography";
import Heading from "~/components/typography/heading";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxControl, CheckboxLabel } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem, RadioGroupItemControl, RadioGroupItemInput, RadioGroupItemLabel } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { useI18n } from "~/i18n";
import { toast } from "~/packages/solid-sonner";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { DEGREE, SEMESTER } from "~/server/scraper/enums";
import { getStudyOverview } from "~/server/scraper/functions";
import { type DataProviderTypes, type GradeKey, type StudyCourseObligation, type StudyOverview, type StudyOverviewCourse, type StudyOverviewYear, type StudyProgram, type StudyProgramBase } from "~/server/scraper/types";
import { createFormControl, createFormGroup, type IFormControl, type IFormGroup, type ValidatorFn } from "~/solid-forms/";


const GroupContext = createContext<IFormGroup<{ [K in keyof Required<NavigationSchema>]: IFormControl<NavigationSchema[K]> }>>()
const getGroup = () => useContext(GroupContext)!
const DataContext = createContext<Accessor<StudyOverview | undefined>>()
const getData = () => useContext(DataContext)!
/**
 * Will be prolonged every time updated
 */
const monthCookie = cookieStorage.withOptions({ expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), sameSite: "Strict" })

export default function Wrapper() {
  // defer, so that the loading is not shown on client
  const [persistentGroupData, setPersistentGroupData] = makePersisted(createSignal<{ [K in keyof Required<NavigationSchema>]: NavigationSchema[K] }>(), { name: "groupData", storage: monthCookie })
  const [submittedCourses, setSubmittedCourses] = makePersisted(createSignal<Record<StudyCourseObligation, string[]>>({ compulsory: [], voluntary: [] }), { name: "submittedCourses", storage: monthCookie })
  const locale = useI18n().locale
  const initialConfig: DataProviderTypes.getStudyOverviewConfig = {
    language: locale(),
    year: persistentGroupData()?.year?.value,
    degree: persistentGroupData()?.degree,
    program: persistentGroupData()?.program,
  }
  const resource = createResource(initialConfig, getStudyOverview, { deferStream: true });

  return (
    <div class="w-44 space-y-2">
      {/* in future replace with skeleton or deferStream on resource */}
      <ErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} reset={() => { resource[1].refetch(); reset() }} data={resource[0]} />} >
        <Suspense fallback={<LoaderFallback />}>
          <Content resource={resource} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
  function Content({ resource }: { resource: ResourceReturn<StudyOverview, DataProviderTypes.getStudyOverviewConfig> }) {
    const data = resource[0]
    const cData = createMemo(() => data.state === "refreshing" ? data.latest : data())
    const { refetch, mutate } = resource[1]
    const _submit = useAction(getStudyCoursesDetailsAction);
    const { t } = useI18n()

    const submit: typeof _submit = (data) => {
      const submission = _submit(data)
      toast.promise(submission, { loading: t("menu.toast.generate.loading"), success: t("menu.toast.generate.success"), error: t("menu.toast.generate.error") })
      return submission
    }

    const getDataToRefetch = () => {
      const c = group.controls
      return {
        year: c.year.value?.value,
        language: locale(),
        degree: c.degree.value,
        program: c.program.value,
      } satisfies DataProviderTypes.getStudyOverviewConfig
    }
    const getDataToSubmit = () => {
      const c = group.controls
      return {
        language: locale(),
        year: c.year.value!.value,
        semester: c.semester.value,
        courses: [...c.coursesCompulsory.value, ...c.coursesVoluntary.value].map(id => ({ courseId: id })),
      } satisfies DataProviderTypes.getStudyCoursesDetailsConfig
    }

    createEffect(on(locale, (language, _, firstEffect) => {
      if (firstEffect) return false
      const dataLanguage = cData()?.values.language
      if (!dataLanguage || dataLanguage === language) return false
      const newData = startTransition(() => refetch(getDataToRefetch()))
      const toastId = createUniqueId()
      const onRegenerate = () => {
        toast.dismiss(toastId)
        submit(getDataToSubmit());
      }
      toast.promise(newData, { loading: t("menu.toast.languageChanged.loading"), success: t("menu.toast.languageChanged.success"), error: t("menu.toast.languageChanged.error"), description: t("menu.toast.languageChanged.description", { language: t(`language.${language}`) }), action: { label: t("menu.generate"), onClick: onRegenerate }, id: toastId, duration: 5000 })
      return false
    }), true)

    const validator: <K extends keyof NavigationSchema>(name: K, value: NavigationSchema[K]) => ReturnType<ValidatorFn<NavigationSchema[K]>> = (name, value) => {
      const returnType = navigationSchema.pick({ [name]: true } as { [K in keyof NavigationSchema]: true }).safeParse({ [name]: value });
      return returnType.error ? { error: returnType.error } : null
    }

    const defaultValues = {
      semester: SEMESTER.WINTER,
      degree: DEGREE.BACHELOR,
      grade: undefined,
      coursesCompulsory: [],
      coursesVoluntary: []
    }
    const isSubmittedCompulsory = submittedCourses().compulsory.length > 0
    const isSubmittedOptional = submittedCourses().voluntary.length > 0

    const values: { [K in keyof Required<NavigationSchema>]: NavigationSchema[K] } = {
      year: data()?.values.year ?? persistentGroupData()?.year,
      degree: data()?.values.degree ?? persistentGroupData()?.degree ?? defaultValues.degree,
      program: data()?.values.program?.id ?? persistentGroupData()?.program,
      grade: persistentGroupData()?.grade ?? defaultValues.grade,
      semester: persistentGroupData()?.semester ?? defaultValues.semester,
      coursesCompulsory: (isSubmittedCompulsory && submittedCourses().compulsory) || persistentGroupData()?.coursesCompulsory || defaultValues.coursesCompulsory,
      coursesVoluntary: (isSubmittedOptional && submittedCourses().voluntary) || persistentGroupData()?.coursesVoluntary || defaultValues.coursesVoluntary,
    }
    console.log("🚀 ~ file: Content.tsx:124 ~ Content ~ data()?.values.program?.id:", data()?.values.program?.id)

    const group = createFormGroup({
      year: createFormControl<StudyOverviewYear | undefined>(values.year, { required: true, validators: validator.bind(null, "year") }),
      degree: createFormControl<DEGREE>(values.degree, { required: true, validators: validator.bind(null, "degree") }),
      program: createFormControl<StudyProgram["id"] | undefined>(values.program, { required: true, validators: validator.bind(null, "program") }),
      grade: createFormControl<GradeKey>(values.grade, { required: true, validators: validator.bind(null, "grade") }),
      semester: createFormControl<typeof SEMESTER[SEMESTER]>(values.semester, { required: true, validators: validator.bind(null, "semester") }),
      coursesCompulsory: createFormControl<string[]>(values.coursesCompulsory, { required: true, validators: validator.bind(null, "coursesCompulsory") }),
      coursesVoluntary: createFormControl<string[]>(values.coursesVoluntary, { required: true, validators: validator.bind(null, "coursesVoluntary") }),
    } satisfies {
      [K in keyof Required<NavigationSchema>]: IFormControl<NavigationSchema[K]>;
    })

    // TODO: find something better
    createEffect(() => {
      setPersistentGroupData(mapValues(trackStore(group).controls, (value) => (value.rawValue)) as { [K in keyof Required<NavigationSchema>]: NavigationSchema[K] })
    })

    const getFetchableData = () => ({
      year: group.controls.year.value?.value,
      program: group.controls.program.value
    })

    /** refetch data */
    createRenderEffect(on(getFetchableData, (data, _, firstEffect) => {
      if (firstEffect) return false
      void refetch(getDataToRefetch())
      return false
    }), true)

    /** Check changed degree grade */
    createRenderEffect(on(() => group.controls.degree.value, (degree, prevDegree) => {
      if (degree && degree === prevDegree) return false
      const dataProgram = cData()?.data.programs[degree]
      if (!dataProgram || dataProgram.flatMap(e => [e, ...e.specializations]).length !== 1) return;
      const programId = dataProgram[0].id
      if (programId !== group.controls.program.value) group.controls.program.setValue(programId)
    }))

    const onSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> | undefined = async (e) => {
      e.preventDefault();
      group.markSubmitted(true);
      submit(getDataToSubmit())
      const c = group.controls
      setSubmittedCourses({ compulsory: c.coursesCompulsory.value, voluntary: c.coursesVoluntary.value })

    };

    return (
      <form onSubmit={onSubmit}>
        <GroupContext.Provider value={group}>
          <DataContext.Provider value={cData}>
            <YearSelect />
            {/* semester up top coz it dosn't change much */}
            <SemesterSelect />
            <DegreeSelect />
            <ProgramSelect />
          </DataContext.Provider>
          <DataContext.Provider value={data}>
            <GradeSelect />
            <Suspense>
              <CoursesSelect />
            </Suspense>
          </DataContext.Provider>
          <SubmitButton />
        </GroupContext.Provider>
      </form>
    )
  }
}


function SubmitButton() {
  const { t } = useI18n()
  return <Button class="w-full !mt-8 sticky bottom-0" type="submit">{t("menu.generate")}</Button>;
}

// function ErrorMessage({ control }: { control: IFormControl<string> }) {
//   const { isTouched, errors } = control;
//   console.log("🚀 ~ file: NavigationContent.tsx:267 ~ ErrorMessage ~ control.errors:", errors, !!errors, isTouched)
//   return (
//     <div>
//       <Show when={isTouched}>
//         <small><Dynamic component={(errors?.error as ZodError<NavigationSchema>)?.message} /></small>
//       </Show>
//     </div>
//   )
// }

function YearSelect() {
  const group = getGroup()
  const data = getData()
  const { t } = useI18n()

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
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>
      )}
    >
      <Select.Label as="h3" class={typographyVariants({ variant: "h5" })}>{t("menu.year.title")}</Select.Label>
      <SelectTrigger>
        <SelectValue<StudyOverviewYear>>{(state) => state.selectedOption()?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  )
}

function DegreeSelect() {
  const group = getGroup()
  const data = getData()
  const { t } = useI18n()

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
      <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >{t("menu.degree.title")}</RadioGroup.Label>
      <For each={data()?.data.degrees}>
        {(degree) => (
          <RadioGroupItem value={degree} class="flex items-center gap-2">
            <RadioGroupItemInput />
            <RadioGroupItemControl as="button" type="button" />
            <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{t(`menu.degree.data.${degree}`)}</RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  )
}

function ProgramSelect() {
  const group = getGroup()
  const data = getData()
  const { t } = useI18n()
  createEffect(() => {
    console.log("🚀 ~ file: Content.tsx:274 ~ ProgramSelect ~ group.controls.program.value:", group.controls.program.value)
    console.log("🚀 ~ file: Content.tsx:285 ~ ProgramSelect ~ data()!.data.programs[group.controls.degree!.value]:", data()?.data.programs[group.controls.degree!.value])
  })

  const ProgramRadioLabel = (props: { program: StudyProgramBase }) => {
    const program = props.program;
    return (
      <Tooltip placement="right" flip="top" gutter={12} >
        <TooltipTrigger as={RadioGroupItemLabel} class={typographyVariants({ class: "!mt-0 text-sm cursor-pointer" })}>
          {program.abbreviation}
        </TooltipTrigger>
        <TooltipContent class="bg-secondary text-secondary-foreground">
          {program.name}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Show when={group.controls.program && group.controls.degree.value && data()?.data.programs[group.controls.degree.value].length}>
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
        <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })}>{t("menu.program.title")}</RadioGroup.Label>
        <For each={data()!.data.programs[group.controls.degree!.value]}>
          {(program) => (
            <section class="ml-2">
              <Show when={program.specializations.length > 0} fallback={
                <RadioGroupItem value={program.id} class="flex items-center gap-2">
                  <RadioGroupItemInput />
                  <RadioGroupItemControl as="button" type="button" />
                  <ProgramRadioLabel program={program} />
                </RadioGroupItem>
              }>
                <Heading as="h4" variant="h6">{program.abbreviation}</Heading>
                <For each={program.specializations} >
                  {(specialization) => (
                    <RadioGroupItem value={specialization.id} class="flex items-center gap-2">
                      <RadioGroupItemInput />
                      <RadioGroupItemControl as="button" type="button" />
                      <ProgramRadioLabel program={specialization} />
                    </RadioGroupItem>
                  )}
                </For>
              </Show>
            </section>
          )}
        </For>
      </RadioGroup>
    </Show>
  )
}

function GradeSelect() {
  const group = getGroup()
  const data = getData()
  const { t } = useI18n()

  const Fallback = () => (
    <Text class={typographyVariants({ class: "!mt-0 text-sm ml-2" })}>
      {t("menu.grade.selectToShow")}
    </Text>
  )

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
      <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >{t("menu.degree.title")}</RadioGroup.Label>
      <Suspense fallback={<LoaderFallback />}>
        <Show when={data() && group.controls.degree.value === data()!.values.degree} fallback={<Fallback />}>
          <For each={data()!.data.grades}>
            {(grade) => {
              const count = createMemo(() => {
                const courses = data()!.data.courses[grade.key][group.controls.semester.value]
                const compulsorySelected = courses.compulsory.filter(course => group.controls.coursesCompulsory.value.includes(course.id)).length
                const optionalSelected = courses.voluntary.filter(course => group.controls.coursesVoluntary.value.includes(course.id)).length
                return compulsorySelected + optionalSelected || null
              })
              return (
                <RadioGroupItem value={grade.key} class="flex items-center gap-2 relative">
                  {/* <div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">20</div> */}
                  <RadioGroupItemInput class="bottom-0" />
                  <RadioGroupItemControl as="button" type="button" />
                  <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{grade.label}</RadioGroupItemLabel>
                  {/* <div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">20</div> */}
                  <Show when={group.controls.grade.value !== grade.key && count()} keyed>
                    {(count) => (
                      <span
                        class="inline-block whitespace-nowrap rounded-full bg-orange-400 px-2 py-1 text-center align-baseline text-xxs font-bold leading-none text-white">
                        {count}
                      </span>

                    )}
                  </Show>
                </RadioGroupItem>
              )
            }}
          </For>
        </Show>
      </Suspense>
    </RadioGroup>
  )
}

function SemesterSelect() {
  const group = getGroup()
  const data = getData()
  const { t } = useI18n()

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
      <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >{t("menu.semester.title")}</RadioGroup.Label>
      <For each={data()?.data.semesters}>
        {(semester) => (
          <RadioGroupItem value={semester} class="flex items-center gap-2">
            <RadioGroupItemInput />
            <RadioGroupItemControl as="button" type="button" />
            <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{t(`menu.semester.data.${semester}`)}</RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  )
}

function CoursesSelect() {
  const group = getGroup()
  const data = getData()
  const { t } = useI18n()

  const Fallback = () => (
    <Text variant="smallText">
      {group.controls.grade.value ?
        "no courses to show" :
        "select grade to show"
      }
    </Text>
  )

  const compulsoryCourses = createMemo(() => !!group.controls.grade.value && data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value].compulsory)
  const optionalCourses = createMemo(() => !!group.controls.grade.value && data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value].voluntary)

  const handleChange = (checked: boolean, type: "coursesCompulsory" | "coursesVoluntary", courseId: string) => {
    group.controls[type].setValue(checked ? [...group.controls[type].value, courseId] : group.controls[type].value.filter(id => id !== courseId))
  }

  const CourseCheckboxLabel = (props: { course: StudyOverviewCourse }) => {
    const course = props.course;
    return (
      <Tooltip placement="right" flip="top" gutter={12} >
        <TooltipTrigger as={CheckboxLabel} class={"ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"}>
          {course.abbreviation}
        </TooltipTrigger>
        <TooltipContent class="bg-secondary text-secondary-foreground">
          {course.name}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Show when={group.controls.degree.value === data()?.values.degree}>
      <Typography as="h3" variant={"h5"}>{t("menu.courses.title")}</Typography>
      <section class="space-y-2 ml-2">
        <Typography as="p" variant={"h6"}>{t("menu.courses.compulsaory")}</Typography>
        <Show when={compulsoryCourses()} fallback={<Fallback />} keyed>
          {(compulsoryCourses) => (
            <>
              <Checkbox
                class="flex items-start cursor-pointer"
                value="all"
                checked={group.controls.coursesCompulsory.value!.length === compulsoryCourses.length}
                onChange={(checked) => checked ? group.controls.coursesCompulsory.setValue(compulsoryCourses.map(e => e.id)) : group.controls.coursesCompulsory.setValue([])}>
                <CheckboxControl />
                <CheckboxLabel class={"ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}>
                  {t("menu.courses.all")}
                </CheckboxLabel>
              </Checkbox>
              <For each={compulsoryCourses} >
                {(course) => (
                  <Checkbox
                    class="flex items-start cursor-pointer"
                    value={course.id}
                    checked={group.controls.coursesCompulsory.value.includes(course.id)}
                    onChange={checked => handleChange(checked, "coursesCompulsory", course.id)}>
                    <CheckboxControl />
                    <CourseCheckboxLabel course={course} />
                  </Checkbox>
                )}
              </For>
            </>
          )}
        </Show>
        <Typography as="p" variant={"h6"}>{t("menu.courses.voluntary")}</Typography>
        <Show when={optionalCourses()} fallback={<Fallback />} keyed>
          {(optionalCourses) => (
            <For each={optionalCourses}>
              {(course) => (
                <Checkbox checked={group.controls.coursesVoluntary.value.includes(course.id)} class="flex items-start" value={course.id} onChange={(checked) => handleChange(checked, "coursesVoluntary", course.id)}>
                  <CheckboxControl />
                  <CourseCheckboxLabel course={course} />
                </Checkbox>
              )}
            </For>
          )}
        </Show>
      </section>
    </Show>
  )
}

function LoaderFallback() {
  return (
    <div class="grid place-items-center h-full">
      <LoaderCircle class="animate-spin" />
    </div>
  )
}