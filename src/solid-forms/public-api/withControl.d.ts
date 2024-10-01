import { Accessor, Component, JSX, ParentProps } from "solid-js";
import { type IAbstractControl } from "..";
declare type WithControlProps<Props, ControlFactory extends (...args: [any, ...any[]]) => IAbstractControl> = ParentProps<Props & (Parameters<ControlFactory>[number] extends never ? {} : Parameters<ControlFactory>[0] extends undefined ? {} : Parameters<ControlFactory>[0])>;
export interface IWithControlOptions<Props extends {}, ControlFactory extends (...args: [any, ...any[]]) => IAbstractControl> {
    controlFactory: ControlFactory;
    component: Component<WithControlProps<Props, ControlFactory> & {
        control: ReturnType<ControlFactory>;
        /**
         * Accessor returning a Solidjs classList for common form
         * control classes. By default it looks like:
         *
         * ```ts
         * {
         *   "sf-control-container": isAbstractControlContainer(control),
         *   "sf-valid": control.isValid,
         *   "sf-invalid": !control.isValid,
         *   "sf-dirty": control.isDirty,
         *   "sf-not-dirty": !control.isDirty,
         *   "sf-touched": control.isTouched,
         *   "sf-untouched": !control.isTouched,
         *   "sf-pending": control.isPending,
         *   "sf-not-pending": !control.isPending,
         *   "sf-disabled": control.isDisabled,
         *   "sf-enabled": !control.isDisabled,
         *   "sf-editable": !control.isReadonly,
         *   "sf-readonly": control.isReadonly,
         *   "sf-optional": !control.isRequired,
         *   "sf-required": control.isRequired,
         *   "sf-submitted": control.isSubmitted,
         *   "sf-not-submitted": !control.isSubmitted,
         * }
         * ```
         *
         * Usage example:
         *
         * ```tsx
         * const MyInput = withControl({
         *   controlFactory: () => { ... },
         *   component: (props) => {
         *     return (
         *       <div classList={props.classList()}>
         *         <input
         *           value={props.control.value}
         *           ...etc
         *         />
         *       </div>
         *     )
         *   }
         * })
         * ```
         */
        controlClassList: Accessor<ReturnType<typeof createClassList>>;
    }>;
    /**
     * Supply a custom prefix instead of `"sf"` for the `controlClassList`
     * property passed to the `component`.
     */
    classListPrefix?: string;
}
export declare type WithControlReturnType<Props extends {}, ControlFactory extends (...args: [any, ...any[]]) => IAbstractControl> = ((props: WithControlProps<Props, ControlFactory> & {
    control?: ReturnType<ControlFactory>;
}) => JSX.Element) & {
    /**
     * Factory function to build the component's default form control.
     * Note, you can pass any form control to the component which
     * satisfies the component's interface. You do not need to use
     * this factory function.
     *
     * Example usage:
     * ```ts
     * const TextInput = withControl({
     *   // etc...
     * });
     *
     * createFormGroup({
     *   street: TextInput.control(),
     *   city: TextInput.control(),
     *   state: TextInput.control(),
     *   zip: TextInput.control(),
     * })
     * ```
     */
    control: ControlFactory;
};
export declare function withControl<Props extends {}, ControlFactory extends (...args: [any, ...any[]]) => IAbstractControl>(options: IWithControlOptions<Props, ControlFactory>): WithControlReturnType<Props, ControlFactory>;
export declare function createClassList(control: IAbstractControl, prefix?: string): {
    [x: string]: boolean;
};
export { };
