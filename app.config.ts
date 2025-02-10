import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    routeRules: {
      "/test/**": { cache: { maxAge: 10, staleMaxAge: 20, swr: true, name: "test-api-cache" } },
    },
  },
});
