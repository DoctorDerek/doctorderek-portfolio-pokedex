import PokemonCatalogList from "@/components/PokemonCatalogList"
import {
  usePokemonCatalogQuery,
  type PokemonCatalogEntryFragment,
} from "@/graphql/generated"
import {
  compactPokemonCatalogEntries,
  MAX_POKEMON_NUMBER,
  POKEMON_CATALOG_RETRY_COUNT,
  POKEMON_CATALOG_RETRY_DELAY_MS,
  POKEMON_CATALOG_STALE_TIME_MS,
} from "@/utils/pokemonCatalog"

export default function PokemonCatalog({
  currentPokemonNumber,
  initialPokemons,
}: {
  currentPokemonNumber: string
  initialPokemons: ReadonlyArray<PokemonCatalogEntryFragment>
}) {
  const { data, isError, isFetching, refetch } = usePokemonCatalogQuery(
    { first: MAX_POKEMON_NUMBER },
    {
      initialData: { pokemons: [...initialPokemons] },
      initialDataUpdatedAt: 0,
      retry: POKEMON_CATALOG_RETRY_COUNT,
      retryDelay: POKEMON_CATALOG_RETRY_DELAY_MS,
      staleTime: POKEMON_CATALOG_STALE_TIME_MS,
    },
  )
  const pokemons = compactPokemonCatalogEntries({
    pokemons: data?.pokemons ?? initialPokemons,
  })

  const handleCatalogRetry = () => {
    void refetch()
  }

  return (
    <div
      className="relative flex w-full flex-col bg-gray-800 text-sm md:min-h-0"
      aria-busy={isFetching}
    >
      <div className="border-b border-gray-700 px-3 py-2 md:px-4">
        {isError ? (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-2"
          >
            <p>
              Couldn’t finish loading all {MAX_POKEMON_NUMBER} Pokémon. Showing{" "}
              {pokemons.length} ready.
            </p>
            <button
              type="button"
              onClick={handleCatalogRetry}
              className="min-h-11 rounded-md border-2 border-yellow-400 px-3 font-bold text-yellow-400 hover:bg-gray-700 motion-safe:transition-colors motion-safe:duration-150"
            >
              Retry
            </button>
          </div>
        ) : (
          <p role="status" aria-live="polite">
            {pokemons.length} of {MAX_POKEMON_NUMBER} Pokémon ready.
          </p>
        )}
      </div>
      <PokemonCatalogList
        currentPokemonNumber={currentPokemonNumber}
        pokemons={pokemons}
      />
    </div>
  )
}
