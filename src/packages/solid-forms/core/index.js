import _isEqual from "deep-equal";
import { batch, createComputed, createMemo, createSignal, getOwner, on, runWithOwner } from "solid-js";
import { createStore, produce } from "solid-js/store";

// *****************************
// Misc Types
// *****************************
// *****************************
// AbstractControl interface
// *****************************
const AbstractControlInterface = "@@AbstractControlInterface_solidjs";
/** Returns true if the provided object implements `IAbstractControl` */

function isAbstractControl(object) {
  return typeof object === "object" && object?.[AbstractControlInterface] === true;
}

const AbstractControlContainerInterface = "@@AbstractControlContainerInterface_solidjs";
/**
 * Returns true if the provided object implements
 * `IAbstractControlContainer`
 */

function isAbstractControlContainer(object) {
  return isAbstractControl(object) && object[AbstractControlContainerInterface];
}

function isEqual(a, b) {
  return _isEqual(a, b);
}
function mergeObj(a, b) {
  return Object.defineProperties(a, Object.getOwnPropertyDescriptors(b));
}
/**
 * Helper to bind the owner of the current context to the
 * supplied function.
 *
 * Implementation is very simple:
 * ```ts
 * import { getOwner, runWithOwner } from 'solid-js';
 *
 * export function bindOwner<T>(fn: () => T): () => T {
 *   const owner = getOwner();
 *
 *   if (!owner) {
 *     throw new Error('No solidjs owner in current context');
 *   }
 *
 *   return () => runWithOwner(owner, fn);
 * }
 * ```
 */

function bindOwner(fn) {
  const owner = getOwner();

  if (!owner) {
    throw new Error("No solidjs owner in current context");
  }

  return () => runWithOwner(owner, fn);
}

