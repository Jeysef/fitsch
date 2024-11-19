import type { Accessor } from "solid-js";
import type { SetStoreFunction, Store } from "solid-js/store";
import type { AbstractControlInterface, ControlId } from "./abstract-control";
import type { IAbstractControlBaseOptions } from "./abstract-control-base";
import type { AbstractControlContainerInterface, GenericControlsObject } from "./abstract-control-container";
import type { IAbstractControlContainer } from "./abstract-control-container";
export interface IAbstractControlContainerBaseArgs<Data extends Record<ControlId, any> = Record<ControlId, any>>
  extends IAbstractControlBaseOptions<Data> {}
export interface IAbstractControlContainerBase<Data extends Record<ControlId, any> = Record<ControlId, any>>
  extends Omit<
    IAbstractControlContainer<any, Data>,
    | "value"
    | "rawValue"
    | "controls"
    | "setControl"
    | typeof AbstractControlInterface
    | typeof AbstractControlContainerInterface
  > {}
export declare function createAbstractControlContainerBase<
  Controls extends GenericControlsObject = any,
  Data extends Record<ControlId, any> = Record<ControlId, any>,
>(
  store: Accessor<
    [Store<IAbstractControlContainer<Controls, Data>>, SetStoreFunction<IAbstractControlContainer<Controls, Data>>]
  >,
  untilInit: <T>(value: T) => T,
  initOptions?: IAbstractControlContainerBaseArgs<Data>
): [base: IAbstractControlContainerBase<Data>, initializer: () => void];
