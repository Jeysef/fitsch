import type { IFormControl, IFormGroup } from "solid-forms";
import type { MenuSchema, MenuSchemaKey } from "~/components/menu/schema";

export type FormGroupValues = { [K in MenuSchemaKey]: MenuSchema[K] };
export type FormGroupControls = { [K in keyof FormGroupValues]: IFormControl<FormGroupValues[K]> };
export type FormGroup = IFormGroup<FormGroupControls, FormGroupValues>;

export type MenuSelected = MenuSchema["selected"];
