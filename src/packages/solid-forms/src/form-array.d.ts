import type { PartialDeep } from "type-fest";
import type { ControlId, IAbstractControl } from "./abstract-control";
import type { IAbstractControlBaseOptions } from "./abstract-control-base";
import type { ControlsKey, ControlsRawValue, IAbstractControlContainer } from "./abstract-control-container";
export declare const FormArrayInterface = "@@FormArrayInterface_solidjs";
export interface IFormArrayOptions<Data extends Record<ControlId, any> = Record<ControlId, any>>
  extends IAbstractControlBaseOptions<Data> {}
export interface IFormArray<
  Controls extends ReadonlyArray<IAbstractControl> = ReadonlyArray<IAbstractControl>,
  Data extends Record<ControlId, any> = Record<ControlId, any>,
> extends IAbstractControlContainer<Controls, Data> {
  [FormArrayInterface]: true;
  push(control: Controls[number]): void;
  setControls(controls: Controls): void;
  removeControl(keyOrControl: ControlsKey<Controls> | Controls[ControlsKey<Controls>]): void;
  patchValue(value: PartialDeep<ControlsRawValue<Controls>>): void;
}
/**
 * Returns true if the provided object implements
 * `IFormArray`
 */
export declare function isFormArray(object?: unknown): object is IFormArray;
export declare function createFormArray<
  Controls extends ReadonlyArray<IAbstractControl> = ReadonlyArray<IAbstractControl>,
  Data extends Record<ControlId, any> = Record<ControlId, any>,
>(controls?: Controls, options?: IFormArrayOptions<Data>): IFormArray<Controls, Data>;
