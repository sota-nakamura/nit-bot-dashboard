import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import pluginVue from "eslint-plugin-vue";

export default defineConfig([
    {
        ignores: ["dist/**"],
    },
    ...pluginVue.configs["flat/base"],
    {
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "prefer-const": "error",
            "@stylistic/semi": ["error", "always"],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/indent": ["error", 4, { SwitchCase: 1 }],
            "vue/html-indent": ["error", 4],
            "vue/html-quotes": ["error", "double"],
        },
    },
]);
