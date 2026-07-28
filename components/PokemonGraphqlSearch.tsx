"use client"

import { useState } from "react"
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form"
import PokemonGraphqlSearchForm from "@/components/PokemonGraphqlSearchForm"
import PokemonGraphqlSearchResults, {
  type PokemonGraphqlSearchResultsState,
} from "@/components/PokemonGraphqlSearchResults"
import { POKEDEX_WORKSPACE_SECTION_IDS } from "@/data/pokedexWorkspace"
import { POKEMON_CATALOG } from "@/data/pokemonCatalog"
import {
  useAdvancedPokemonSearchQuery,
  type AdvancedPokemonSearchQueryVariables,
  type PokemonSearchResultFragment,
} from "@/graphql/pokemonSearch.generated"
import { getPokemonCatalogTypes } from "@/utils/pokemonCatalog"
import {
  DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS,
  getPokemonSearchGenerationOptions,
  getPokemonSearchResults,
  normalizePokemonSearchVariables,
  type PokemonGraphqlSearchFilters,
} from "@/utils/pokemonSearch"

const SEARCH_CACHE_RETENTION_MILLISECONDS = 30 * 60 * 1_000
const DEFAULT_POKEMON_SEARCH_VARIABLES = normalizePokemonSearchVariables(
  DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS,
)

interface SubmittedPokemonSearch {
  filters: PokemonGraphqlSearchFilters
  signature: string
  variables: AdvancedPokemonSearchQueryVariables
}

export default function PokemonGraphqlSearch() {
  const graphqlSearchForm = useForm<PokemonGraphqlSearchFilters>({
    defaultValues: DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS,
  })
  const [submittedSearch, setSubmittedSearch] =
    useState<SubmittedPokemonSearch | null>(null)
  const activeSearch = submittedSearch ?? {
    filters: DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS,
    signature: "",
    variables: DEFAULT_POKEMON_SEARCH_VARIABLES,
  }
  const pokemonSearchQuery = useAdvancedPokemonSearchQuery<
    ReadonlyArray<PokemonSearchResultFragment>,
    Error
  >(activeSearch.variables, {
    enabled: submittedSearch !== null,
    gcTime: SEARCH_CACHE_RETENTION_MILLISECONDS,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    select: (data) => getPokemonSearchResults(data, activeSearch.filters.sort),
    staleTime: Infinity,
  })
  const handleResearchSubmission: SubmitHandler<PokemonGraphqlSearchFilters> = (
    filters,
  ) => {
    const variables = normalizePokemonSearchVariables(filters)
    const signature = JSON.stringify(variables)

    if (signature === submittedSearch?.signature) {
      if (pokemonSearchQuery.isError) void pokemonSearchQuery.refetch()

      return
    }

    setSubmittedSearch({ filters, signature, variables })
  }
  const handleResearchReset = () => {
    setSubmittedSearch(null)
  }
  const resultsState = getPokemonSearchResultsState({
    error: pokemonSearchQuery.error,
    isError: pokemonSearchQuery.isError,
    isPending: pokemonSearchQuery.isPending,
    pokemons: pokemonSearchQuery.data,
    submittedSearch,
  })

  return (
    <section
      id={POKEDEX_WORKSPACE_SECTION_IDS.graphqlSearch}
      aria-labelledby="graphql-search-heading"
      tabIndex={-1}
      className="shadow-elevated border-outline bg-surface-elevated w-full scroll-mt-20 rounded-lg border-2 p-4 sm:p-6"
    >
      <div className="mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="graphql-search-heading" className="text-2xl font-bold">
            GraphQL Search
          </h2>
          <span className="border-info text-info rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase">
            One bounded request
          </span>
        </div>
        <p className="text-muted mt-2 max-w-3xl">
          Run one bounded PokéAPI GraphQL query. Catalog filters stay local and
          make no network requests.
        </p>
      </div>

      <FormProvider {...graphqlSearchForm}>
        <PokemonGraphqlSearchForm
          generations={getPokemonSearchGenerationOptions()}
          isSearching={pokemonSearchQuery.isFetching}
          onReset={handleResearchReset}
          onSubmit={handleResearchSubmission}
          pokemonTypes={getPokemonCatalogTypes({ pokemons: POKEMON_CATALOG })}
        />
      </FormProvider>

      <div className="border-outline mt-5 border-t pt-5">
        <PokemonGraphqlSearchResults state={resultsState} />
      </div>
    </section>
  )
}

function getPokemonSearchResultsState({
  error,
  isError,
  isPending,
  pokemons,
  submittedSearch,
}: {
  error: Error | null
  isError: boolean
  isPending: boolean
  pokemons: ReadonlyArray<PokemonSearchResultFragment> | undefined
  submittedSearch: SubmittedPokemonSearch | null
}): PokemonGraphqlSearchResultsState {
  if (!submittedSearch) return { status: "idle" }
  if (isPending) return { status: "loading" }
  if (isError)
    return {
      message: error?.message ?? "The research service rejected the request.",
      status: "error",
    }

  return { pokemons: pokemons ?? [], status: "success" }
}
