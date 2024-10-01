import LoaderCircle from "lucide-solid/icons/loader-circle";
import { createResource, For, Match, Show, Suspense, Switch, type JSX, type Resource, type ResourceReturn } from "solid-js";
import { navigationSchema, type NavigationSchema } from "~/components/menu/schema";
import { Typography, typographyVariants } from "~/components/typography";
import { Button } from "~/components/ui/button";
import { Checkbox, CheckboxControl, CheckboxLabel } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem, RadioGroupItemControl, RadioGroupItemInput, RadioGroupItemLabel } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { getData } from "~/server/scraper/mock";
import { SEMESTER, type DataProviderTypes, type DEGREE, type GradeKey, type StudyOverview, type StudyProgramWithUrl } from "~/server/scraper/types";
import { createFormControl, createFormGroup, type IFormControl, type ValidatorFn } from "~/solid-forms/";

export default function Wrapper() {
  // defer, so that the loading is not shown on client
  const resource = createResource(getData, { deferStream: true });


  const [data] = resource
  return (
    <div class="w-44 space-y-2">
      {/* in future replace with skeleton or deferStream on resource */}
      <Suspense fallback={<div class="grid place-items-center h-full"><LoaderCircle class="animate-spin" /></div>}>
        <Switch>
          <Match when={data.error}>
            <span>Error: {data.error}</span>
          </Match>
          <Match when={!!data()?.data}>
            <Content resource={resource} />
          </Match>
        </Switch>
      </Suspense>
    </div>
  )
}

function Content({ resource }: { resource: ResourceReturn<StudyOverview, DataProviderTypes.getStudyOverviewConfig> }) {
  // const [data] = resource
  const data = resource[0] as Resource<StudyOverview> & { state: "ready" }


  const validator: <K extends keyof NavigationSchema>(name: K, value: NavigationSchema[K]) => ReturnType<ValidatorFn<NavigationSchema[K]>> = (name, value) => {
    const returnType = navigationSchema.pick({ [name]: true } as { [K in keyof NavigationSchema]: true }).safeParse({ [name]: value });
    return returnType.error ? { error: returnType.error } : null
  }

  // const checkFetchableChange: <K extends keyof NavigationSchema>(name: K, value: NavigationSchema[K]) => ReturnType<ValidatorFn<NavigationSchema[K]>> = (name, value) => {
  //   // check if the value changed from data.values. if so call reload with new values
  //   if (data().values[name] === value) return null
  //   return null
  // }


  const defaultValues = {
    semester: SEMESTER.WINTER,
    grade: undefined,
    programsObligatory: [],
    programsOptional: []
  }

  const group = createFormGroup({
    year: createFormControl<string>(data().values.year.value, { required: true, validators: validator.bind(null, "year") }),
    semester: createFormControl<typeof SEMESTER[SEMESTER]>(defaultValues.semester, { required: true, validators: validator.bind(null, "semester") }),
    degree: createFormControl<DEGREE>(data().values.degree, { required: true, validators: validator.bind(null, "degree") }),
    grade: createFormControl<GradeKey>(defaultValues.grade, { required: true, validators: validator.bind(null, "grade") }),
    program: createFormControl<StudyProgramWithUrl["id"]>(data().values.program?.id, { required: true, validators: validator.bind(null, "program") }),
    programsObligatory: createFormControl<string[]>(defaultValues.programsObligatory, { required: true, validators: validator.bind(null, "programsObligatory") }),
    programsOptional: createFormControl<string[]>(defaultValues.programsOptional, { required: true, validators: validator.bind(null, "programsOptional") }),
  } satisfies {
    [K in keyof NavigationSchema]: IFormControl<NavigationSchema[K] | undefined>;
  })

  const onSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> | undefined = async (e) => {
    e.preventDefault();
    group.markSubmitted(true);
    group.value
  };
  return (
    <form onSubmit={onSubmit}>
      <Select
        options={data().data.years.map(y => y.value)}
        value={group.controls.year.value}
        name="year"
        onChange={group.controls.year.setValue as (value: string | null) => void}
        placeholder="Select a year"
        onBlur={() => group.controls.year.markTouched(true)}
        disabled={group.controls.year.isDisabled}
        required={group.controls.year.isRequired}
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
      >
        <Select.Label class={typographyVariants({ variant: "h5" })}>Rok</Select.Label>
        <SelectTrigger>
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
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
        <RadioGroup.Label class={typographyVariants({ variant: "h5" })} >Semestr</RadioGroup.Label>
        <For each={data()!.data.semesters}>
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
        <RadioGroup.Label class={typographyVariants({ variant: "h5" })} >Studium</RadioGroup.Label>
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
      <Show when={group.controls.degree.value && data().data.programs[group.controls.degree.value]?.length > 0}>
        <RadioGroup
          value={group.controls.program.value}
          onChange={group.controls.program.setValue as (value: string) => void}
          name="specialization"
          onBlur={() => group.controls.program.markTouched(true)}
          disabled={group.controls.program.isDisabled}
          required={group.controls.program.isRequired}
          class="grid gap-x-2"
        >
          <RadioGroup.Label class={typographyVariants({ variant: "h5" })} >Obor</RadioGroup.Label>
          <For each={data().data.programs[group.controls.degree.value]}>
            {(specialization) => (
              <RadioGroupItem value={specialization.id} class="flex items-center gap-2">
                <RadioGroupItemInput />
                <RadioGroupItemControl as="button" type="button" />
                <RadioGroupItemLabel class={typographyVariants({ class: "!mt-0 text-sm" })}>{specialization.abbreviation}</RadioGroupItemLabel>
              </RadioGroupItem>
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
        <RadioGroup.Label class={typographyVariants({ variant: "h5" })} >Ročník</RadioGroup.Label>
        <For each={data()!.data.grades}>
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
        <Show when={group.controls.grade.value && group.controls.semester.value}>
          <Typography as="span" variant={"h6"}>Povinné</Typography>
          <For each={data().data.courses[group.controls.grade.value!][group.controls.semester.value!].compulsory}>
            {(course) => (
              <Checkbox class="flex items-start" value={`${course.id}`}>
                <CheckboxControl />
                <CheckboxLabel class="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {course.abbreviation}
                </CheckboxLabel>
              </Checkbox>
            )}
          </For>
          <Typography as="span" variant={"h6"}>Volitelné</Typography>
          <For each={data().data.courses[group.controls.grade.value!][group.controls.semester.value].optional}>
            {(course) => (
              <Checkbox class="flex items-start" value={`${course.id}`}>
                <CheckboxControl />
                <CheckboxLabel class="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {course.abbreviation}
                </CheckboxLabel>
              </Checkbox>
            )}
          </For>
        </Show>
      </section>
      <Button class="w-full !mt-8" type="submit">Vygenerovat</Button>
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