import { flattenObject } from "es-toolkit";
import { flatMap, isEqual } from "es-toolkit/compat";
import { produce, unwrap } from "solid-js/store";
import type { MenuSchema } from "~/components/menu/schema";
import type { FormGroup, MenuSelected } from "~/components/menu/types";
import { DEGREE, OBLIGATION } from "~/enums/enums";
import type { GradeKey } from "~/server/scraper/types/grade.types";
import type { ProgramUrl } from "~/server/scraper/types/program.types";

export const getAllSelectedCourseIds = (group: FormGroup): string[] =>
  group.controls.selected.value ? Object.values(flattenObject(group.controls.selected.value)) : [];

export const getSelectedCourseIds = (group: FormGroup, data?: Partial<MenuSchema>): string[] => {
  if (!group.controls.selected.value) return [];
  const selected = group.controls.selected.value;
  const degree = data?.degree;
  const program = data?.program;
  const grade = data?.grade;
  if (degree) {
    if (program) {
      if (grade) {
        return flatMap(selected[degree]?.[program]?.[grade]);
      }
      return Object.values(flattenObject(selected[degree]?.[program] ?? []));
    }
    return Object.values(flattenObject(selected[degree] ?? {}));
  }
  return Object.values(flattenObject(selected ?? {}));
};

export const getCurrentSelectedCourseIds = (group: FormGroup, data?: Partial<MenuSchema>): string[] => {
  if (!group.controls.selected.value) return [];
  const selected = group.controls.selected.value;
  const degree = data?.degree ?? group.controls.degree.value;
  const program = data?.program ?? group.controls.program.value;
  const grade = data?.grade ?? group.controls.grade.value;
  if (!degree || !program || !grade) return [];
  return flatMap(selected[degree]?.[program]?.[grade]);
};
const addToMenuSelected = (
  selected: MenuSelected | undefined,
  degree: DEGREE,
  program: ProgramUrl,
  gradeKey: GradeKey,
  obligation: OBLIGATION,
  valueToAdd: string
): MenuSelected => {
  // produce takes the original state and a function that receives a "draft"
  // of that state, which can be safely mutated.
  return produce<NonNullable<MenuSelected>>((draft) => {
    // Navigate down the path, creating nested objects if they don't exist.
    if (!draft[degree]) draft[degree] = {};
    const degreeLevel = draft[degree]!;

    if (!degreeLevel[program]) degreeLevel[program] = {};
    const programLevel = degreeLevel[program]!;

    if (!programLevel[gradeKey]) programLevel[gradeKey] = {};
    const gradeKeyLevel = programLevel[gradeKey]!;

    if (!gradeKeyLevel[obligation]) gradeKeyLevel[obligation] = [];
    const array = gradeKeyLevel[obligation]!;

    // "Mutate" the draft by pushing the new value if it doesn't exist.
    if (!array.includes(valueToAdd)) {
      array.push(valueToAdd);
    }
  })(unwrap(selected) ?? ({} satisfies MenuSelected));
};

const removeFromMenuSelected = (
  selected: MenuSelected | undefined,
  degree: DEGREE,
  program: ProgramUrl,
  gradeKey: GradeKey,
  obligation: OBLIGATION,
  valueToRemove: string
): MenuSelected | undefined => {
  // If the object is undefined, there's nothing to do.
  if (!selected) {
    return selected;
  }

  return produce<NonNullable<MenuSelected>>((draft) => {
    // Safely access the array. If any part of the path is missing,
    // the array will be undefined and the code will short-circuit.
    const array = draft[degree]?.[program]?.[gradeKey]?.[obligation];

    if (array) {
      const index = array.indexOf(valueToRemove);
      if (index > -1) {
        // Use splice to "mutate" the draft array.
        array.splice(index, 1);
      }
    }
  })(unwrap(selected));
};

const getMenuSelected = (
  selected: MenuSelected | undefined,
  degree: DEGREE,
  program: ProgramUrl,
  gradeKey: GradeKey,
  obligation: OBLIGATION,
  courseId: string
): boolean => {
  // Use optional chaining to safely access the nested property.
  // Use the nullish coalescing operator (??) to return an empty array
  // if any part of the path is undefined.
  const selectedArray = selected?.[degree]?.[program]?.[gradeKey]?.[obligation] ?? [];
  return selectedArray.includes(courseId);
};

export const handleCourseSelection = (group: FormGroup, obligation: OBLIGATION, courseId: string, checked: boolean) => {
  const selected = group.controls.selected.value;
  const degree = group.controls.degree.value;
  const program = group.controls.program.value;
  const grade = group.controls.grade.value;
  if (!degree || !program || !grade) return;

  switch (checked) {
    case true:
      group.controls.selected.setValue(addToMenuSelected(selected, degree, program, grade, obligation, courseId));
      break;
    case false:
      group.controls.selected.setValue(removeFromMenuSelected(selected, degree, program, grade, obligation, courseId));
      break;
  }
};

export const getCurrentSelectedCourseId = (group: FormGroup, obligation: OBLIGATION, courseId: string): boolean => {
  const selected = group.controls.selected.value;
  if (!selected) return false;
  const degree = group.controls.degree.value;
  const program = group.controls.program.value;
  const grade = group.controls.grade.value;
  if (!degree || !program || !grade) return false;

  return getMenuSelected(selected, degree, program, grade, obligation, courseId);
};

export function isObligationData(data: unknown): data is Record<OBLIGATION, string[]> {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const keys = Object.keys(data as Record<string, unknown>);
  const obligationKeys = Object.values(OBLIGATION);

  // Check if all keys in the data are valid OBLIGATION keys
  for (const key of keys) {
    if (!obligationKeys.includes(key as OBLIGATION)) {
      return false;
    }
  }

  let hasAtLeastOneValue = false;

  // Check if all values are arrays of strings and if any array has values
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = (data as Record<string, unknown>)[key];
      if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
        return false;
      }
      if (value.length > 0) {
        hasAtLeastOneValue = true;
      }
    }
  }

  return hasAtLeastOneValue;
}

const sortObject = (obj: Record<string, unknown>) => {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    sortedObj[key] = obj[key];
  }
  return sortedObj;
};

export const isSelectedEqual = (selected: any, current: any): boolean => {
  const flattenedSelected = flattenObject(selected);
  const flattenedCurrent = flattenObject(current);
  if (Object.keys(flattenedSelected).length !== Object.keys(flattenedCurrent).length) {
    return false;
  }
  return isEqual(sortObject(flattenedSelected), sortObject(flattenedCurrent));
};
