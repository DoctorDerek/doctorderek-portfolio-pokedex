import AppContainer from "@/components/AppContainer"
import PokemonCatalog from "@/components/PokemonCatalog"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
import type { PokedexPageQuery } from "@/graphql/generated"
import {
  compactPokemonCatalogEntries,
  includeSelectedPokemon,
} from "@/utils/pokemonCatalog"

export default function PokedexPageContent({
  data,
  id,
}: {
  data: PokedexPageQuery
  id: string
}) {
  const allPokemons = compactPokemonCatalogEntries({ pokemons: data.pokemons })
  const currentPokemon = data.pokemon

  if (!currentPokemon) return <div>Sorry, Pokémon #{id} not found 😔.</div>

  const initialPokemons = includeSelectedPokemon({
    pokemons: allPokemons,
    selectedPokemon: currentPokemon,
  })

  return (
    <AppContainer bgColor="bg-gray-600">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl md:h-128 md:grid-cols-[minmax(18rem,2fr)_3fr]">
        <PokemonCatalog
          currentPokemonNumber={currentPokemon.number ?? ""}
          initialPokemons={initialPokemons}
        />
        <PokemonDetailsPanel key={currentPokemon.id} pokemon={currentPokemon} />
      </div>
    </AppContainer>
  )
}
