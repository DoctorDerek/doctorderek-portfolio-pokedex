import type { FormEvent } from "react"
import { useFormContext } from "react-hook-form"
import {
  ALL_POKEMON_TYPES_VALUE,
  DEFAULT_POKEMON_CATALOG_FILTERS,
  type PokemonCatalogFilters,
} from "@/utils/pokemonCatalog"

const CONTROL_CLASS_NAME =
  "min-h-11 w-full rounded-md border-2 border-gray-600 bg-gray-900 px-3 text-white"

export default function PokemonCatalogControls({
  pokemonTypes,
}: {
  pokemonTypes: ReadonlyArray<string>
}) {
  const { register, reset } = useFormContext<PokemonCatalogFilters>()

  const handleCatalogSearchSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }
  const handleCatalogFiltersReset = () => {
    reset(DEFAULT_POKEMON_CATALOG_FILTERS)
  }

  return (
    <form
      role="search"
      aria-label="Pokémon catalog discovery"
      onSubmit={handleCatalogSearchSubmission}
      className="space-y-3 border-b border-gray-700 p-3 md:p-4"
    >
      <div>
        <label htmlFor="pokemon-search" className="mb-1 block font-bold">
          Search Pokémon
        </label>
        <input
          {...register("search")}
          id="pokemon-search"
          type="search"
          autoComplete="off"
          placeholder="e.g. “Pikachu” or “#025”"
          className={CONTROL_CLASS_NAME}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="pokemon-type" className="mb-1 block font-bold">
            Type
          </label>
          <select
            {...register("type")}
            id="pokemon-type"
            className={CONTROL_CLASS_NAME}
          >
            <option value={ALL_POKEMON_TYPES_VALUE}>All types</option>
            {pokemonTypes.map((pokemonType) => (
              <option key={pokemonType} value={pokemonType}>
                {pokemonType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pokemon-sort" className="mb-1 block font-bold">
            Sort
          </label>
          <select
            {...register("sort")}
            id="pokemon-sort"
            className={CONTROL_CLASS_NAME}
          >
            <option value="nationalNumber">National number</option>
            <option value="name">Name A–Z</option>
            <option value="baseStatTotal">Base stats: high–low</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCatalogFiltersReset}
        className="min-h-11 rounded-md border-2 border-gray-600 px-3 font-bold hover:border-yellow-400 hover:bg-gray-700 hover:text-yellow-400 motion-safe:transition-colors motion-safe:duration-150"
      >
        Reset filters
      </button>
    </form>
  )
}
