import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals"; // Додаємо бібліотеку глобальних змінних

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Це дозволить використовувати document, window, alert тощо
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
    },
  },
];