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
    "tailwind.config.cjs",
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
