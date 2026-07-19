import gql from "graphql-tag"
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import AppContainer from "@/components/AppContainer"
import PokemonCatalog from "@/components/PokemonCatalog"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
import { Pokemon, PokemonsQuery } from "@/graphql/generated"
import { fetchPokemonApi } from "@/utils/fetchPokemonApi"
import {
  calculateCurrentPage,
  calculatePokemonCount,
  MAX_POKEMON_NUMBER,
} from "@/utils/pokemonPagination"

const Pokedex: InferGetStaticPropsType<typeof getStaticProps> = ({
  data,
  id,
}: {
  data: PokemonsQuery
  id: string
}) => {
  const allPokemons = data.pokemons as Pokemon[]
  const currentPokemon = allPokemons[Number(id) - 1]
  const currentPageNumber = calculateCurrentPage({ id })
  const pokemons = allPokemons.slice(
    (currentPageNumber - 1) * 10,
    currentPageNumber * 10,
  )

  if (!currentPokemon) return <div>Sorry, Pokémon #{id} not found 😔.</div>

  return (
    <AppContainer bgColor="bg-gray-600">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl md:h-128 md:grid-cols-[minmax(18rem,2fr)_3fr]">
        <PokemonCatalog
          pokemons={pokemons}
          currentPokemonNumber={currentPokemon.number ?? ""}
          currentPageNumber={currentPageNumber}
        />
        <PokemonDetailsPanel key={currentPokemon.id} pokemon={currentPokemon} />
      </div>
    </AppContainer>
  )
}

gql`
  query pokemons($first: Int!) {
    pokemons(first: $first) {
      id
      number
      name
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      classification
      types
      resistant
      weaknesses
      fleeRate
      maxCP
      maxHP
      image
    }
  }
`

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string }
  const pokemonCount = calculatePokemonCount({ id })
  return { props: { data: await fetchPokemonApi({ pokemonCount }), id } }
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
