import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin } from "@solidjs/vite-plugin-nitro-2";
import { defineConfig, loadEnv } from "vite";

const DEFAULT_POSTHOG_HOST = "https://eu.i.posthog.com";
const DEFAULT_POSTHOG_PATH = "/api/insights";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // PostHog is reached through the same-origin prefix the client is configured with
  // (VITE_PUBLIC_POSTHOG_HOST, default "/api/insights"), so requests survive ad blockers.
  // Both the dev proxy below and the nitro route rule need the real host.
  const posthogHost = (env.POSTHOG_HOST ?? DEFAULT_POSTHOG_HOST).replace(/\/+$/, "");
  if (!env.POSTHOG_HOST) {
    console.warn(`[vite] POSTHOG_HOST is not set, falling back to ${DEFAULT_POSTHOG_HOST}`);
  }
  const posthogPath = env.VITE_PUBLIC_POSTHOG_HOST?.replace(/\/+$/, "") || DEFAULT_POSTHOG_PATH;

  return {
    plugins: [
      solidStart(),
      nitroV2Plugin({
        compatibilityDate: "2026-04-16",
        preset: env.NITRO_PRESET,
        // ships with the build, so the proxy works in production and not just in `vite dev`
        routeRules: {
          [`${posthogPath}/**`]: { proxy: `${posthogHost}/**` },
        },
      }),
    ],
    server: {
      proxy: {
        [posthogPath]: {
          target: posthogHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${posthogPath}`), ""),
        },
      },
    },
  };
});
