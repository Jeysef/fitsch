import { AbstractControlInterface, ControlId } from './abstract-control';
import { AbstractControlContainerInterface, GenericControlsObject } from './abstract-control-container';
import { IAbstractControlContainer } from './abstract-control-container';
import { IAbstractControlBaseOptions } from './abstract-control-base';
import { SetStoreFunction, Store } from 'solid-js/store';
import { Accessor } from 'solid-js';
export interface IAbstractControlContainerBaseArgs<Data extends Record<ControlId, any> = Record<ControlId, any>> extends IAbstractControlBaseOptions<Data> {
}
export interface IAbstractControlContainerBase<Data extends Record<ControlId, any> = Record<ControlId, any>> extends Omit<IAbstractControlContainer<any, Data>, 'value' | 'rawValue' | 'controls' | 'setControl' | typeof AbstractControlInterface | typeof AbstractControlContainerInterface> {
}
export declare function createAbstractControlContainerBase<Controls extends GenericControlsObject = any, Data extends Record<ControlId, any> = Record<ControlId, any>>(store: Accessor<[
    Store<IAbstractControlContainer<Controls, Data>>,
    SetStoreFunction<IAbstractControlContainer<Controls, Data>>
]>, untilInit: <T>(value: T) => T, initOptions?: IAbstractControlContainerBaseArgs<Data>): [base: IAbstractControlContainerBase<Data>, initializer: () => void];
//# sourceMappingURL=abstract-control-container-base.d.ts.map