const DEFAULT_SOURCE = "CONTROL_DEFAULT_SOURCE";
function propInitializer() {
  const [initializationSignal, setInitializationSignal] = createSignal(null);
  return [(value) => initializationSignal() || value, () => setInitializationSignal(false)];
}
function composeValidators(validators) {
  if (!validators || (Array.isArray(validators) && validators.length === 0)) {
    return null;
  }

  if (Array.isArray(validators)) {
    return (control) =>
      validators.reduce((prev, curr) => {
        const errors = curr(control);
        return errors ? { ...prev, ...errors } : prev;
      }, null);
  }

  return validators;
}
let controlId = 0;
function createAbstractControlBase(store, untilInit, initOptions = {}) {
  let control;
  let setControl;
  let selfIsPendingMemo;
  let selfErrorsMemo;
  let statusMemo;
  let validatorMemo;
  const base = {
    id: initOptions.id || Symbol(`AbstractControl-${controlId++}`),
    data: { ...initOptions.data },
    self: {
      get isValid() {
        // here "this" is self
        return this.errors === null && !this.isPending;
      },

      isDisabled: false,
      isTouched: false,
      isDirty: false,
      isReadonly: false,
      isSubmitted: false,
      isRequired: false,

      get isPending() {
        return selfIsPendingMemo?.() ?? untilInit(false);
      },

      get errors() {
        return selfErrorsMemo?.() ?? untilInit(null);
      },

      errorsStore: new Map(),
      pendingStore: new Set(),
      validatorStore: new Map(),
    },

    get isDisabled() {
      return this.self.isDisabled;
    },

    get isTouched() {
      return this.self.isTouched;
    },

    get isDirty() {
      return this.self.isDirty;
    },

    get isReadonly() {
      return this.self.isReadonly;
    },

    get isSubmitted() {
      return this.self.isSubmitted;
    },

    get isRequired() {
      return this.self.isRequired;
    },

    get errors() {
      return this.self.errors;
    },

    get isPending() {
      return this.self.isPending;
    },

    get isValid() {
      return this.self.isValid;
    },

    get status() {
      return statusMemo?.() ?? untilInit("VALID");
    },

    get validator() {
      return validatorMemo?.() ?? untilInit(null);
    },

    markDisabled(input) {
      if (isEqual(this.self.isDisabled, input)) return;
      setControl("self", "isDisabled", input);
    },

    markReadonly(input) {
      if (isEqual(this.self.isReadonly, input)) return;
      setControl("self", "isReadonly", input);
    },

    markRequired(input) {
      if (isEqual(this.self.isRequired, input)) return;
      setControl("self", "isRequired", input);
    },

    markDirty(input) {
      if (isEqual(this.self.isDirty, input)) return;
      setControl("self", "isDirty", input);
    },

    markTouched(input) {
      if (isEqual(this.self.isTouched, input)) return;
      setControl("self", "isTouched", input);
    },

    markSubmitted(input) {
      if (isEqual(this.self.isSubmitted, input)) return;
      setControl("self", "isSubmitted", input);
    },

    markPending(input, options) {
      let newPendingStore;

      if (typeof input === "boolean") {
        const source = options?.source || DEFAULT_SOURCE;
        if (this.self.pendingStore.has(source) === input) return;
        newPendingStore = new Set(this.self.pendingStore);

        if (input) {
          newPendingStore.add(source);
        } else {
          newPendingStore.delete(source);
        }
      } else {
        if (this.self.pendingStore === input) return;
        newPendingStore = new Set(input);
      }

      if (isEqual(this.self.pendingStore, newPendingStore)) return; // We're using `produce()` here because using the standard solid Store
      // nested setter has some bugs (i.e.
      // `setControl('self', 'pendingStore', newPendingStore)`). I think the
      // bugs are isolated to object values, so, at the moment, I'm only using
      // produce where the value is an object.

      setControl(
        produce((state) => {
          state.self.pendingStore = newPendingStore;
        })
      );
    },

    setErrors(input, options) {
      const source = options?.source || DEFAULT_SOURCE;
      const existingStore = this.self.errorsStore;
      let newErrorsStore;

      if (input instanceof Map) {
        newErrorsStore = input;
      } else if (input === null || Object.keys(input).length === 0) {
        newErrorsStore = new Map(existingStore);
        newErrorsStore.delete(source);
      } else {
        newErrorsStore = new Map(existingStore).set(source, input);
      }

      if (isEqual(this.self.errorsStore, newErrorsStore)) return; // We're using `produce()` here because using the standard solid Store
      // nested setter has some bugs (i.e.
      // `setControl('self', 'pendingStore', newPendingStore)`). I think the
      // bugs are isolated to object values, so, at the moment, I'm only using
      // produce where the value is an object.

      setControl(
        produce((state) => {
          state.self.errorsStore = newErrorsStore;
        })
      );
    },

    patchErrors(input, options) {
      const existingStore = this.self.errorsStore;

      if (input instanceof Map) {
        // We're using `produce()` here because using the standard solid Store
        // nested setter has some bugs (i.e.
        // `setControl('self', 'pendingStore', newPendingStore)`). I think the
        // bugs are isolated to object values, so, at the moment, I'm only using
        // produce where the value is an object.
        setControl(
          produce((state) => {
            state.self.errorsStore = new Map([...existingStore, ...input]);
          })
        );
      } else {
        if (Object.keys(input).length === 0) return;
        const source = options?.source || DEFAULT_SOURCE;
        let newErrors = input;
        let existingValue = existingStore.get(source);

        if (existingValue) {
          existingValue = { ...existingValue };

          for (const [k, err] of Object.entries(newErrors)) {
            if (err === null) {
              delete existingValue[k];
            } else {
              existingValue[k] = err;
            }
          }

          newErrors = existingValue;
        } else {
          const entries = Object.entries(newErrors).filter(([, v]) => v !== null);
          if (entries.length === 0) return;
          newErrors = Object.fromEntries(entries);
        }

        const newErrorsStore = new Map(existingStore);

        if (Object.keys(newErrors).length === 0) {
          newErrorsStore.delete(source);
        } else {
          newErrorsStore.set(source, newErrors);
        }

        if (isEqual(this.self.errorsStore, newErrorsStore)) return; // We're using `produce()` here because using the standard solid Store
        // nested setter has some bugs (i.e.
        // `setControl('self', 'pendingStore', newPendingStore)`). I think the
        // bugs are isolated to object values, so, at the moment, I'm only using
        // produce where the value is an object.

        setControl(
          produce((state) => {
            state.self.errorsStore = newErrorsStore;
          })
        );
      }
    },

    setValidators(input, options) {
      const source = options?.source || DEFAULT_SOURCE;
      let newValidatorsStore;

      if (input instanceof Map) {
        newValidatorsStore = new Map(input);
      } else {
        newValidatorsStore = new Map(this.self.validatorStore);
        const newValidator = composeValidators(input);

        if (newValidator) {
          newValidatorsStore.set(source, newValidator);
        } else {
          newValidatorsStore.delete(source);
        }
      }

      if (isEqual(this.self.validatorStore, newValidatorsStore)) return; // We're using `produce()` here because using the standard solid Store
      // nested setter has some bugs (i.e.
      // `setControl('self', 'pendingStore', newPendingStore)`). I think the
      // bugs are isolated to object values, so, at the moment, I'm only using
      // produce where the value is an object.

      setControl(
        produce((state) => {
          state.self.validatorStore = newValidatorsStore;
        })
      );
    },

    setData(key, input) {
      if (isEqual(this.data[key], input)) return; // We're using `produce()` here because using the standard solid Store
      // nested setter has some bugs (i.e.
      // `setControl('self', 'pendingStore', newPendingStore)`). I think the
      // bugs are isolated to object values, so, at the moment, I'm only using
      // produce where the value is an object.

      setControl(
        produce((state) => {
          state.data[key] = input;
        })
      );
    },
  };

  const initializer = () => {
    [control, setControl] = store();
    selfIsPendingMemo = createMemo(() => control.self.pendingStore.size > 0);
    selfErrorsMemo = createMemo(() => {
      return control.self.errorsStore.size === 0
        ? null
        : Array.from(control.self.errorsStore.values()).reduce((p, errors) => ({ ...p, ...errors }), {});
    });
    statusMemo = createMemo(() => {
      return control.isDisabled ? "DISABLED" : control.isPending ? "PENDING" : control.isValid ? "VALID" : "INVALID";
    });
    validatorMemo = createMemo(() => {
      if (control.self.validatorStore.size === 0) return null;
      const validators = Array.from(control.self.validatorStore.values());
      return (c) => {
        const e = validators.reduce((err, v) => {
          return { ...err, ...v(c) };
        }, {});
        return Object.keys(e).length === 0 ? null : e;
      };
    }); // Intentionally not using `createRenderEffect()` since it appears to
    // mess with initializing a control with errors (i.e. it clears the errors
    // after the control is initialized)

    createComputed(
      on(
        () => control.validator?.(control.rawValue) ?? null,
        (errors) => {
          if (control.self.errorsStore.get(DEFAULT_SOURCE) === errors) return;
          const newErrorsStore = new Map(control.self.errorsStore);

          if (errors) {
            newErrorsStore.set(DEFAULT_SOURCE, errors);
          } else {
            newErrorsStore.delete(DEFAULT_SOURCE);
          }

          if (isEqual(control.self.errorsStore, newErrorsStore)) return; // We're using `produce()` here because using the standard solid Store
          // nested setter has some bugs (i.e.
          // `setControl('self', 'pendingStore', newPendingStore)`). I think the
          // bugs are isolated to object values, so, at the moment, I'm only using
          // produce where the value is an object.

          setControl(
            produce((state) => {
              state.self.errorsStore = newErrorsStore;
            })
          );
        }
      )
    );
  };

  return [base, initializer];
}

