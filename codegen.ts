import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "./graphql/pokeapi.generated.ts": {
      schema: "https://graphql.pokeapi.co/v1beta2",
      documents: "graphql/pokeapi.graphql",
      plugins: ["typescript-operations"],
      config: {
        useTypeImports: true,
      },
    },
    "./graphql/pokemonSearch.generated.ts": {
      schema: "https://graphql.pokeapi.co/v1beta2",
      documents: "graphql/pokemonSearch.graphql",
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
