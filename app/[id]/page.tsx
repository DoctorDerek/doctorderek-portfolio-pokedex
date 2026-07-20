import PokedexPageContent from "@/components/PokedexPageContent"
import {
  PokedexPageDocument,
  type PokedexPageQuery,
  type PokedexPageQueryVariables,
  type TypedDocumentString,
} from "@/graphql/generated"
import { fetchPokemonApi } from "@/utils/fetchPokemonApi"
import {
  INITIAL_POKEMON_CATALOG_SIZE,
  MAX_POKEMON_NUMBER,
} from "@/utils/pokemonCatalog"
import { getPokemonApiGlobalId } from "@/utils/pokemonIdentity"

interface PokedexPageProps {
  params: Promise<{ id: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return Array.from({ length: MAX_POKEMON_NUMBER }, (_, index) => ({
    id: String(index + 1),
  }))
}

export default async function PokedexPage({ params }: PokedexPageProps) {
  const { id } = await params
  const variables: PokedexPageQueryVariables = {
    catalogSize: INITIAL_POKEMON_CATALOG_SIZE,
    pokemonId: getPokemonApiGlobalId({
      nationalPokedexNumber: Number(id),
    }),
  }
  const data = await fetchPokemonApi<
    PokedexPageQuery,
    PokedexPageQueryVariables
  >({
    document: PokedexPageDocument as TypedDocumentString<
      PokedexPageQuery,
      PokedexPageQueryVariables
    >,
    variables,
  })

  return <PokedexPageContent data={data} id={id} />
}
