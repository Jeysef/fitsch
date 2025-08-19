import { defineConfig } from "@solidjs/start/config";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  vite: {
    plugins: [visualizer({ open: true, gzipSize: true, template: "sunburst" })],
  },
  server: {
    plugins: ["./src/plugins/cache.ts"],
  },
});
