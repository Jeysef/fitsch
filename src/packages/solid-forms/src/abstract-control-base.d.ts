import type { Accessor } from "solid-js";
import type { SetStoreFunction, Store } from "solid-js/store";
import type { AbstractControlInterface, ControlId, ValidationErrors, ValidatorFn } from "./abstract-control";
import type { IAbstractControl } from "./abstract-control";
export declare const DEFAULT_SOURCE = "CONTROL_DEFAULT_SOURCE";
export interface IAbstractControlBaseOptions<Data extends Record<ControlId, any> = Record<ControlId, any>> {
  id?: ControlId;
  data?: Data;
  disabled?: boolean;
  touched?: boolean;
  dirty?: boolean;
  readonly?: boolean;
  required?: boolean;
  submitted?: boolean;
  errors?: null | ValidationErrors | ReadonlyMap<ControlId, ValidationErrors>;
  validators?: null | ValidatorFn | ValidatorFn[] | ReadonlyMap<ControlId, ValidatorFn>;
  pending?: boolean | ReadonlySet<ControlId>;
}
export declare function propInitializer(): [propInitializing: <T>(value: T) => T, initComplete: () => void];
export declare function composeValidators(validators: undefined | null | ValidatorFn | ValidatorFn[]): null | ValidatorFn;
export declare type IAbstractControlBase<Data extends Record<ControlId, any> = Record<ControlId, any>> = Omit<
  IAbstractControl<unknown, Data, unknown>,
  "value" | "rawValue" | "setValue" | typeof AbstractControlInterface
>;
export declare function createAbstractControlBase<
  RawValue,
  Data extends Record<ControlId, any> = Record<ControlId, any>,
  Value = RawValue,
>(
  store: Accessor<
    [Store<IAbstractControl<RawValue, Data, Value>>, SetStoreFunction<IAbstractControl<RawValue, Data, Value>>]
  >,
  untilInit: <T>(value: T) => T,
  initOptions?: Pick<IAbstractControlBaseOptions<Data>, "id" | "data">
): [base: IAbstractControlBase<Data>, initializer: () => void];
