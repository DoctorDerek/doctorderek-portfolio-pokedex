import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql-pokemon2.vercel.app/",
  documents: "graphql/**/*.graphql",
  generates: {
    "./graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        fetcher: "@/utils/fetchPokemonApi#pokemonApiQueryFetcher",
        reactQueryVersion: 5,
        useTypeImports: false,
      },
    },
  },
  hooks: {
    afterOneFileWrite: ["prettier --write"],
  },
}

export default config
