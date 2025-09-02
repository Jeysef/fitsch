import { defineConfig } from "@solidjs/start/config";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  vite: {
    plugins: [visualizer({ open: true, gzipSize: true })],
  },
  server: {
    compatibilityDate: "2025-08-20",
    plugins: ["./src/plugins/cache.ts"],
    routeRules: {
      "/api/insights/**": {
        proxy: "https://eu.i.posthog.com/**",
      },
    },
  },
});
