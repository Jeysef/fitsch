import type { JSX, Ref } from "solid-js";

export type ComponentWithRefType<T> = JSX.HTMLAttributes<T> & { ref?: Ref<T> }