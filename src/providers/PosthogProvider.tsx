import { makeTimer } from "@solid-primitives/timer";
import { children, createSignal, lazy, onMount, Show, Suspense, type FlowProps } from "solid-js";
import { isDev, isServer } from "solid-js/web";

const LazyClientProvider = lazy(() => import("~/components/PostHogClientProvider"));

export function PostHogProvider(props: FlowProps) {
  const resolved = children(() => props.children);
  if (isServer || isDev) return resolved();

  const [shouldLoad, setShouldLoad] = createSignal(false);

  onMount(() => makeTimer(() => setShouldLoad(true), 2000, setTimeout));

  return (
    <Show when={shouldLoad()} fallback={resolved()}>
      <Suspense fallback={resolved()}>
        <LazyClientProvider>{resolved()}</LazyClientProvider>
      </Suspense>
    </Show>
  );
}

export default PostHogProvider;
