import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // eslint-config-next already registers the jsx-a11y plugin, so only the
    // recommended rule set is layered on here.
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
    ".lighthouseci/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