const FormControlInterface = "@@FormControlInterface_solidjs";

/**
 * Returns true if the provided object implements
 * `IFormControl`
 */
function isFormControl(object) {
  return isAbstractControl(object) && object?.[FormControlInterface] === true;
}
function createFormControl(initValue, initOptions = {}) {
  let control;
  let setControl;
  const [untilInit, initComplete] = propInitializer();
  const [base, initializeBase] = createAbstractControlBase(() => [control, setControl], untilInit, initOptions);
  const storeConfig = mergeObj(base, {
    [AbstractControlInterface]: true,
    [FormControlInterface]: true,
    rawValue: initValue,

    get value() {
      return this.rawValue;
    },

    setValue(value) {
      if (isEqual(this.value, value)) return; // We're using `produce()` here because using the standard solid Store
      // nested setter has some bugs (i.e.
      // `setControl('self', 'pendingStore', newPendingStore)`). I think the
      // bugs are isolated to object values, so, at the moment, I'm only using
      // produce where the value could be an object.

      setControl(
        produce((state) => {
          state.rawValue = value;
        })
      );
    },
  });
  [control, setControl] = createStore(storeConfig);
  initializeBase();
  initComplete(); // Intentionally not using `batch()` since it appears to mess with
  // initializing a control with errors

  if (initOptions.disabled) control.markDisabled(initOptions.disabled);
  if (initOptions.touched) control.markTouched(initOptions.touched);
  if (initOptions.dirty) control.markDirty(initOptions.dirty);
  if (initOptions.readonly) control.markReadonly(initOptions.readonly);
  if (initOptions.submitted) control.markSubmitted(initOptions.submitted);
  if (initOptions.required) control.markRequired(initOptions.required);
  if (initOptions.pending) control.markPending(initOptions.pending);
  if (initOptions.validators) control.setValidators(initOptions.validators);
  if (initOptions.pending) control.markPending(initOptions.pending); // this needs to be last to ensure that the errors aren't overwritten

  if (initOptions.errors) control.patchErrors(initOptions.errors);
  return control;
}

