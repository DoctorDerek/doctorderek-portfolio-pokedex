import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"

const eslintConfig = [
  ...nextCoreWebVitals,
  eslintConfigPrettier,
  {
    plugins: {
      "only-warn": onlyWarn,
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
    ],
  },
]

export default eslintConfig
