import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettierConfig, 
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // React 17+ में जरूरी नहीं
      "react/prop-types": "off", // PropTypes use नहीं कर रहे
      "react-hooks/rules-of-hooks": "error", // Hooks rules enforce
      "react-hooks/exhaustive-deps": "warn", // Dependency array check
      "jsx-a11y/anchor-is-valid": "warn", // Accessibility checks
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
