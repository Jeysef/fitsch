import { ControlId, IAbstractControl } from './abstract-control';
import { ControlsRawValue, ControlsKey, IAbstractControlContainer } from './abstract-control-container';
import { IAbstractControlBaseOptions } from './abstract-control-base';
import type { PartialDeep } from 'type-fest';
export declare const FormGroupInterface = "@@FormGroupInterface_solidjs";
export interface IFormGroupOptions<Data extends Record<ControlId, any> = Record<ControlId, any>> extends IAbstractControlBaseOptions<Data> {
}
export interface IFormGroup<Controls extends {
    [key: string]: IAbstractControl;
} = {
    [key: string]: IAbstractControl;
}, Data extends Record<ControlId, any> = Record<ControlId, any>> extends IAbstractControlContainer<Controls, Data> {
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
export declare function createFormGroup<Controls extends {
    [key: string]: IAbstractControl;
} = {
    [key: string]: IAbstractControl;
}, Data extends Record<ControlId, any> = Record<ControlId, any>>(controls?: Controls, options?: IFormGroupOptions<Data>): IFormGroup<Controls, Data>;
//# sourceMappingURL=form-group.d.ts.map