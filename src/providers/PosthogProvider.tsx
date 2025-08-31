import posthog from "posthog-js";
import type { FlowProps } from "solid-js";
import { isServer } from "solid-js/web";
import { env } from "~/env/client";
import { PostHogProvider as PHProvider } from "~/lib/posthog";

export function PostHogProvider({ children }: FlowProps) {
  if (isServer) return children;
  posthog.init(env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: "/api/insights", // proxy
    defaults: "2025-05-24",
    person_profiles: "always",
  });

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export default PostHogProvider;
