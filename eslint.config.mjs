import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node, // Suporte a variáveis globais do Node.js
      sourceType: "commonjs",
    },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "eqeqeq": "error",
      "curly": "error",
      "semi": ["error", "always"],
      "no-process-exit": "warn",
      "no-async-promise-executor": "warn",
      "no-console": isProduction ? "error" : "off", // Bloqueia console.log apenas em produção
    },
  },
]);


