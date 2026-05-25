import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import { sharedRules } from "./eslint.shared.mjs";

export default [
  {
    ignores: ["node_modules/**", "web/**", "jest.config.js"]
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
        project: "./tsconfig.json"
      },
      globals: {
        ...globals.node
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...sharedRules
    }
  },

  {
    files: ["src/**/*.spec.ts", "src/**/__tests__/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      // テストファイルは相対インポートを許可（テスト対象ファイルへの直接参照）
      "no-restricted-imports": "off"
    }
  }
];
