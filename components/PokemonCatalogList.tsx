import PokemonCatalogEntries from "@/components/PokemonCatalogEntries"
import ProgressivePokemonCatalogList from "@/components/ProgressivePokemonCatalogList"
import type { PokemonCatalogEntry } from "@/types/pokemon"

export default function PokemonCatalogList({
  currentPokemonId,
  pokemons,
  progressivelyReveal,
}: {
  currentPokemonId: number
  pokemons: ReadonlyArray<PokemonCatalogEntry>
  progressivelyReveal: boolean
}) {
  if (progressivelyReveal)
    return (
      <ProgressivePokemonCatalogList
        key={currentPokemonId}
        currentPokemonId={currentPokemonId}
        pokemons={pokemons}
      />
    )

  return (
    <nav
      aria-label="Pokémon catalog"
      className="md:min-h-0 md:flex-1 md:overflow-y-auto"
    >
      {pokemons.length === 0 ? (
        <p className="text-muted p-4 text-center">
          No Pokémon match these filters.
        </p>
      ) : (
        <PokemonCatalogEntries
          currentPokemonId={currentPokemonId}
          pokemons={pokemons}
        />
      )}
    </nav>
  )
}
