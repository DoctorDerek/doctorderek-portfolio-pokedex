import type { PokemonCatalogEntry } from "@/types/pokemon"

export { MAX_POKEMON_NUMBER } from "@/data/pokemonCatalog"

export const INITIAL_POKEMON_CATALOG_SIZE = 20
export const ALL_POKEMON_TYPES_VALUE = "all"

export const POKEMON_CATALOG_SORT_OPTIONS = [
  "nationalNumber",
  "name",
  "baseStatTotal",
] as const

export type PokemonCatalogSortOption =
  (typeof POKEMON_CATALOG_SORT_OPTIONS)[number]

export interface PokemonCatalogFilters {
  search: string
  sort: PokemonCatalogSortOption
  type: string
}

export const DEFAULT_POKEMON_CATALOG_FILTERS: PokemonCatalogFilters = {
  search: "",
  sort: "nationalNumber",
  type: ALL_POKEMON_TYPES_VALUE,
}

export function getPokemonCatalogTypes({
  pokemons,
}: {
  pokemons: ReadonlyArray<PokemonCatalogEntry>
}) {
  const pokemonTypes = pokemons.flatMap(({ types }) => types)

  return [...new Set(pokemonTypes)].sort((firstType, secondType) =>
    firstType.localeCompare(secondType),
  )
}

export function getVisiblePokemonCatalogEntries({
  filters,
  pokemons,
}: {
  filters: PokemonCatalogFilters
  pokemons: ReadonlyArray<PokemonCatalogEntry>
}) {
  const normalizedSearch = filters.search.trim().toLowerCase().replace(/^#/, "")
  const matchingPokemons = pokemons.filter((pokemon) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      pokemon.name.toLowerCase().includes(normalizedSearch) ||
      pokemon.number.includes(normalizedSearch)
    const matchesType =
      filters.type === ALL_POKEMON_TYPES_VALUE ||
      pokemon.types.includes(filters.type)

    return Boolean(matchesSearch && matchesType)
  })

  return matchingPokemons.toSorted((firstPokemon, secondPokemon) => {
    if (filters.sort === "name")
      return comparePokemonNames(firstPokemon, secondPokemon)
    if (filters.sort === "baseStatTotal")
      return comparePokemonBaseStatTotals(firstPokemon, secondPokemon)

    return comparePokemonNumbers(firstPokemon, secondPokemon)
  })
}

function comparePokemonNames(
  firstPokemon: PokemonCatalogEntry,
  secondPokemon: PokemonCatalogEntry,
) {
  const nameComparison = firstPokemon.name.localeCompare(secondPokemon.name)

  return nameComparison || comparePokemonNumbers(firstPokemon, secondPokemon)
}

function comparePokemonBaseStatTotals(
  firstPokemon: PokemonCatalogEntry,
  secondPokemon: PokemonCatalogEntry,
) {
  const baseStatTotalComparison =
    secondPokemon.baseStatTotal - firstPokemon.baseStatTotal

  return (
    baseStatTotalComparison ||
    comparePokemonNumbers(firstPokemon, secondPokemon)
  )
}

function comparePokemonNumbers(
  firstPokemon: PokemonCatalogEntry,
  secondPokemon: PokemonCatalogEntry,
) {
  return firstPokemon.id - secondPokemon.id
}
