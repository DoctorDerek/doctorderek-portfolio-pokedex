import type { PokemonCatalogEntryFragment } from "@/graphql/generated"

export const INITIAL_POKEMON_CATALOG_SIZE = 20
export const MAX_POKEMON_NUMBER = 151
export const ALL_POKEMON_TYPES_VALUE = "all"

export const POKEMON_CATALOG_SORT_OPTIONS = [
  "nationalNumber",
  "name",
  "maximumCombatPower",
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

export function compactPokemonCatalogEntries({
  pokemons,
}: {
  pokemons: ReadonlyArray<PokemonCatalogEntryFragment | null> | null
}) {
  return (
    pokemons?.filter(
      (pokemon): pokemon is PokemonCatalogEntryFragment => pokemon !== null,
    ) ?? []
  )
}

export function includeSelectedPokemon({
  pokemons,
  selectedPokemon,
}: {
  pokemons: ReadonlyArray<PokemonCatalogEntryFragment>
  selectedPokemon: PokemonCatalogEntryFragment
}) {
  if (pokemons.some((pokemon) => pokemon.id === selectedPokemon.id))
    return [...pokemons]

  return [...pokemons, selectedPokemon]
}

export function getPokemonCatalogTypes({
  pokemons,
}: {
  pokemons: ReadonlyArray<PokemonCatalogEntryFragment>
}) {
  const pokemonTypes = pokemons.flatMap(
    (pokemon) =>
      pokemon.types?.filter((type): type is string => type !== null) ?? [],
  )

  return [...new Set(pokemonTypes)].sort((firstType, secondType) =>
    firstType.localeCompare(secondType),
  )
}

export function getVisiblePokemonCatalogEntries({
  filters,
  pokemons,
}: {
  filters: PokemonCatalogFilters
  pokemons: ReadonlyArray<PokemonCatalogEntryFragment>
}) {
  const normalizedSearch = filters.search
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
  const matchingPokemons = pokemons.filter((pokemon) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      pokemon.name?.toLowerCase().includes(normalizedSearch) ||
      pokemon.number?.includes(normalizedSearch)
    const matchesType =
      filters.type === ALL_POKEMON_TYPES_VALUE ||
      pokemon.types?.includes(filters.type)

    return Boolean(matchesSearch && matchesType)
  })

  return matchingPokemons.toSorted((firstPokemon, secondPokemon) => {
    if (filters.sort === "name")
      return comparePokemonNames(firstPokemon, secondPokemon)
    if (filters.sort === "maximumCombatPower")
      return comparePokemonCombatPower(firstPokemon, secondPokemon)

    return comparePokemonNumbers(firstPokemon, secondPokemon)
  })
}

function comparePokemonNames(
  firstPokemon: PokemonCatalogEntryFragment,
  secondPokemon: PokemonCatalogEntryFragment,
) {
  const nameComparison = (firstPokemon.name ?? "").localeCompare(
    secondPokemon.name ?? "",
  )

  return nameComparison || comparePokemonNumbers(firstPokemon, secondPokemon)
}

function comparePokemonCombatPower(
  firstPokemon: PokemonCatalogEntryFragment,
  secondPokemon: PokemonCatalogEntryFragment,
) {
  const combatPowerComparison =
    (secondPokemon.maxCP ?? -1) - (firstPokemon.maxCP ?? -1)

  return (
    combatPowerComparison || comparePokemonNumbers(firstPokemon, secondPokemon)
  )
}

function comparePokemonNumbers(
  firstPokemon: PokemonCatalogEntryFragment,
  secondPokemon: PokemonCatalogEntryFragment,
) {
  const firstPokemonNumber = firstPokemon.number
    ? Number(firstPokemon.number)
    : Number.MAX_SAFE_INTEGER
  const secondPokemonNumber = secondPokemon.number
    ? Number(secondPokemon.number)
    : Number.MAX_SAFE_INTEGER

  return firstPokemonNumber - secondPokemonNumber
}
