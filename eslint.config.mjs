import html from "@html-eslint/eslint-plugin"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
  {
    ...html.configs["flat/recommended"],
    files: ["**/*.wxml", "**/*.html"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.vscode/**",
      "**/idea/**",
      "**/*.log",
      "**/*.DS_Store",
    ],
    rules: {
      ...html.configs["flat/recommended"].rules, // Must be defined. If not, all recommended rules will be lost
      "@html-eslint/indent": ["error", 2],
      "@html-eslint/require-closing-tags": ["warn", { selfClosingCustomPatterns: [""] }],
    },
  },
  eslintConfigPrettier,
]
