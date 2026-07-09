import type { Linter } from "eslint"
import gitignore from "eslint-config-flat-gitignore"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import { type ESLint } from "eslint"

/**
 * ONE-TIME EXCEPTION TO NO CODE COMMENT RULE:
 * typescript-eslint (v8.63.0) is broken with TypeScript 7 (v7.0.2)
 * until TS 7 releases an API (planned for v7.1.0+)
 * TODO Upgrade to TS 7 when the version is >7.1.0 and typescript-eslint is working with TS7
 * */

const eslintConfig: Linter.Config[] = [
  gitignore(),
  ...nextCoreWebVitals,
  eslintConfigPrettier,
  {
    plugins: {
      "only-warn": onlyWarn as unknown as ESLint.Plugin,
    },
  },
  {
    ignores: ["utils/authMachine.typegen.ts", "jest.config.js"],
  },
]

export default eslintConfig
