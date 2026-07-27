"use client"

import { FormProvider, useForm, useWatch } from "react-hook-form"
import PokemonCatalogControls from "@/components/PokemonCatalogControls"
import PokemonCatalogList from "@/components/PokemonCatalogList"
import { POKEDEX_WORKSPACE_SECTION_IDS } from "@/data/pokedexWorkspace"
import { MAX_POKEMON_NUMBER, POKEMON_CATALOG } from "@/data/pokemonCatalog"
import {
  DEFAULT_POKEMON_CATALOG_FILTERS,
  getContextualPokemonCatalogEntries,
  getPokemonCatalogTypes,
  getVisiblePokemonCatalogEntries,
  hasActivePokemonCatalogDiscovery,
  type PokemonCatalogFilters,
} from "@/utils/pokemonCatalog"

const POKEMON_COUNT_FORMATTER = new Intl.NumberFormat("en-US")

export default function PokemonCatalog({
  currentPokemonId,
}: {
  currentPokemonId: number
}) {
  const catalogForm = useForm<PokemonCatalogFilters>({
    defaultValues: DEFAULT_POKEMON_CATALOG_FILTERS,
  })
  const filters: PokemonCatalogFilters = {
    search: useWatch({
      control: catalogForm.control,
      defaultValue: DEFAULT_POKEMON_CATALOG_FILTERS.search,
      name: "search",
    }),
    sort: useWatch({
      control: catalogForm.control,
      defaultValue: DEFAULT_POKEMON_CATALOG_FILTERS.sort,
      name: "sort",
    }),
    type: useWatch({
      control: catalogForm.control,
      defaultValue: DEFAULT_POKEMON_CATALOG_FILTERS.type,
      name: "type",
    }),
  }
  const pokemonTypes = getPokemonCatalogTypes({ pokemons: POKEMON_CATALOG })
  const matchingPokemons = getVisiblePokemonCatalogEntries({
    filters,
    pokemons: POKEMON_CATALOG,
  })
  const hasActiveDiscovery = hasActivePokemonCatalogDiscovery({ filters })
  const visiblePokemons = hasActiveDiscovery
    ? matchingPokemons
    : getContextualPokemonCatalogEntries({
        currentPokemonId,
        pokemons: matchingPokemons,
      })

  return (
    <FormProvider {...catalogForm}>
      <section
        id={POKEDEX_WORKSPACE_SECTION_IDS.localPokedex}
        aria-labelledby="local-pokedex-heading"
        tabIndex={-1}
        className="relative order-2 flex w-full scroll-mt-20 flex-col bg-surface text-sm md:order-1 md:min-h-0"
      >
        <div className="border-b border-outline px-3 py-3 md:px-4">
          <h2 id="local-pokedex-heading" className="text-xl font-bold">
            Local Pokédex
          </h2>
          <p className="mt-1 text-muted">
            Filter the complete prefetched catalog without another data request.
          </p>
        </div>
        <PokemonCatalogControls pokemonTypes={pokemonTypes} />
        <div className="border-b border-outline px-3 py-2 md:px-4">
          <p role="status" aria-live="polite">
            {hasActiveDiscovery
              ? `${POKEMON_COUNT_FORMATTER.format(visiblePokemons.length)} matches`
              : `${visiblePokemons.length} nearby initially`}{" "}
            · {POKEMON_COUNT_FORMATTER.format(MAX_POKEMON_NUMBER)} ready
            locally.
          </p>
        </div>
        <PokemonCatalogList
          currentPokemonId={currentPokemonId}
          pokemons={hasActiveDiscovery ? visiblePokemons : matchingPokemons}
          progressivelyReveal={!hasActiveDiscovery}
        />
      </section>
    </FormProvider>
  )
}
