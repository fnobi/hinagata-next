/**
 * @hinagata/core と @hinagata/web で共通するESLintルール
 * 各パッケージの eslint.config.mjs で spread して使う
 */
export const sharedRules = {
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
  "@typescript-eslint/consistent-type-exports": "error",

  "import/consistent-type-specifier-style": ["error", "prefer-inline"],
  "import/no-duplicates": 2,
  "import/no-unresolved": 0,
  "import/extensions": 0,

  "no-restricted-imports": ["error", { patterns: ["./", "../"] }]
};
