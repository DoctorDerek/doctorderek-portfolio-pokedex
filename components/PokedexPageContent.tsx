import AppContainer from "@/components/AppContainer"
import PokemonCatalog from "@/components/PokemonCatalog"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
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
      <div className="grid w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl md:h-128 md:grid-cols-[minmax(18rem,2fr)_3fr]">
        <PokemonCatalog currentPokemonId={Number(id)} />
        <PokemonDetailsPanel key={pokemon.id} pokemon={pokemon} />
      </div>
    </AppContainer>
  )
}
