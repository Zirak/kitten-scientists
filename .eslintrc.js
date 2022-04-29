module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  extends: ["eslint:recommended"],
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parserOptions: {
        project: ["./tsconfig.json"],
        sourceType: "module",
      },
      rules: {
        "@typescript-eslint/no-explicit-any": [
          "error",
          {
            ignoreRestArgs: true,
          },
        ],
        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  rules: {
    "no-implied-eval": "off",
    "no-unused-expressions": "warn",
    quotes: "warn",
  },
  ignorePatterns: ["build/", "output/"],
};
