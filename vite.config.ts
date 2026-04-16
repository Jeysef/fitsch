import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin } from "@solidjs/vite-plugin-nitro-2";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      solidStart(),
      nitroV2Plugin({
        plugins: ["./src/plugins/cache.ts"],
        compatibilityDate: "2026-04-16",
        routeRules: {
          "/api/insights/**": {
            proxy: "https://eu.i.posthog.com/**",
          },
        },
        preset: env.NITRO_PRESET,
      }),
    ],
  };
});