function createAbstractControlContainerBase(store, untilInit, initOptions = {}) {
  let control;
  let setControl;
  const [base, initializeAbstractControl] = createAbstractControlBase(() => [control, setControl], untilInit, initOptions);
  let sizeMemo;
  let childIsValidMemo;
  let childIsDisabledMemo;
  let childIsReadonlyMemo;
  let childIsRequiredMemo;
  let childIsPendingMemo;
  let childIsTouchedMemo;
  let childIsDirtyMemo;
  let childIsSubmittedMemo;
  let childrenAreValidMemo;
  let childrenAreDisabledMemo;
  let childrenAreReadonlyMemo;
  let childrenAreRequiredMemo;
  let childrenArePendingMemo;
  let childrenAreTouchedMemo;
  let childrenAreDirtyMemo;
  let childrenAreSubmittedMemo;
  let errorsMemo;
  let childrenErrorsMemo;
  const containerBase = mergeObj(base, {
    get size() {
      return sizeMemo?.() ?? untilInit(0);
    },

    get isDisabled() {
      return this.self.isDisabled || this.children.areDisabled;
    },

    get isTouched() {
      return this.self.isTouched || this.child.isTouched;
    },

    get isDirty() {
      return this.self.isDirty || this.child.isDirty;
    },

    get isReadonly() {
      return this.self.isReadonly || this.children.areReadonly;
    },

    get isSubmitted() {
      return this.self.isSubmitted || this.children.areSubmitted;
    },

    get isRequired() {
      return this.self.isRequired || this.child.isRequired;
    },

    get isPending() {
      return this.self.isPending || this.child.isPending;
    },

    get errors() {
      return errorsMemo?.() ?? untilInit(null);
    },

    get isValid() {
      return this.self.isValid && this.children.areValid;
    },

    child: {
      /** Will return true if *any* `enabled` direct child control is `valid` */
      get isValid() {
        return childIsValidMemo?.() ?? untilInit(true);
      },

      /** Will return true if *any* direct child control is `disabled` */
      get isDisabled() {
        return childIsDisabledMemo?.() ?? untilInit(false);
      },

      /** Will return true if *any* `enabled` direct child control is `readonly` */
      get isReadonly() {
        return childIsReadonlyMemo?.() ?? untilInit(false);
      },

      /** Will return true if *any* `enabled` direct child control is `required` */
      get isRequired() {
        return childIsRequiredMemo?.() ?? untilInit(false);
      },

      /** Will return true if *any* `enabled` direct child control is `pending` */
      get isPending() {
        return childIsPendingMemo?.() ?? untilInit(false);
      },

      /** Will return true if *any* `enabled` direct child control is `touched` */
      get isTouched() {
        return childIsTouchedMemo?.() ?? untilInit(false);
      },

      /** Will return true if *any* `enabled` direct child control is `dirty` */
      get isDirty() {
        return childIsDirtyMemo?.() ?? untilInit(false);
      },

      /** Will return true if *any* `enabled` direct child control is `submitted` */
      get isSubmitted() {
        return childIsSubmittedMemo?.() ?? untilInit(false);
      },
    },
    children: {
      /** Will return true if *all* `enabled` direct child control's are `valid` */
      get areValid() {
        return childrenAreValidMemo?.() ?? untilInit(true);
      },

      /** Will return true if *all* direct child control's are `disabled` */
      get areDisabled() {
        return childrenAreDisabledMemo?.() ?? untilInit(false);
      },

      /** Will return true if *all* `enabled` direct child control's are `readonly` */
      get areReadonly() {
        return childrenAreReadonlyMemo?.() ?? untilInit(false);
      },

      /** Will return true if *all* `enabled` direct child control's are `required` */
      get areRequired() {
        return childrenAreRequiredMemo?.() ?? untilInit(false);
      },

      /** Will return true if *all* `enabled` direct child control's are `pending` */
      get arePending() {
        return childrenArePendingMemo?.() ?? untilInit(false);
      },

      /** Will return true if *all* `enabled` direct child control's are `touched` */
      get areTouched() {
        return childrenAreTouchedMemo?.() ?? untilInit(false);
      },

      /** Will return true if *all* `enabled` direct child control's are `dirty` */
      get areDirty() {
        return childrenAreDirtyMemo?.() ?? untilInit(false);
      },

      /** Will return true if *all* `enabled` direct child control's are `submitted` */
      get areSubmitted() {
        return childrenAreSubmittedMemo?.() ?? untilInit(false);
      },

      /** Contains *all* `enabled` child control errors or `null` if there are none */
      get errors() {
        return childrenErrorsMemo?.() ?? untilInit(null);
      },

      markDirty(value, options) {
        batch(() => {
          Object.values(control.controls).forEach((c) => {
            c.markDirty(value);

            if (!options?.deep || !isAbstractControlContainer(c)) {
              return;
            }

            c.children.markDirty(value, options);
          });
        });
      },

      markDisabled(value, options) {
        batch(() => {
          Object.values(control.controls).forEach((c) => {
            c.markDisabled(value);

            if (!options?.deep || !isAbstractControlContainer(c)) {
              return;
            }

            c.children.markDisabled(value, options);
          });
        });
      },

      markPending(value, options) {
        batch(() => {
          Object.values(control.controls).forEach((c) => {
            c.markPending(value, options);

            if (!options?.deep || !isAbstractControlContainer(c)) {
              return;
            }

            c.children.markPending(value, options);
          });
        });
      },

      markReadonly(value, options) {
        batch(() => {
          Object.values(control.controls).forEach((c) => {
            c.markReadonly(value);

            if (!options?.deep || !isAbstractControlContainer(c)) {
              return;
            }

            c.children.markReadonly(value, options);
          });
        });
      },

      markRequired(value, options) {
        batch(() => {
          Object.values(control.controls).forEach((c) => {
            c.markRequired(value);

            if (!options?.deep || !isAbstractControlContainer(c)) {
              return;
            }

            c.children.markRequired(value, options);
          });
        });
      },

      markSubmitted(value, options) {
        batch(() => {
          Object.values(control.controls).forEach((c) => {
            c.markSubmitted(value);

            if (!options?.deep || !isAbstractControlContainer(c)) {
              return;
            }

            c.children.markSubmitted(value, options);
          });
        });
      },

      markTouched(value, options) {
        batch(() => {
          Object.values(control.controls).forEach((c) => {
            c.markTouched(value);

            if (!options?.deep || !isAbstractControlContainer(c)) {
              return;
            }

            c.children.markTouched(value, options);
          });
        });
      },
    },

    setControls(controls) {
      if (isEqual(control.controls, controls)) return; // We're using `produce()` here because using the standard solid Store
      // nested setter has some bugs (i.e.
      // `setControl('self', 'pendingStore', newPendingStore)`). I think the
      // bugs are isolated to object values, so, at the moment, I'm only using
      // produce where the value is an object.

      setControl(
        produce((state) => {
          state.controls = controls;
        })
      );
    },

    /**
     * The provided control is removed from this FormGroup
     * if it is a child of this FormGroup. Or the control
     * associated with the provided key is removed.
     */
    removeControl(keyOrControl) {
      if (!isAbstractControl(keyOrControl)) {
        control.setControl(keyOrControl, null);
        return;
      }

      const childControl = keyOrControl;

      for (const [key, c] of Object.entries(control.controls)) {
        if (c !== childControl) continue;
        control.setControl(key, null);
        return;
      }
    },

    setValue(value) {
      const valueEntries = Object.entries(value);

      if (valueEntries.length !== control.size) {
        throw new Error(`setValue error: you must provide a value for each control.`);
      }

      batch(() => {
        for (const [key, val] of valueEntries) {
          const c = control.controls[key];

          if (!c) {
            throw new Error(`Invalid setValue value key "${key}".`);
          }

          c.setValue(val);
        }
      });
    },

    patchValue(value) {
      batch(() => {
        for (const [key, entryValue] of Object.entries(value)) {
          const c = control.controls[key];

          if (!c) {
            throw new Error(`Invalid patchValue value key "${key}".`);
          }

          if (isAbstractControlContainer(c)) {
            c.patchValue(entryValue);
          } else {
            c.setValue(entryValue);
          }
        }
      });
    },
  });

  const initializer = () => {
    [control, setControl] = store();
    initializeAbstractControl();
    const allControlsMemo = createMemo(() => Object.values(control.controls));
    const nonDisabledControlsMemo = createMemo(() => allControlsMemo().filter((c) => !c.isDisabled));
    sizeMemo = createMemo(() => allControlsMemo().length);
    childIsValidMemo = createMemo(() => nonDisabledControlsMemo().some((c) => c.isValid));
    childIsDisabledMemo = createMemo(() => allControlsMemo().some((c) => c.isDisabled));
    childIsReadonlyMemo = createMemo(() => nonDisabledControlsMemo().some((c) => c.isReadonly));
    childIsRequiredMemo = createMemo(() => nonDisabledControlsMemo().some((c) => c.isRequired));
    childIsPendingMemo = createMemo(() => nonDisabledControlsMemo().some((c) => c.isPending));
    childIsTouchedMemo = createMemo(() => nonDisabledControlsMemo().some((c) => c.isTouched));
    childIsDirtyMemo = createMemo(() => nonDisabledControlsMemo().some((c) => c.isDirty));
    childIsSubmittedMemo = createMemo(() => nonDisabledControlsMemo().some((c) => c.isSubmitted));
    childrenAreValidMemo = createMemo(() => nonDisabledControlsMemo().every((c) => c.isValid));
    childrenAreDisabledMemo = createMemo(() => {
      const controls = allControlsMemo();
      if (controls.length === 0) return false;
      return controls.every((c) => c.isDisabled);
    });
    childrenAreReadonlyMemo = createMemo(() => {
      const controls = nonDisabledControlsMemo();
      if (controls.length === 0) return false;
      return controls.every((c) => c.isReadonly);
    });
    childrenAreRequiredMemo = createMemo(() => {
      const controls = nonDisabledControlsMemo();
      if (controls.length === 0) return false;
      return controls.every((c) => c.isRequired);
    });
    childrenArePendingMemo = createMemo(() => {
      const controls = nonDisabledControlsMemo();
      if (controls.length === 0) return false;
      return controls.every((c) => c.isPending);
    });
    childrenAreTouchedMemo = createMemo(() => {
      const controls = nonDisabledControlsMemo();
      if (controls.length === 0) return false;
      return controls.every((c) => c.isTouched);
    });
    childrenAreDirtyMemo = createMemo(() => {
      const controls = nonDisabledControlsMemo();
      if (controls.length === 0) return false;
      return controls.every((c) => c.isDirty);
    });
    childrenAreSubmittedMemo = createMemo(() => {
      const controls = nonDisabledControlsMemo();
      if (controls.length === 0) return false;
      return controls.every((c) => c.isSubmitted);
    });
    errorsMemo = createMemo(() => {
      if (!control.self.errors && !control.children.errors) return null;
      return { ...control.children.errors, ...control.self.errors };
    });
    childrenErrorsMemo = createMemo(() => {
      const controls = nonDisabledControlsMemo();
      return controls.reduce((prev, curr) => {
        return prev === null && curr.errors === null ? null : { ...prev, ...curr.errors };
      }, null);
    });
  };

  return [containerBase, initializer];
}

