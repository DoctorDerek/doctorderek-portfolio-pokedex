import type { SubmitHandler } from "react-hook-form"
import { useFormContext } from "react-hook-form"
import type { PokemonSearchGenerationOption } from "@/utils/pokemonSearch"
import {
  ALL_POKEMON_SEARCH_VALUES,
  DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS,
  POKEMON_SEARCH_LIMIT_OPTIONS,
  type PokemonGraphqlSearchFilters,
} from "@/utils/pokemonSearch"

const SEARCH_CONTROL_CLASS_NAME =
  "min-h-11 w-full rounded-md border-2 border-gray-600 bg-gray-950 px-3 text-white"
const MAXIMUM_BASE_EXPERIENCE_FILTER = 1_000

export default function PokemonGraphqlSearchForm({
  generations,
  isSearching,
  onReset,
  onSubmit,
  pokemonTypes,
}: {
  generations: ReadonlyArray<PokemonSearchGenerationOption>
  isSearching: boolean
  onReset: () => void
  onSubmit: SubmitHandler<PokemonGraphqlSearchFilters>
  pokemonTypes: ReadonlyArray<string>
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useFormContext<PokemonGraphqlSearchFilters>()
  const handleResearchReset = () => {
    reset(DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS)
    onReset()
  }

  return (
    <form
      role="search"
      aria-label="GraphQL Pokémon research search"
      className="space-y-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="graphql-pokemon-name"
            className="mb-1 block font-bold"
          >
            Pokémon name
          </label>
          <input
            {...register("name")}
            id="graphql-pokemon-name"
            type="search"
            autoComplete="off"
            placeholder="e.g. “Mr. Mime”"
            className={SEARCH_CONTROL_CLASS_NAME}
          />
        </div>

        <div>
          <label
            htmlFor="graphql-pokemon-type"
            className="mb-1 block font-bold"
          >
            Type
          </label>
          <select
            {...register("type")}
            id="graphql-pokemon-type"
            className={SEARCH_CONTROL_CLASS_NAME}
          >
            <option value={ALL_POKEMON_SEARCH_VALUES}>All types</option>
            {pokemonTypes.map((pokemonType) => (
              <option key={pokemonType} value={pokemonType}>
                {pokemonType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="graphql-pokemon-generation"
            className="mb-1 block font-bold"
          >
            Debut generation
          </label>
          <select
            {...register("generation")}
            id="graphql-pokemon-generation"
            className={SEARCH_CONTROL_CLASS_NAME}
          >
            <option value={ALL_POKEMON_SEARCH_VALUES}>All generations</option>
            {generations.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="graphql-pokemon-legendary"
            className="mb-1 block font-bold"
          >
            Legendary
          </label>
          <select
            {...register("isLegendary")}
            id="graphql-pokemon-legendary"
            className={SEARCH_CONTROL_CLASS_NAME}
          >
            <option value="all">Either</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="graphql-pokemon-mythical"
            className="mb-1 block font-bold"
          >
            Mythical
          </label>
          <select
            {...register("isMythical")}
            id="graphql-pokemon-mythical"
            className={SEARCH_CONTROL_CLASS_NAME}
          >
            <option value="all">Either</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="graphql-pokemon-experience"
            className="mb-1 block font-bold"
          >
            Minimum base experience
          </label>
          <input
            {...register("minimumBaseExperience", {
              max: {
                message: `Enter ${MAXIMUM_BASE_EXPERIENCE_FILTER.toLocaleString("en-US")} or less.`,
                value: MAXIMUM_BASE_EXPERIENCE_FILTER,
              },
              min: { message: "Enter 0 or more.", value: 0 },
              required: "Enter a minimum base experience.",
              valueAsNumber: true,
            })}
            id="graphql-pokemon-experience"
            type="number"
            min="0"
            max={MAXIMUM_BASE_EXPERIENCE_FILTER}
            aria-describedby={
              errors.minimumBaseExperience
                ? "graphql-pokemon-experience-error"
                : undefined
            }
            aria-invalid={Boolean(errors.minimumBaseExperience)}
            className={SEARCH_CONTROL_CLASS_NAME}
          />
          {errors.minimumBaseExperience ? (
            <p
              id="graphql-pokemon-experience-error"
              role="alert"
              className="mt-1 text-red-300"
            >
              {errors.minimumBaseExperience.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="graphql-pokemon-sort"
            className="mb-1 block font-bold"
          >
            Server sort
          </label>
          <select
            {...register("sort")}
            id="graphql-pokemon-sort"
            className={SEARCH_CONTROL_CLASS_NAME}
          >
            <option value="nationalNumber">National number</option>
            <option value="name">Name A–Z</option>
            <option value="baseExperience">Base experience: high–low</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="graphql-pokemon-limit"
            className="mb-1 block font-bold"
          >
            Result limit
          </label>
          <select
            {...register("limit", { valueAsNumber: true })}
            id="graphql-pokemon-limit"
            className={SEARCH_CONTROL_CLASS_NAME}
          >
            {POKEMON_SEARCH_LIMIT_OPTIONS.map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSearching}
          className="min-h-11 rounded-md bg-yellow-400 px-4 font-bold text-gray-950 hover:bg-yellow-300 disabled:cursor-wait disabled:bg-gray-500 motion-safe:transition-colors motion-safe:duration-150"
        >
          {isSearching ? "Searching GraphQL…" : "GraphQL Search"}
        </button>
        <button
          type="button"
          onClick={handleResearchReset}
          className="min-h-11 rounded-md border-2 border-gray-600 px-4 font-bold hover:border-yellow-400 hover:bg-gray-700 hover:text-yellow-400 motion-safe:transition-colors motion-safe:duration-150"
        >
          Reset research
        </button>
      </div>
    </form>
  )
}
