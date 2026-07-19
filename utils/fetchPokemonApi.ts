import {
  PokemonsDocument,
  type PokemonsQuery,
  type PokemonsQueryVariables,
} from "@/graphql/generated"

export const GRAPHQL_API_ENDPOINT = "https://graphql-pokemon2.vercel.app/"

interface PokemonsApiResponse {
  data: PokemonsQuery
}

export async function fetchPokemonApi({
  pokemonCount,
}: {
  pokemonCount: number
}) {
  const variables: PokemonsQueryVariables = { first: pokemonCount }
  const response = await fetch(GRAPHQL_API_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PokemonsDocument,
      variables,
    }),
    method: "POST",
  })
  const { data } = (await response.json()) as PokemonsApiResponse

  return data
}
