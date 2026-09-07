import posthog from "posthog-js";
import { children, createSignal, onMount, Show, type FlowProps } from "solid-js";
import { env } from "~/env/client";
import { PostHogProvider as PHProvider } from "~/lib/posthog";

// This is the component that will be lazy-loaded.
export function PostHogClientProvider(props: FlowProps) {
  const [client, setClient] = createSignal<typeof posthog | null>(null);

  onMount(() => {
    if (!posthog.__loaded) {
      posthog.init(env.VITE_PUBLIC_POSTHOG_KEY, {
        api_host: env.VITE_PUBLIC_POSTHOG_HOST,
        // the deployed host is a subdomain of a public suffix (e.g. *.netlify.app),
        // so writing the cookie for the parent domain is rejected by browsers
        cross_subdomain_cookie: false,
        defaults: "2025-05-24",
        person_profiles: "always",
      });
    }
    setClient(posthog);
  });

  const resolved = children(() => props.children);

  return (
    <Show when={client()} fallback={resolved()}>
      {(ph) => <PHProvider client={ph()}>{resolved()}</PHProvider>}
    </Show>
  );
}

export default PostHogClientProvider;
