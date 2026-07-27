import { MAX_POKEMON_NUMBER, POKEMON_CATALOG } from "@/data/pokemonCatalog"
import type {
  AdvancedPokemonSearchQuery,
  AdvancedPokemonSearchQueryVariables,
  PokemonSearchResultFragment,
} from "@/graphql/pokemonSearch.generated"

export const ALL_POKEMON_SEARCH_VALUES = "all"
export const POKEMON_SEARCH_LIMIT_OPTIONS = [10, 20, 50, 100] as const
export const POKEMON_SEARCH_SORT_OPTIONS = [
  "nationalNumber",
  "name",
  "baseExperience",
] as const
export const POKEMON_SEARCH_BOOLEAN_OPTIONS = ["all", "yes", "no"] as const

export type PokemonSearchLimit = (typeof POKEMON_SEARCH_LIMIT_OPTIONS)[number]
export type PokemonSearchSortOption =
  (typeof POKEMON_SEARCH_SORT_OPTIONS)[number]
export type PokemonSearchBooleanOption =
  (typeof POKEMON_SEARCH_BOOLEAN_OPTIONS)[number]

export interface PokemonGraphqlSearchFilters {
  generation: string
  isLegendary: PokemonSearchBooleanOption
  isMythical: PokemonSearchBooleanOption
  limit: PokemonSearchLimit
  minimumBaseExperience: number
  name: string
  sort: PokemonSearchSortOption
  type: string
}

export interface PokemonSearchGenerationOption {
  label: string
  value: string
}

export const DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS: PokemonGraphqlSearchFilters =
  {
    generation: ALL_POKEMON_SEARCH_VALUES,
    isLegendary: "all",
    isMythical: "all",
    limit: 20,
    minimumBaseExperience: 0,
    name: "",
    sort: "nationalNumber",
    type: ALL_POKEMON_SEARCH_VALUES,
  }

export function getPokemonSearchGenerationOptions() {
  return [
    ...new Map(
      POKEMON_CATALOG.map(({ generation }) => [
        generation,
        {
          label: generation,
          value: generation.toLowerCase().replace(" ", "-"),
        },
      ]),
    ).values(),
  ]
}

export function normalizePokemonSearchVariables(
  filters: PokemonGraphqlSearchFilters,
): AdvancedPokemonSearchQueryVariables {
  const canonicalPokemonSlug = findCanonicalPokemonSlug(filters.name)

  return {
    generationPattern: toGraphqlPattern(filters.generation),
    legendaryStatuses: toGraphqlBooleanStatuses(filters.isLegendary),
    limit: filters.limit,
    maximumPokemonId: MAX_POKEMON_NUMBER,
    minimumBaseExperience: filters.minimumBaseExperience,
    mythicalStatuses: toGraphqlBooleanStatuses(filters.isMythical),
    namePattern: toGraphqlPattern(
      canonicalPokemonSlug ?? normalizePokemonIdentifier(filters.name),
    ),
    orderByBaseExperience: filters.sort === "baseExperience",
    orderByName: filters.sort === "name",
    orderByNumber: filters.sort === "nationalNumber",
    typePattern: toGraphqlPattern(filters.type.toLowerCase()),
  }
}

export function getPokemonSearchResults(
  data: AdvancedPokemonSearchQuery,
  sort: PokemonSearchSortOption,
): ReadonlyArray<PokemonSearchResultFragment> {
  const results =
    sort === "name"
      ? data.byName
      : sort === "baseExperience"
        ? data.byBaseExperience
        : data.byNumber

  if (!results)
    throw new Error("The GraphQL service omitted the requested result order.")

  return results
}

function findCanonicalPokemonSlug(name: string) {
  const normalizedName = name.trim().toLocaleLowerCase("en-US")

  return POKEMON_CATALOG.find(
    (pokemon) => pokemon.name.toLocaleLowerCase("en-US") === normalizedName,
  )?.slug
}

function normalizePokemonIdentifier(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("en-US")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[.’':]/gu, "")
    .replace(/\s+/gu, "-")
}

function toGraphqlPattern(value: string) {
  return value === ALL_POKEMON_SEARCH_VALUES || value.length === 0
    ? "%"
    : `%${value}%`
}

function toGraphqlBooleanStatuses(value: PokemonSearchBooleanOption) {
  if (value === "yes") return [true]
  if (value === "no") return [false]

  return [true, false]
}
