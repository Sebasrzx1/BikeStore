import pluginReact from "eslint-plugin-react";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },

    plugins: {
      react: pluginReact,
      "jsx-a11y": jsxA11y,
    },

    rules: {
      ...pluginReact.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
    },
  },

  // Ignorar archivos
  {
    ignores: ["dist", "node_modules"],
  },
];
