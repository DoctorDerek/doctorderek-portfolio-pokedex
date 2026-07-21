"use client"

import { FormProvider, useForm, useWatch } from "react-hook-form"
import PokemonCatalogControls from "@/components/PokemonCatalogControls"
import PokemonCatalogList from "@/components/PokemonCatalogList"
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
        aria-label="Pokémon discovery"
        className="relative order-2 flex w-full flex-col bg-gray-800 text-sm md:order-1 md:min-h-0"
      >
        <PokemonCatalogControls pokemonTypes={pokemonTypes} />
        <div className="border-b border-gray-700 px-3 py-2 md:px-4">
          <p role="status" aria-live="polite">
            {hasActiveDiscovery
              ? `${POKEMON_COUNT_FORMATTER.format(visiblePokemons.length)} matches`
              : `${visiblePokemons.length} nearby Pokémon`}{" "}
            · {POKEMON_COUNT_FORMATTER.format(MAX_POKEMON_NUMBER)} ready.
          </p>
        </div>
        <PokemonCatalogList
          currentPokemonId={currentPokemonId}
          pokemons={visiblePokemons}
        />
      </section>
    </FormProvider>
  )
}
