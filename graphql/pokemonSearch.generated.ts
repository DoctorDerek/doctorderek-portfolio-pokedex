/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
export type AdvancedPokemonSearchQueryVariables = Exact<{
  namePattern: string
  typePattern: string
  generationPattern: string
  legendaryStatuses: Array<boolean> | boolean
  mythicalStatuses: Array<boolean> | boolean
  minimumBaseExperience: number
  limit: number
  orderByNumber: boolean
  orderByName: boolean
  orderByBaseExperience: boolean
}>

export type AdvancedPokemonSearchQuery = {
  byNumber?: Array<{
    base_experience: number | null
    id: number
    name: string
    pokemonspecy: {
      is_legendary: boolean
      is_mythical: boolean
      generation: { name: string } | null
      pokemonspeciesnames: Array<{ name: string }>
    } | null
    pokemontypes: Array<{ type: { name: string } | null }>
  }>
  byName?: Array<{
    base_experience: number | null
    id: number
    name: string
    pokemonspecy: {
      is_legendary: boolean
      is_mythical: boolean
      generation: { name: string } | null
      pokemonspeciesnames: Array<{ name: string }>
    } | null
    pokemontypes: Array<{ type: { name: string } | null }>
  }>
  byBaseExperience?: Array<{
    base_experience: number | null
    id: number
    name: string
    pokemonspecy: {
      is_legendary: boolean
      is_mythical: boolean
      generation: { name: string } | null
      pokemonspeciesnames: Array<{ name: string }>
    } | null
    pokemontypes: Array<{ type: { name: string } | null }>
  }>
}

export type PokemonSearchResultFragment = {
  base_experience: number | null
  id: number
  name: string
  pokemonspecy: {
    is_legendary: boolean
    is_mythical: boolean
    generation: { name: string } | null
    pokemonspeciesnames: Array<{ name: string }>
  } | null
  pokemontypes: Array<{ type: { name: string } | null }>
}
