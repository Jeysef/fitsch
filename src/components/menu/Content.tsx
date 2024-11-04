import { trackStore } from "@solid-primitives/deep";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { useAction } from "@solidjs/router";
import { mapValues } from "lodash-es";
import LoaderCircle from "lucide-solid/icons/loader-circle";
import { createContext, createEffect, createMemo, createRenderEffect, createResource, createSignal, ErrorBoundary, For, on, Show, Suspense, untrack, useContext, type Accessor, type JSX, type ResourceReturn } from "solid-js";
import { navigationSchema, type NavigationSchema } from "~/components/menu/schema";
import { Typography, typographyVariants } from "~/components/typography";
import Heading from "~/components/typography/heading";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxControl, CheckboxLabel } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem, RadioGroupItemControl, RadioGroupItemInput, RadioGroupItemLabel } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
// import { createDeepSignal } from "~/lib/solid";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { DEGREE, SEMESTER } from "~/server/scraper/enums";
import { getStudyOverview } from "~/server/scraper/functions";
import { type DataProviderTypes, type GradeKey, type StudyOverview, type StudyOverviewYear, type StudyProgram } from "~/server/scraper/types";
import { createFormControl, createFormGroup, type IFormControl, type IFormGroup, type ValidatorFn } from "~/solid-forms/";


const GroupContext = createContext<IFormGroup<{ [K in keyof Required<NavigationSchema>]: IFormControl<NavigationSchema[K]> }>>(null as any)
const DataContext = createContext<Accessor<StudyOverview | undefined>>(null as any)

