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
        reactQueryVersion: 5,
        useTypeImports: true,
      },
    },
  },
  hooks: {
    afterOneFileWrite: ["prettier --write"],
  },
}

export default config
