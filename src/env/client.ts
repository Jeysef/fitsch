"use client";
import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_PUBLIC_POSTHOG_KEY: v.pipe(v.string(), v.minLength(1)),
    VITE_PUBLIC_POSTHOG_HOST: v.pipe(v.string(), v.minLength(1)),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
