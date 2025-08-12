// @ts-check

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores([
    "dist",
    ".wrangler",
    ".output",
    ".vercel",
    ".netlify",
    ".vinxi",
    "app.config.timestamp_*.js",
    ".env",
    ".env*.local",
    "/node_modules",
    "/.idea",
    ".project",
    ".classpath",
    "*.launch",
    ".settings/",
    "gitignore",
    ".DS_Store",
    "Thumbs.db",
    "src/paraglide/",
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
);
