import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

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

      "arrow-parens": [2, "as-needed"],
      "curly": [1, "all"],
      "no-unused-vars": 0,
      "@typescript-eslint/no-unused-vars": 2,
      "@typescript-eslint/no-explicit-any": 2,
      "@typescript-eslint/explicit-member-accessibility": 2,
      "@typescript-eslint/no-unnecessary-type-assertion": 2,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: true
        }
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-inline"],
      "@typescript-eslint/consistent-type-exports": "error",

      // 相対パスインポート禁止: @hinagata/core/* を使う
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./", "../"],
              message: "Use @hinagata/core/* instead of relative imports"
            }
          ]
        }
      ],

      "import/order": [
        "error",
        {
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            {
              pattern: "@hinagata/core/**",
              group: "internal",
              position: "after"
            }
          ]
        }
      ],

      "import/no-duplicates": 2,
      "import/no-unresolved": 0,
      "import/extensions": 0
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
