import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import { sharedRules } from "../../eslint.shared.mjs";

export default [
  {
    ignores: ["lib/**", "node_modules/**", "src/index.ts"]
  },
  {
    files: ["src/**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      },
      globals: {
        ...globals.node
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...sharedRules,
      "no-shadow": 1,
      "no-param-reassign": 1,
      "import/no-extraneous-dependencies": 0,
      "import/order": [
        "error",
        {
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            { pattern: "@hinagata-next/core/common/**", group: "internal", position: "after" },
            { pattern: "@hinagata-next/core/feature/**", group: "internal", position: "after" },
            { pattern: "~/common/**", group: "internal", position: "after" },
            { pattern: "~/feature/**", group: "internal", position: "after" }
          ]
        }
      ]
    }
  },

  // common 層から feature 層の import を禁止
  {
    files: ["src/common/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["./", "../"] },
            { group: ["~/feature/**"], message: "common から feature は import 不可。" }
          ]
        }
      ]
    }
  },

  eslintConfigPrettier
];
