import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "./graphql/generated.ts": {
      schema: "https://graphql-pokemon2.vercel.app/",
      documents: "graphql/pokedex.graphql",
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
    "./graphql/pokeapi.generated.ts": {
      schema: "https://graphql.pokeapi.co/v1beta2",
      documents: "graphql/pokeapi.graphql",
      plugins: ["typescript-operations"],
      config: {
        useTypeImports: true,
      },
    },
  },
  hooks: {
    afterOneFileWrite: ["prettier --write"],
  },
}

export default config
