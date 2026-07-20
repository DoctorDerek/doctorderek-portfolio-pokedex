import type { TypedDocumentString } from "@/graphql/generated"

export const GRAPHQL_API_ENDPOINT = "https://graphql-pokemon2.vercel.app/"

interface GraphqlApiResponse<TData> {
  data?: TData
  errors?: Array<{ message: string }>
}

export async function fetchPokemonApi<TData, TVariables>({
  document,
  variables,
}: {
  document: TypedDocumentString<TData, TVariables>
  variables: TVariables
}) {
  const response = await fetch(GRAPHQL_API_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: document.toString(),
      variables,
    }),
    method: "POST",
  })
  if (!response.ok)
    throw new Error(`Pokémon API request failed with status ${response.status}.`)

  const { data, errors } = (await response.json()) as GraphqlApiResponse<TData>

  if (errors?.[0]) throw new Error(errors[0].message)
  if (!data) throw new Error("Pokémon API returned no data.")

  return data
}

export function pokemonApiQueryFetcher<TData, TVariables>(
  document: TypedDocumentString<unknown, unknown>,
  variables: TVariables,
) {
  return () =>
    fetchPokemonApi({
      document: document as TypedDocumentString<TData, TVariables>,
      variables,
    })
}
