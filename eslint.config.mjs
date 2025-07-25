import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import pluginNext from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint"; // includes plugin, parser, configs

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // Basic Next.js + TS base configuration via FlatCompat
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Layer to add custom rule overrides
  {
    files: ["**/*.{ts,tsx}"],

    rules: {
      // Replace base rule with TS-aware rule
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // Explicitly allow empty object type if needed
      "@typescript-eslint/no-empty-object-type": "off",

      // Unescaped entities in JSX: optional to disable if majority of warnings
      "react/no-unescaped-entities": "off",
    },
  },

  // Include the Next.js plugin and its rules explicitly (if compat extends didn't already)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs["core-web-vitals"]?.rules,
    },
  },
];

export default eslintConfig;
