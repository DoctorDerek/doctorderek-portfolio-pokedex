import type { Linter } from "eslint"
import gitignore from "eslint-config-flat-gitignore"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"

/**
 * ONE-TIME EXCEPTION TO NO CODE COMMENT RULE:
 * typescript-eslint (v8.63.0) is broken with TypeScript 7 (v7.0.2)
 * TODO Restore typescript-eslint rules as soon as possible!!
 * */

const eslintConfig: Linter.Config[] = [
  gitignore(),
  ...nextCoreWebVitals,
  eslintConfigPrettier,
  {
    plugins: {
      "only-warn": onlyWarn,
    },
  },
  {
    ignores: ["utils/authMachine.typegen.ts", "jest.config.js", "**/*.ts", "**/*.tsx"],
  },
]

export default eslintConfig
