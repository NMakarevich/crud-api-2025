import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default tseslint.config({
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { eslint, tseslint },
    extends: [
        tseslint.configs.recommended,
        eslint.configs.recommended
    ],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error"
    },
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
    }
  }
);