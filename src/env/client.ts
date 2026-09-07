"use client";
import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_PUBLIC_POSTHOG_KEY: v.pipe(v.string(), v.minLength(1)),
    /** same-origin prefix PostHog requests are sent to, proxied to the real PostHog host (see vite.config.ts) */
    VITE_PUBLIC_POSTHOG_HOST: v.optional(v.pipe(v.string(), v.minLength(1)), "/api/insights"),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
