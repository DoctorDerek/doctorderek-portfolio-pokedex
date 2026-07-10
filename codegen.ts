// @ts-expect-error - The package has broken type exports in moduleResolution: bundler
import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql-pokemon2.vercel.app/",
  documents: "**/*.tsx",
  generates: {
    "./graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        fetcher: "fetch",
      },
    },
  },
}

export default config
