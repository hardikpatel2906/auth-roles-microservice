import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,    // ✅ fixes process, __dirname, __filename
      }
    },
    rules: {
      "no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_"
      }],   // ✅ warn instead of error
      "no-console": "off",        // ✅ allow console.log in Node apps
    }
  },
  {
    // ignore test/migration files
    ignores: [
      "testRedis.js",
      "migrations/**"
    ]
  }
];