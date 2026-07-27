export const POKEDEX_WORKSPACE_SECTION_IDS = {
  dossier: "pokemon-dossier",
  graphqlSearch: "graphql-search",
  localPokedex: "local-pokedex",
} as const

export const POKEDEX_WORKSPACE_NAVIGATION_ITEMS = [
  {
    id: POKEDEX_WORKSPACE_SECTION_IDS.dossier,
    label: "Dossier",
  },
  {
    id: POKEDEX_WORKSPACE_SECTION_IDS.localPokedex,
    label: "Local Pokédex",
  },
  {
    id: POKEDEX_WORKSPACE_SECTION_IDS.graphqlSearch,
    label: "GraphQL Search",
  },
] as const