const FormGroupInterface = "@@FormGroupInterface_solidjs";

/**
 * Returns true if the provided object implements
 * `IFormGroup`
 */
function isFormGroup(object) {
  return isAbstractControlContainer(object) && object?.[FormGroupInterface] === true;
}
function createFormGroup(initControls = {}, initOptions = {}) {
  let control;
  let setControl;
  const [untilInit, initComplete] = propInitializer();
  const [base, initializeBase] = createAbstractControlContainerBase(() => [control, setControl], untilInit, initOptions);
  let rawValueMemo;
  let valueMemo;
  const storeConfig = mergeObj(base, {
    [AbstractControlInterface]: true,
    [AbstractControlContainerInterface]: true,
    [FormGroupInterface]: true,
    controls: initControls,

    get rawValue() {
      return rawValueMemo?.() ?? untilInit({});
    },

    get value() {
      return valueMemo?.() ?? untilInit({});
    },

    setControl(key, newControl) {
      if (newControl === null ? !control.controls[key] : isEqual(control.controls[key], newControl)) {
        return;
      }

      setControl(
        produce((state) => {
          if (newControl === null) {
            delete state.controls[key];
          } else {
            state.controls[key] = newControl;
          }
        })
      );
    },
  });
  [control, setControl] = createStore(storeConfig);
  initializeBase();
  const allControlEntriesMemo = createMemo(() => Object.entries(control.controls));
  const enabledControlEntriesMemo = createMemo(() => allControlEntriesMemo().filter(([, c]) => !c.isDisabled));
  rawValueMemo = createMemo(() => Object.fromEntries(allControlEntriesMemo().map(([k, c]) => [k, c.rawValue])));
  valueMemo = createMemo(() => Object.fromEntries(enabledControlEntriesMemo().map(([k, c]) => [k, c.value])));
  initComplete(); // Intentionally not using `batch()` since it appears to mess with
  // initializing a control with errors

  if (initOptions.disabled) control.markDisabled(initOptions.disabled);
  if (initOptions.touched) control.markTouched(initOptions.touched);
  if (initOptions.dirty) control.markDirty(initOptions.dirty);
  if (initOptions.readonly) control.markReadonly(initOptions.readonly);
  if (initOptions.submitted) control.markSubmitted(initOptions.submitted);
  if (initOptions.required) control.markRequired(initOptions.required);
  if (initOptions.pending) control.markPending(initOptions.pending);
  if (initOptions.validators) control.setValidators(initOptions.validators);
  if (initOptions.pending) control.markPending(initOptions.pending); // this needs to be last to ensure that the errors aren't overwritten

  if (initOptions.errors) control.patchErrors(initOptions.errors);
  return control;
}

