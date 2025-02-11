import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    plugins: ["./src/plugins/cache.ts"],
  },
});
