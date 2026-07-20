import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import AppContainer from "@/components/AppContainer"
import PokemonCatalog from "@/components/PokemonCatalog"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
import {
  PokedexPageDocument,
  type PokedexPageQuery,
  type PokedexPageQueryVariables,
} from "@/graphql/generated"
import { fetchPokemonApi } from "@/utils/fetchPokemonApi"
import {
  compactPokemonCatalogEntries,
  includeSelectedPokemon,
  INITIAL_POKEMON_CATALOG_SIZE,
  MAX_POKEMON_NUMBER,
} from "@/utils/pokemonCatalog"
import { getPokemonApiGlobalId } from "@/utils/pokemonIdentity"

const Pokedex: InferGetStaticPropsType<typeof getStaticProps> = ({
  data,
  id,
}: {
  data: PokedexPageQuery
  id: string
}) => {
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string }
  const variables: PokedexPageQueryVariables = {
    catalogSize: INITIAL_POKEMON_CATALOG_SIZE,
    pokemonId: getPokemonApiGlobalId({
      nationalPokedexNumber: Number(id),
    }),
  }

  return {
    props: {
      data: await fetchPokemonApi({
        document: PokedexPageDocument,
        variables,
      }),
      id,
    },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Array(MAX_POKEMON_NUMBER)
      .fill(MAX_POKEMON_NUMBER)
      .map((_, index) => index + 1)
      .map((pokemonNumber) => ({
        params: {
          id: String(pokemonNumber),
        },
      })),
    fallback: false,
  }
}

export default Pokedex
