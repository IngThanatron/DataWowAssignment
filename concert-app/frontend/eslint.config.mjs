import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // 1. Add your rule overrides here
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // 2. Global ignores (keep these at the end or wherever you prefer)
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
