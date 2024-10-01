import { IAbstractControl, ControlId } from './abstract-control';
import { IAbstractControlBaseOptions } from './abstract-control-base';
export declare const FormControlInterface = "@@FormControlInterface_solidjs";
export interface IFormControlOptions<Data extends Record<ControlId, any> = Record<ControlId, any>> extends IAbstractControlBaseOptions<Data> {
}
export interface IFormControl<Value = any, Data extends Record<ControlId, any> = Record<ControlId, any>> extends IAbstractControl<Value, Data, Value> {
    [FormControlInterface]: true;
}
/**
 * Returns true if the provided object implements
 * `IFormControl`
 */
export declare function isFormControl(object?: unknown): object is IFormControl;
export declare function createFormControl<Value, Data extends Record<ControlId, any> = Record<ControlId, any>>(value?: Value, options?: IFormControlOptions<Data>): IFormControl<Value, Data>;
//# sourceMappingURL=form-control.d.ts.map