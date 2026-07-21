"use client"

import { FormProvider, useForm, useWatch } from "react-hook-form"
import PokemonCatalogControls from "@/components/PokemonCatalogControls"
import PokemonCatalogList from "@/components/PokemonCatalogList"
import { MAX_POKEMON_NUMBER, POKEMON_CATALOG } from "@/data/pokemonCatalog"
import {
  DEFAULT_POKEMON_CATALOG_FILTERS,
  getPokemonCatalogTypes,
  getVisiblePokemonCatalogEntries,
  type PokemonCatalogFilters,
} from "@/utils/pokemonCatalog"

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
  const visiblePokemons = getVisiblePokemonCatalogEntries({
    filters,
    pokemons: POKEMON_CATALOG,
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
            {MAX_POKEMON_NUMBER} Pokémon ready · {visiblePokemons.length} shown.
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