export default function Wrapper() {
  // defer, so that the loading is not shown on client
  const [groupData] = makePersisted(createSignal<{ [K in keyof Required<NavigationSchema>]: NavigationSchema[K] }>(), { name: "groupData", storage: cookieStorage.withOptions({ expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }) })
  const d = {
    year: groupData()?.year?.value,
    degree: groupData()?.degree,
    program: groupData()?.program,
  }
  const resource = createResource(d, getStudyOverview, { deferStream: true });

  return (
    <div class="w-44 space-y-2">
      {/* in future replace with skeleton or deferStream on resource */}
      <ErrorBoundary fallback={(err, reset) => (<div>
        <Typography variant="h5">Error</Typography>
        <pre>{err.message}</pre>
        <Button onClick={reset}>Retry</Button>
      </div>
      )} >
        <Suspense fallback={<LoaderFallback />}>
          <Content resource={resource} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function Content({ resource }: { resource: ResourceReturn<StudyOverview, DataProviderTypes.getStudyOverviewConfig> }) {
  const data = resource[0]
  const cData = createMemo(() => data.state === "refreshing" ? data.latest : data())
  const { refetch, mutate } = resource[1]
  const submit = useAction(getStudyCoursesDetailsAction);


  const validator: <K extends keyof NavigationSchema>(name: K, value: NavigationSchema[K]) => ReturnType<ValidatorFn<NavigationSchema[K]>> = (name, value) => {
    const returnType = navigationSchema.pick({ [name]: true } as { [K in keyof NavigationSchema]: true }).safeParse({ [name]: value });
    return returnType.error ? { error: returnType.error } : null
  }

  const defaultValues = {
    semester: SEMESTER.WINTER,
    degree: DEGREE.BACHELOR,
    grade: undefined,
    coursesCompulsory: [],
    coursesOptional: []
  }


  const [groupData, setGroupData] = makePersisted(createSignal<{ [K in keyof Required<NavigationSchema>]: NavigationSchema[K] }>(), { name: "groupData", storage: cookieStorage.withOptions({ expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }) })

  const group = createFormGroup({
    year: createFormControl<StudyOverviewYear | undefined>(groupData()?.year ?? data()?.values.year, { required: true, validators: validator.bind(null, "year") }),
    degree: createFormControl<DEGREE>(groupData()?.degree ?? data()?.values.degree ?? defaultValues.degree, { required: true, validators: validator.bind(null, "degree") }),
    program: createFormControl<StudyProgram["id"] | undefined>(groupData()?.program ?? data()?.values.program?.id, { required: true, validators: validator.bind(null, "program") }),
    grade: createFormControl<GradeKey>(groupData()?.grade ?? defaultValues.grade, { required: true, validators: validator.bind(null, "grade") }),
    semester: createFormControl<typeof SEMESTER[SEMESTER]>(groupData()?.semester ?? defaultValues.semester, { required: true, validators: validator.bind(null, "semester") }),
    coursesCompulsory: createFormControl<string[]>(groupData()?.coursesCompulsory ?? defaultValues.coursesCompulsory, { required: true, validators: validator.bind(null, "coursesCompulsory") }),
    coursesOptional: createFormControl<string[]>(groupData()?.coursesOptional ?? defaultValues.coursesOptional, { required: true, validators: validator.bind(null, "coursesOptional") }),
  } satisfies {
    [K in keyof Required<NavigationSchema>]: IFormControl<NavigationSchema[K]>;
  })

  createEffect(() => {
    setGroupData(mapValues(trackStore(group).controls, (value) => (value.rawValue)) as { [K in keyof Required<NavigationSchema>]: NavigationSchema[K] })
  })



  const getFetchableData = () => ({
    year: group.controls.year.value?.value,
    program: group.controls.program.value
  })

  /** refetch data */
  createRenderEffect(on(getFetchableData, (data, _, firstEffect) => {
    if (firstEffect) return false
    const degree = group.controls.degree.value
    const fullData: DataProviderTypes.getStudyOverviewConfig = { ...data, degree }
    void refetch(fullData)
    return false
  }), true)

  /** Check changed degree grade */
  createRenderEffect(() => {
    const value = group.controls.degree.value
    const dataProgram = untrack(data)?.data.programs[value]
    if (!dataProgram) return;
    const programsLength = dataProgram.flatMap(e => [e, ...e.specializations]).length
    const isAssignedAtDifferentDegree = createMemo(() => group.controls.program.value ? !dataProgram.flatMap(e => [e, ...e.specializations]).find(e => e.id === group.controls.program.value) : true)
    if (programsLength === 1 && isAssignedAtDifferentDegree()) {
      group.controls.program.setValue(dataProgram[0].id)
    }
  })

  const onSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> | undefined = async (e) => {
    e.preventDefault();
    group.markSubmitted(true);
    const c = group.controls
    const submitData = {
      year: c.year.value!.value,
      semester: c.semester.value,
      courses: [...c.coursesCompulsory.value, ...c.coursesOptional.value].map(id => ({ courseId: id }))
    }
    submit(submitData)

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
        <Button class="w-full !mt-8 sticky bottom-0" type="submit">Generate</Button>
      </GroupContext.Provider>
    </form>
  )
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
  const group = useContext(GroupContext)!
  const data = useContext(DataContext)!


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
      <Select.Label as="h3" class={typographyVariants({ variant: "h5" })}>Year</Select.Label>
      <SelectTrigger>
        <SelectValue<StudyOverviewYear>>{(state) => state.selectedOption()?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  )
}

function DegreeSelect() {
  const group = useContext(GroupContext)!
  const data = useContext(DataContext)!


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
      <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >Degree</RadioGroup.Label>
      <For each={data()?.data.degrees}>
        {(degree) => (
          <RadioGroupItem value={degree} class="flex items-center gap-2">
            <RadioGroupItemInput />
            <RadioGroupItemControl as="button" type="button" />
            <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{degree}</RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  )
}

function ProgramSelect() {
  const group = useContext(GroupContext)!
  const data = useContext(DataContext)!

  return (
    <Show when={group.controls.program && group.controls.degree.value && data()?.data.programs[group.controls.degree.value].length}>
      <RadioGroup
        value={group.controls.program.value}
        onChange={(program) => program && group.controls.program.setValue(program)}
        name="specialization"
        onBlur={() => group.controls.program!.markTouched(true)}
        disabled={group.controls.program.isDisabled}
        required={group.controls.program.isRequired}
        validationState={group.controls.program.errors ? "invalid" : "valid"}
        class="grid gap-x-2"
      >
        <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >Program</RadioGroup.Label>
        <For each={data()!.data.programs[group.controls.degree!.value]}>
          {(specialization) => (
            <section class="ml-2">
              <Show when={specialization.specializations.length > 0} fallback={
                <RadioGroupItem value={specialization.id} class="flex items-center gap-2">
                  <RadioGroupItemInput />
                  <RadioGroupItemControl as="button" type="button" />
                  <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{specialization.abbreviation}</RadioGroupItemLabel>
                </RadioGroupItem>
              }>
                <Heading as="h4" variant="h6">{specialization.abbreviation}</Heading>
                <For each={specialization.specializations} >
                  {(specialization) => (
                    <RadioGroupItem value={specialization.id} class="flex items-center gap-2">
                      <RadioGroupItemInput />
                      <RadioGroupItemControl as="button" type="button" />
                      <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{specialization.abbreviation}</RadioGroupItemLabel>
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
  const group = useContext(GroupContext)!
  const data = useContext(DataContext)!

  const Fallback = () => (
    <Text class={typographyVariants({ class: "!mt-0 text-sm ml-2" })}>
      select degree program to show
    </Text>
  )

  console.log("🚀 ~ file: Content.tsx:304 ~ GradeSelect ~ group.controls.degree.value === data()!.values.degree:", group.controls.degree.value, data()?.values.degree)
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
      <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >Grade</RadioGroup.Label>
      <Suspense fallback={<LoaderFallback />}>
        <Show when={data() && group.controls.degree.value === data()!.values.degree} fallback={<Fallback />}>
          <For each={data()!.data.grades}>
            {(grade) => (
              <RadioGroupItem value={grade.key} class="flex items-center gap-2 relative">
                <RadioGroupItemInput class="bottom-0" />
                <RadioGroupItemControl as="button" type="button" />
                <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{grade.label}</RadioGroupItemLabel>
              </RadioGroupItem>
            )}
          </For>
        </Show>
      </Suspense>
    </RadioGroup>
  )
}

function SemesterSelect() {
  const group = useContext(GroupContext)!
  const data = useContext(DataContext)!

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
      <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >Semestr</RadioGroup.Label>
      <For each={data()?.data.semesters}>
        {(semester) => (
          <RadioGroupItem value={semester} class="flex items-center gap-2">
            <RadioGroupItemInput />
            <RadioGroupItemControl as="button" type="button" />
            <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{semester}</RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  )
}

function CoursesSelect() {
  const group = useContext(GroupContext)!
  const data = useContext(DataContext)!

  const Fallback = () => (
    group.controls.grade.value ?
      <Text variant="smallText">
        no courses to show
      </Text>
      : <Text variant="smallText">
        select grade to show
      </Text>
  )

  const compulsoryCourses = createMemo(() => !!group.controls.grade.value && data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value].compulsory)
  const optionalCourses = createMemo(() => !!group.controls.grade.value && data()?.data.courses[group.controls.grade.value]?.[group.controls.semester.value].optional)

  const handleChange = (checked: boolean, type: "coursesCompulsory" | "coursesOptional", courseId: string,) => {
    group.controls[type].setValue(checked ? [...group.controls[type].value, courseId] : group.controls[type].value.filter(id => id !== courseId))
  }

  return (
    <section class="space-y-2 ml-2">
      <Show when={group.controls.degree.value === data()?.values.degree}>
        <Typography as="p" variant={"h5"}>Compulsory</Typography>
        <Show when={compulsoryCourses()} fallback={<Fallback />} keyed>
          {(compulsoryCourses) => (
            <>
              <Checkbox
                class="flex items-start"
                value="all"
                checked={group.controls.coursesCompulsory.value!.length === compulsoryCourses.length}
                onChange={(checked) => checked && group.controls.coursesCompulsory.setValue(compulsoryCourses.map(e => e.id))}>
                <CheckboxControl />
                <CheckboxLabel class={("ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")}>
                  Všechny
                </CheckboxLabel>
              </Checkbox>
              <For each={compulsoryCourses} >
                {(course) => (
                  <Checkbox checked={group.controls.coursesCompulsory.value.includes(course.id)} class="flex items-start" value={course.id} onChange={checked => handleChange(checked, "coursesCompulsory", course.id)}>
                    <CheckboxControl />
                    <CheckboxLabel class={("ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")}>
                      {course.abbreviation}
                    </CheckboxLabel>
                  </Checkbox>
                )}
              </For>
            </>
          )}
        </Show>
        <Typography as="p" variant={"h5"}>Voluntary</Typography>
        <Show when={optionalCourses()} fallback={<Fallback />} keyed>
          {(optionalCourses) => (
            <For each={optionalCourses}>
              {(course) => (
                <Checkbox checked={group.controls.coursesOptional.value.includes(course.id)} class="flex items-start" value={course.id} onChange={(checked) => handleChange(checked, "coursesOptional", course.id)}>
                  <CheckboxControl />
                  <CheckboxLabel class={("ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")}>
                    {course.abbreviation}
                  </CheckboxLabel>
                </Checkbox>
              )}
            </For>
          )}
        </Show>
      </Show>
    </section>
  )
}

function LoaderFallback() {
  return (
    <div class="grid place-items-center h-full">
      <LoaderCircle class="animate-spin" />
    </div>
  )
}