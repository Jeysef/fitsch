"use client";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_PUBLIC_POSTHOG_KEY: z.string().min(1),
    VITE_PUBLIC_POSTHOG_HOST: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
