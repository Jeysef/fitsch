import type { PartialDeep } from "type-fest";
import type { ControlId, IAbstractControl } from "./abstract-control";
import type { IAbstractControlBaseOptions } from "./abstract-control-base";
import type { ControlsKey, ControlsRawValue, IAbstractControlContainer } from "./abstract-control-container";
export declare const FormGroupInterface = "@@FormGroupInterface_solidjs";
export interface IFormGroupOptions<Data extends Record<ControlId, any> = Record<ControlId, any>>
  extends IAbstractControlBaseOptions<Data> {}
export interface IFormGroup<
  Controls extends {
    [key: string]: IAbstractControl;
  } = {
    [key: string]: IAbstractControl;
  },
  Data extends Record<ControlId, any> = Record<ControlId, any>,
> extends IAbstractControlContainer<Controls, Data> {
  [FormGroupInterface]: true;
  setControls(controls: Controls): void;
  removeControl(keyOrControl: ControlsKey<Controls> | Controls[ControlsKey<Controls>]): void;
  patchValue(value: PartialDeep<ControlsRawValue<Controls>>): void;
}
/**
 * Returns true if the provided object implements
 * `IFormGroup`
 */
export declare function isFormGroup(object?: unknown): object is IFormGroup;
export declare function createFormGroup<
  Controls extends {
    [key: string]: IAbstractControl;
  } = {
    [key: string]: IAbstractControl;
  },
  Data extends Record<ControlId, any> = Record<ControlId, any>,
>(controls?: Controls, options?: IFormGroupOptions<Data>): IFormGroup<Controls, Data>;