const FormArrayInterface = "@@FormArrayInterface_solidjs";

/**
 * Returns true if the provided object implements
 * `IFormArray`
 */
function isFormArray(object) {
  return isAbstractControlContainer(object) && object?.[FormArrayInterface] === true;
}
function createFormArray(initControls = [], initOptions = {}) {
  let control;
  let setControl;
  const [untilInit, initComplete] = propInitializer();
  const [base, initializeBase] = createAbstractControlContainerBase(() => [control, setControl], untilInit, initOptions);
  let rawValueMemo;
  let valueMemo;
  const storeConfig = mergeObj(base, {
    [AbstractControlInterface]: true,
    [AbstractControlContainerInterface]: true,
    [FormArrayInterface]: true,
    controls: initControls,

    get rawValue() {
      return rawValueMemo?.() ?? untilInit({});
    },

    get value() {
      return valueMemo?.() ?? untilInit({});
    },

    setControl(key, newControl) {
      if (newControl === null ? !control.controls[key] : isEqual(control.controls[key], newControl)) {
        return;
      }

      setControl(
        produce((state) => {
          if (newControl === null) {
            state.controls.splice(key, 1);
          } else {
            state.controls[key] = newControl;
          }
        })
      );
    },

    push(control) {
      this.setControl(this.controls.length, control);
    },
  });
  [control, setControl] = createStore(storeConfig);
  initializeBase();
  const enabledControlsMemo = createMemo(() => control.controls.filter((c) => !c.isDisabled));
  rawValueMemo = createMemo(() => control.controls.map((c) => c.rawValue));
  valueMemo = createMemo(() => enabledControlsMemo().map((c) => c.value));
  initComplete(); // Intentionally not using `batch()` since it appears to mess with
  // initializing a control with errors

  if (initOptions.disabled) control.markDisabled(initOptions.disabled);
  if (initOptions.touched) control.markTouched(initOptions.touched);
  if (initOptions.dirty) control.markDirty(initOptions.dirty);
  if (initOptions.readonly) control.markReadonly(initOptions.readonly);
  if (initOptions.submitted) control.markSubmitted(initOptions.submitted);
  if (initOptions.required) control.markRequired(initOptions.required);
  if (initOptions.pending) control.markPending(initOptions.pending);
  if (initOptions.validators) control.setValidators(initOptions.validators);
  if (initOptions.pending) control.markPending(initOptions.pending); // this needs to be last to ensure that the errors aren't overwritten

  if (initOptions.errors) control.patchErrors(initOptions.errors);
  return control;
}

export {
  AbstractControlContainerInterface,
  AbstractControlInterface,
  bindOwner,
  composeValidators,
  createAbstractControlBase,
  createAbstractControlContainerBase,
  createFormArray,
  createFormControl,
  createFormGroup,
  DEFAULT_SOURCE,
  FormArrayInterface,
  FormControlInterface,
  FormGroupInterface,
  isAbstractControl,
  isAbstractControlContainer,
  isFormArray,
  isFormControl,
  isFormGroup,
};
