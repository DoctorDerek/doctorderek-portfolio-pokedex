import gitignore from "eslint-config-flat-gitignore"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"

const eslintConfig = [
  gitignore(),
  ...nextCoreWebVitals,
  eslintConfigPrettier,
  {
    plugins: {
      "only-warn": onlyWarn,
    },
  },
]

export default eslintConfig
