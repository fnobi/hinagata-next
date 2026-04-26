import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextConfig from "eslint-config-next";
import strictDepsPlugin from "eslint-plugin-strict-dependencies";
import globals from "globals";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "scripts/**",
      "**/*.min.js",
      "next.config.ts",
      "jest.config.js",
      "next-env.d.ts"
    ]
  },

  // next (flat config native): includes react, react-hooks, import, jsx-a11y, typescript-eslint
  ...nextConfig,

  // prettier: turns off formatting rules only, no plugin side effects
  ...compat.extends("prettier"),

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
      "arrow-parens": [2, "as-needed"],
      "curly": [1, "all"],
      "no-unused-vars": 0,
      "@next/next/no-page-custom-font": 0,
      "@next/next/no-img-element": 0,
      "@typescript-eslint/explicit-member-accessibility": 2,
      "@typescript-eslint/no-unnecessary-type-assertion": 2,
      "@typescript-eslint/no-explicit-any": 2,
      "@typescript-eslint/no-unused-vars": 2,
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
      "react/jsx-filename-extension": [
        1,
        { extensions: [".js", ".jsx", ".tsx"] }
      ],
      "react-hooks/rules-of-hooks": 2,
      "react-hooks/exhaustive-deps": 2,
      "import/no-duplicates": 0,
      "import/no-unresolved": 0,
      "import/extensions": 0,
      "import/order": [
        "error",
        {
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            { pattern: "~/common/**", group: "internal", position: "after" },
            { pattern: "~/features/**", group: "internal", position: "after" },
            { pattern: "~/assets/**", group: "internal", position: "after" }
          ]
        }
      ],
      "no-restricted-imports": ["error", { patterns: ["./", "../"] }],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            { from: "src/features/**/*", target: "src/common/**/*" },
            { from: "src/**/components/**/*", target: "src/**/schema/**/*" }
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
            module: "react",
            allowReferenceFrom: ["src/**/!(schema)/**/*"],
            allowSameModule: false
          },
          {
            module: "src/assets",
            allowReferenceFrom: [
              "src/features/!(schema)/**/*",
              "src/pages/**/*"
            ],
            allowSameModule: false
          },
          {
            module: "src/features/lib/database",
            allowReferenceFrom: [
              "src/pages/**/*",
              "src/features/components/**/_provider/*"
            ],
            allowSameModule: true
          },
          {
            module: "src/lib/ClientDataStoreAgent",
            allowReferenceFrom: ["src/features/lib/database/**/*"],
            allowSameModule: false
          }
        ]
      ],
      "no-undef": 1,
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

  // schema: 型定義とそのユーティリティのみ。サーバー・クライアント両環境で動くコードに限定する
  {
    files: ["src/**/schema/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "react/*"],
              message: "schema files must be runtime-agnostic (no React)"
            },
            {
              group: ["@emotion/*"],
              message: "schema files must be runtime-agnostic (no emotion)"
            },
            {
              group: ["next", "next/*"],
              message: "schema files must be runtime-agnostic (no Next.js)"
            }
          ]
        }
      ]
    }
  }
];
