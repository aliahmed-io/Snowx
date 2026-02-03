import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".vercel/**",
    "node_modules/**",
  ]),
  // Custom rule overrides
  {
    rules: {
      // Downgrade set-state-in-effect to warning - pattern is valid for close-on-route-change
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
