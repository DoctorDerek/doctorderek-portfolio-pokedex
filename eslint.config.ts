import gitignore from "eslint-config-flat-gitignore"
import nextConfig from "eslint-config-next"
import nextTypeScript from "eslint-config-next/typescript"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import { defineConfig } from "eslint/config"
import "eslint-plugin-only-warn"

/**
 * ONE-TIME EXCEPTION TO NO CODE COMMENT RULE:
 * typescript-eslint (v8.63.0) is broken with TypeScript 7 (v7.0.2)
 * until TS 7 releases an API (planned for v7.1.0+)
 * TODO Upgrade to TS 7 when the version is >7.1.0 and typescript-eslint is working with TS7
 * */

const eslintConfig = defineConfig([
  gitignore(),
  ...nextConfig,
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [nextTypeScript],
  },
  {
    name: "pokedex/generated-search-metadata",
    files: ["graphql/pokemonSearch.generated.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  eslintConfigPrettier,
])

export default eslintConfig
