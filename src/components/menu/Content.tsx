import { useAction } from "@solidjs/router";
import isEqual from "deep-equal";
import LoaderCircle from "lucide-solid/icons/loader-circle";
import { createResource, ErrorBoundary, For, Show, Suspense, type JSX, type ResourceReturn } from "solid-js";
import { unwrap } from "solid-js/store";
import { navigationSchema, type NavigationSchema } from "~/components/menu/schema";
import { Typography, typographyVariants } from "~/components/typography";
import Heading from "~/components/typography/heading";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxControl, CheckboxLabel } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem, RadioGroupItemControl, RadioGroupItemInput, RadioGroupItemLabel } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { createDeepSignal } from "~/lib/solid";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { DEGREE, SEMESTER } from "~/server/scraper/enums";
import { getStudyOverview } from "~/server/scraper/functions";
import { type DataProviderTypes, type GradeKey, type StudyOverview, type StudyOverviewYear, type StudyProgram } from "~/server/scraper/types";
import { createFormControl, createFormGroup, type IFormControl, type ValidatorFn } from "~/solid-forms/";

export default function Wrapper() {
  // defer, so that the loading is not shown on client
  const resource = createResource(getStudyOverview, { deferStream: true, storage: createDeepSignal });


  const [data] = resource
  return (
    <div class="w-44 space-y-2">
      {/* in future replace with skeleton or deferStream on resource */}
      <ErrorBoundary fallback={<div>Something went wrong</div>} >
        <Suspense fallback={<div class="grid place-items-center h-full"><LoaderCircle class="animate-spin" /></div>}>
          <Show when={data()}>
            <Content resource={resource} />
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function Content({ resource }: { resource: ResourceReturn<StudyOverview, DataProviderTypes.getStudyOverviewConfig> }) {
  const data = resource[0]
  console.log("🚀 ~ file: Content.tsx:42 ~ Content ~ data:", unwrap(data()))
  const { refetch, mutate } = resource[1]
  const submit = useAction(getStudyCoursesDetailsAction);


  const validator: <K extends keyof NavigationSchema>(name: K, value: NavigationSchema[K]) => ReturnType<ValidatorFn<NavigationSchema[K]>> = (name, value) => {
    const returnType = navigationSchema.pick({ [name]: true } as { [K in keyof NavigationSchema]: true }).safeParse({ [name]: value });
    return returnType.error ? { error: returnType.error } : null
  }

  const defaultValues = {
    semester: SEMESTER.WINTER,
    grade: undefined,
    coursesCompulsory: [],
    coursesOptional: []
  }


  const group = createFormGroup({
    year: createFormControl<StudyOverviewYear>(data()?.values.year, { required: true, validators: validator.bind(null, "year") }),
    semester: createFormControl<typeof SEMESTER[SEMESTER]>(defaultValues.semester, { required: true, validators: validator.bind(null, "semester") }),
    degree: createFormControl<DEGREE>(data()?.values.degree, { required: true, validators: validator.bind(null, "degree") }),
    grade: createFormControl<GradeKey>(defaultValues.grade, { required: true, validators: validator.bind(null, "grade") }),
    program: createFormControl<StudyProgram["id"]>(data()?.values.program?.id, { required: true, validators: validator.bind(null, "program") }),
    coursesCompulsory: createFormControl<string[]>(defaultValues.coursesCompulsory, { required: true, validators: validator.bind(null, "coursesCompulsory") }),
    coursesOptional: createFormControl<string[]>(defaultValues.coursesOptional, { required: true, validators: validator.bind(null, "coursesOptional") }),
  } satisfies {
    [K in keyof NavigationSchema]: IFormControl<NavigationSchema[K]>;
  })

  function onFetchableChange<K extends keyof DataProviderTypes.getStudyOverviewConfig & keyof NavigationSchema>(name: K, value: NavigationSchema[K], apiValue: DataProviderTypes.getStudyOverviewConfig[K]) {
    if (isEqual(group.controls[name].value, value)) return;
    const currentData: DataProviderTypes.getStudyOverviewConfig = {
      year: group.controls.year.value.value,
      degree: group.controls.degree.value,
      program: group.controls.program.value
    }
    const nextData = { ...currentData, [name]: apiValue }
    // set value
    group.controls[name].setValue(value as any)
    void refetch(nextData)
  }

  const onSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> | undefined = async (e) => {
    e.preventDefault();
    group.markSubmitted(true);
    const c = group.controls
    const submitData = {
      year: c.year.value.value,
      semester: c.semester.value,
      courses: [...c.coursesCompulsory.value, ...c.coursesOptional.value].map(id => ({ courseId: id }))
    }
    submit(submitData)

  };
  return (
    <form onSubmit={onSubmit}>
      <Select
        options={data()?.data.years ?? []}
        optionValue="value"
        optionTextValue="label"
        value={group.controls.year.value}
        name="year"
        onChange={(year) => year && onFetchableChange("year", year, year.value)}
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
        <Select.Label as="h3" class={typographyVariants({ variant: "h5" })}>Rok</Select.Label>
        <SelectTrigger>
          <SelectValue<StudyOverviewYear>>{(state) => state.selectedOption().label}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
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
      <RadioGroup
        value={group.controls.degree.value}
        onChange={group.controls.degree.setValue as (value: string) => void}
        name="degree"
        onBlur={() => group.controls.degree.markTouched(true)}
        disabled={group.controls.degree.isDisabled}
        required={group.controls.degree.isRequired}
        class="grid gap-x-2"
      >
        <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >Studium</RadioGroup.Label>
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
      <Show when={group.controls.degree.value && data()?.data && data()!.data.programs[group.controls.degree.value]?.length > 0}>
        <RadioGroup
          value={group.controls.program.value}
          onChange={(program) => program && onFetchableChange("program", program, program)}
          name="specialization"
          onBlur={() => group.controls.program.markTouched(true)}
          disabled={group.controls.program.isDisabled}
          required={group.controls.program.isRequired}
          class="grid gap-x-2"
        >
          <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >Program</RadioGroup.Label>
          <For each={data()?.data.programs[group.controls.degree.value]}>
            {(specialization) => (
              <section class="ml-2">
                <Heading as="h4" variant="h6">{specialization.abbreviation}</Heading>
                <For each={specialization.specializations}>
                  {(specialization) => (
                    <RadioGroupItem value={specialization.id} class="flex items-center gap-2">
                      <RadioGroupItemInput />
                      <RadioGroupItemControl as="button" type="button" />
                      <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{specialization.abbreviation}</RadioGroupItemLabel>
                    </RadioGroupItem>
                  )}
                </For>
              </section>
            )}
          </For>
        </RadioGroup>
      </Show>
      <RadioGroup
        value={group.controls.grade.value}
        onChange={group.controls.grade.setValue as (value: string) => void}
        name="yearOfStudy"
        onBlur={() => group.controls.grade.markTouched(true)}
        disabled={group.controls.grade.isDisabled}
        required={group.controls.grade.isRequired}
        class="grid gap-x-2"
      >
        <RadioGroup.Label as="h3" class={typographyVariants({ variant: "h5" })} >Ročník</RadioGroup.Label>
        <For each={data()?.data.grades}>
          {(grade) => (
            <RadioGroupItem value={grade.key} class="flex items-center gap-2 relative">
              <RadioGroupItemInput class="bottom-0" />
              <RadioGroupItemControl as="button" type="button" />
              <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{grade.label}</RadioGroupItemLabel>
            </RadioGroupItem>
          )}
        </For>
      </RadioGroup>
      <Typography as="span" variant={"h5"}>Předměty</Typography>
      <section class="space-y-2 ml-2">
        <Show when={group.controls.grade.value && group.controls.semester.value} fallback={
          <Text variant="smallText">
            select grade to show
          </Text>

        }>
          <Typography as="span" variant={"h6"}>Povinné</Typography>
          <Checkbox
            class="flex items-start"
            value="all"
            checked={group.controls.coursesCompulsory.value.length === data()?.data.courses[group.controls.grade.value][group.controls.semester.value].compulsory.length}
            onChange={(checked) => checked && data() && group.controls.coursesCompulsory.setValue(data()!.data.courses[group.controls.grade.value][group.controls.semester.value].compulsory.map(e => e.id))}>
            <CheckboxControl />
            <CheckboxLabel class={("ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")}>
              Všechny
            </CheckboxLabel>
          </Checkbox>
          <For each={data()?.data.courses[group.controls.grade.value][group.controls.semester.value].compulsory} >
            {(course) => (
              <Checkbox checked={group.controls.coursesCompulsory.value.includes(course.id)} class="flex items-start" value={`${course.id}`} onChange={(checked) => group.controls.coursesCompulsory.setValue(checked ? [...group.controls.coursesCompulsory.value, course.id] : group.controls.coursesCompulsory.value.filter(id => id !== course.id))}>
                <CheckboxControl />
                <CheckboxLabel class={("ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")}>
                  {course.abbreviation}
                </CheckboxLabel>
              </Checkbox>
            )}
          </For>
          <Typography as="span" variant={"h6"}>Volitelné</Typography>
          <For each={data()?.data.courses[group.controls.grade.value][group.controls.semester.value].optional}>
            {(course) => (
              <Checkbox class="flex items-start" value={`${course.id}`} onChange={(checked) => group.controls.coursesOptional.setValue(checked ? [...group.controls.coursesOptional.value, course.id] : group.controls.coursesOptional.value.filter(id => id !== course.id))}>
                <CheckboxControl />
                <CheckboxLabel class={("ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")}>
                  {course.abbreviation}
                </CheckboxLabel>
              </Checkbox>
            )}
          </For>
        </Show>
      </section>
      <Button class="w-full !mt-8 sticky bottom-0" type="submit">Vygenerovat</Button>
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