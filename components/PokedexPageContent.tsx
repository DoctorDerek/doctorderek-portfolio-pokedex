import AppContainer from "@/components/AppContainer"
import PokedexWorkspaceNavigation from "@/components/PokedexWorkspaceNavigation"
import PokemonCatalog from "@/components/PokemonCatalog"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
import PokemonGraphqlSearch from "@/components/PokemonGraphqlSearch"
import type { PokemonDossier } from "@/types/pokemon"

export default function PokedexPageContent({
  id,
  pokemon,
}: {
  id: string
  pokemon: PokemonDossier | undefined
}) {
  if (!pokemon) return <div>Sorry, Pokémon #{id} not found 😔.</div>

  return (
    <AppContainer bgColor="bg-gray-600">
      <div className="flex w-full max-w-4xl flex-col gap-4 sm:gap-6">
        <PokedexWorkspaceNavigation />
        <div className="grid w-full overflow-hidden rounded-lg shadow-2xl md:h-128 md:grid-cols-[minmax(18rem,2fr)_3fr]">
          <PokemonDetailsPanel key={pokemon.id} pokemon={pokemon} />
          <PokemonCatalog currentPokemonId={Number(id)} />
        </div>
        <PokemonGraphqlSearch />
      </div>
    </AppContainer>
  )
}
