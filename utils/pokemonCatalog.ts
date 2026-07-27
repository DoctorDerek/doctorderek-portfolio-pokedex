import type { PokemonCatalogEntry } from "@/types/pokemon"

export { MAX_POKEMON_NUMBER } from "@/data/pokemonCatalog"

export const ALL_POKEMON_TYPES_VALUE = "all"
export const POKEMON_CATALOG_CONTEXT_RADIUS = 10
export const POKEMON_CATALOG_EXPANSION_SIZE = 20

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

export interface PokemonCatalogRange {
  endIndex: number
  startIndex: number
}

export type PokemonCatalogExpansionDirection = "after" | "before" | "both"

export const DEFAULT_POKEMON_CATALOG_FILTERS: PokemonCatalogFilters = {
  search: "",
  sort: "nationalNumber",
  type: ALL_POKEMON_TYPES_VALUE,
}

export function hasActivePokemonCatalogDiscovery({
  filters,
}: {
  filters: PokemonCatalogFilters
}) {
  return (
    filters.search.trim().length > 0 ||
    filters.sort !== DEFAULT_POKEMON_CATALOG_FILTERS.sort ||
    filters.type !== DEFAULT_POKEMON_CATALOG_FILTERS.type
  )
}

export function getContextualPokemonCatalogEntries({
  currentPokemonId,
  pokemons,
}: {
  currentPokemonId: number
  pokemons: ReadonlyArray<PokemonCatalogEntry>
}) {
  const contextualRange = getContextualPokemonCatalogRange({
    currentPokemonId,
    pokemons,
  })

  return getPokemonCatalogEntriesInRange({
    pokemons,
    range: contextualRange,
  })
}

export function getContextualPokemonCatalogRange({
  currentPokemonId,
  pokemons,
}: {
  currentPokemonId: number
  pokemons: ReadonlyArray<PokemonCatalogEntry>
}): PokemonCatalogRange {
  const contextualCatalogSize = POKEMON_CATALOG_CONTEXT_RADIUS * 2 + 1
  const currentPokemonIndex = pokemons.findIndex(
    ({ id }) => id === currentPokemonId,
  )
  const maximumWindowStartIndex = Math.max(
    pokemons.length - contextualCatalogSize,
    0,
  )
  const windowStartIndex = Math.min(
    Math.max(currentPokemonIndex - POKEMON_CATALOG_CONTEXT_RADIUS, 0),
    maximumWindowStartIndex,
  )

  return {
    endIndex: Math.min(
      windowStartIndex + contextualCatalogSize,
      pokemons.length,
    ),
    startIndex: windowStartIndex,
  }
}

export function expandPokemonCatalogRange({
  direction,
  pokemonCount,
  range,
}: {
  direction: PokemonCatalogExpansionDirection
  pokemonCount: number
  range: PokemonCatalogRange
}): PokemonCatalogRange {
  return {
    endIndex:
      direction === "before"
        ? range.endIndex
        : Math.min(
            range.endIndex + POKEMON_CATALOG_EXPANSION_SIZE,
            pokemonCount,
          ),
    startIndex:
      direction === "after"
        ? range.startIndex
        : Math.max(range.startIndex - POKEMON_CATALOG_EXPANSION_SIZE, 0),
  }
}

export function getPokemonCatalogEntriesInRange({
  pokemons,
  range,
}: {
  pokemons: ReadonlyArray<PokemonCatalogEntry>
  range: PokemonCatalogRange
}) {
  return pokemons.slice(range.startIndex, range.endIndex)
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
