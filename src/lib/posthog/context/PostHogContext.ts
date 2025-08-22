import posthogJs from "posthog-js";
import { createContext, type Accessor } from "solid-js";

export type PostHog = typeof posthogJs;

export const PostHogContext = createContext<{ client: Accessor<PostHog> }>({ client: () => posthogJs });
