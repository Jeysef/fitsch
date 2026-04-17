import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin } from "@solidjs/vite-plugin-nitro-2";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      solidStart(),
      nitroV2Plugin({
        compatibilityDate: "2026-04-16",
        preset: env.NITRO_PRESET,
      }),
    ],
    server: {
      proxy: {
        "/api/insights": {
          target: "https://eu.i.posthog.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/insights/, ""),
        },
      },
    },
  };
});
