// @ts-check

import path from "path";
import { fileURLToPath } from "url";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import { FlatCompat } from "@eslint/eslintrc";
import hooksPlugin from "eslint-plugin-react-hooks";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";

// https://github.com/import-js/eslint-plugin-import/issues/2556
// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  {
    ignores: [
      ".next/**/*",
      ".vercel/**/*",
      "node_modules/**/*",
      "dist/**/*",
      ".rollup.cache/**/*",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...compat.plugins("import"),
  prettierConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      // ensure consistant imports
      "import/order": "error",
      // conflicts with the the smarter tsc version
      "@typescript-eslint/no-unused-vars": "off",
      // prevent enums
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "Don't declare enums",
        },
      ],
    },
  },
  {
    files: ["**/*.spec.ts"],
    rules: {
      // any is ok in test files
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: {
      "react-hooks": hooksPlugin,
    },
    // @ts-expect-error not typed correctly
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  }
);
