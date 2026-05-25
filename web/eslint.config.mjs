import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import strictDepsPlugin from "eslint-plugin-strict-dependencies";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import { sharedRules } from "../eslint.shared.mjs";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "scripts/**",
      "**/*.min.js",
      "next.config.ts",
      "jest.config.js",
      "next-env.d.ts"
    ]
  },

  // プラグイン・パーサー・共通設定
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": tseslint
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module" },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: {
      react: { version: "detect" },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".mts", ".cts", ".tsx", ".d.ts"]
      },
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] }
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": "off"
    }
  },

  eslintConfigPrettier,

  // project-specific TypeScript rules
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "strict-dependencies": strictDepsPlugin
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json"
      },
      globals: {
        ...globals.browser,
        ...globals.jest
      }
    },
    rules: {
      ...sharedRules,

      "react/jsx-filename-extension": [
        1,
        { extensions: [".js", ".jsx", ".tsx"] }
      ],
      "react-hooks/rules-of-hooks": 2,
      "react-hooks/exhaustive-deps": 2,
      "import/order": [
        "error",
        {
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            { pattern: "@hinagata/core/common/**", group: "internal", position: "after" },
            { pattern: "~/common/**", group: "internal", position: "after" },
            { pattern: "@hinagata/core/features/**", group: "internal", position: "after" },
            { pattern: "~/features/**", group: "internal", position: "after" },
            { pattern: "~/assets/**", group: "internal", position: "after" }
          ]
        }
      ],
      "strict-dependencies/strict-dependencies": [
        "error",
        [
          {
            module: "@emotion/styled",
            allowReferenceFrom: [
              "src/(features|common)/components/*",
              "src/features/components/**/!(_provider)/*"
            ],
            allowSameModule: false
          },
          {
            module: "./src/assets",
            allowReferenceFrom: [
              "src/features/**/*",
              "src/app/**/*"
            ],
            allowSameModule: false
          },
          {
            module: "./src/features",
            allowReferenceFrom: [
              "src/features/**/*",
              "src/app/**/*"
            ],
            allowSameModule: true
          },
          {
            module: "./src/common/lib/ClientDataStoreAgent",
            allowReferenceFrom: [
              "src/common/lib/**/*",
              "src/app/**/*",
              "src/features/components/**/_provider/**/*"
            ],
            allowSameModule: false
          }
        ]
      ],
      "no-undef": 1,
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/no-array-index-key": 0,
      "react/require-default-props": [1, { ignoreFunctionalComponents: true }],
      "react/function-component-definition": [
        2,
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function"
        }
      ],
      "jsx-a11y/label-has-associated-control": [2, { assert: "either" }],
      "jsx-a11y/label-has-for": 0,
      "import/prefer-default-export": 1,
      "import/no-extraneous-dependencies": 1,
      "react/no-unescaped-entities": 0,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": 0,
      "no-shadow": 1,
      "no-param-reassign": 1,
      "import/no-anonymous-default-export": 0
    }
  },

];
