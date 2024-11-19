import { createMemo, createRoot } from 'solid-js';
import { createComponent, mergeProps } from 'solid-js/web';
import { isAbstractControlContainer } from './core';
export * from './core';

function withControl(options) {
  const prefix = options.classListPrefix || "sf";

  const wrappedComponent = props => {
    const control = createMemo(() => props.control || createRoot(() => options.controlFactory(props)));
    const controlClassList = createMemo(() => createClassList(control(), prefix));
    const Component = options.component;
    return createComponent(Component, mergeProps(props, {
      get control() {
        return control();
      },

      controlClassList: controlClassList
    }));
  };

  wrappedComponent.control = options.controlFactory;
  return wrappedComponent;
}
function createClassList(control, prefix = "sf") {
  return {
    [`${prefix}-control-container`]: isAbstractControlContainer(control),
    [`${prefix}-valid`]: control.isValid,
    [`${prefix}-invalid`]: !control.isValid,
    [`${prefix}-dirty`]: control.isDirty,
    [`${prefix}-not-dirty`]: !control.isDirty,
    [`${prefix}-touched`]: control.isTouched,
    [`${prefix}-untouched`]: !control.isTouched,
    [`${prefix}-pending`]: control.isPending,
    [`${prefix}-not-pending`]: !control.isPending,
    [`${prefix}-disabled`]: control.isDisabled,
    [`${prefix}-enabled`]: !control.isDisabled,
    [`${prefix}-editable`]: !control.isReadonly,
    [`${prefix}-readonly`]: control.isReadonly,
    [`${prefix}-optional`]: !control.isRequired,
    [`${prefix}-required`]: control.isRequired,
    [`${prefix}-submitted`]: control.isSubmitted,
    [`${prefix}-not-submitted`]: !control.isSubmitted
  };
}

export { createClassList, withControl };

