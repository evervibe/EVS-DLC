module.exports = {
  root: true,
  ignorePatterns: ["node_modules", "dist", ".next", "coverage"],
  plugins: ["react", "react-hooks", "import"],
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended", "plugin:import/recommended", "prettier"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended", "prettier"],
      rules: { "@typescript-eslint/no-explicit-any": "warn" }
    },
    {
      files: ["tools/apps/dlc-web-admin/**"],
      extends: ["next/core-web-vitals"]
    }
  ]
};
