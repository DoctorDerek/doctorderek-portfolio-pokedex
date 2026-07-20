import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import PokedexPageContent from "@/components/PokedexPageContent"
import {
  PokedexPageDocument,
  type PokedexPageQuery,
  type PokedexPageQueryVariables,
} from "@/graphql/generated"
import { fetchPokemonApi } from "@/utils/fetchPokemonApi"
import {
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
  return <PokedexPageContent data={data} id={id} />
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
