import PokemonCatalogList from "@/components/PokemonCatalogList"
import PokemonPagination from "@/components/PokemonPagination"
import type { PokemonCatalogEntryFragment } from "@/graphql/generated"

export default function PokemonCatalog({
  pokemons,
  currentPokemonNumber,
  currentPageNumber,
}: {
  pokemons: ReadonlyArray<PokemonCatalogEntryFragment>
  currentPokemonNumber: string
  currentPageNumber: number
}) {
  return (
    <div className="relative w-full bg-gray-800 text-sm md:overflow-y-auto">
      <PokemonCatalogList
        currentPokemonNumber={currentPokemonNumber}
        pokemons={pokemons}
      />
      <PokemonPagination currentPageNumber={currentPageNumber} />
    </div>
  )
}
