import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";


export default tseslint.config({
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
      globals: {
          ...globals.node,
          ...globals.jest
      },
      parser: tseslint.parser,
    },
  }
);