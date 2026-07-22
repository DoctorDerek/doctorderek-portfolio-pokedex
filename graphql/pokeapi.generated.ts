/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
export type PokedexSnapshotQueryVariables = Exact<{
  pokemonCount: number
}>

export type PokedexSnapshotQuery = {
  pokemon: Array<{
    id: number
    name: string
    height: number | null
    weight: number | null
    base_experience: number | null
    pokemon_species_id: number | null
    pokemonabilities: Array<{
      is_hidden: boolean
      ability: { name: string } | null
    }>
    pokemonstats: Array<{ base_stat: number; stat: { name: string } | null }>
    pokemontypes: Array<{ type: { name: string } | null }>
    pokemonspecy: {
      id: number
      base_happiness: number | null
      capture_rate: number | null
      is_legendary: boolean
      is_mythical: boolean
      generation: { name: string } | null
      pokemoncolor: { name: string } | null
      pokemonhabitat: { name: string } | null
      pokemonshape: { name: string } | null
      pokemonspeciesnames: Array<{ genus: string; name: string }>
    } | null
  }>
  pokemonspecies_aggregate: { aggregate: { count: number } | null }
}
