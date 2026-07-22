export const POKEMON_GRAPHQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2"

interface GraphqlErrorResponse {
  message: string
}

interface GraphqlDocumentString {
  toString: () => string
}

function isGraphqlErrorResponse(value: unknown): value is GraphqlErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  )
}

function readGraphqlResponseData<TData>(responseBody: unknown) {
  if (typeof responseBody !== "object" || responseBody === null)
    throw new Error("The GraphQL service returned an invalid response.")

  if ("errors" in responseBody && responseBody.errors !== undefined) {
    if (
      !Array.isArray(responseBody.errors) ||
      !responseBody.errors.every(isGraphqlErrorResponse)
    )
      throw new Error("The GraphQL service returned an invalid response.")

    if (responseBody.errors.length > 0)
      throw new Error(
        responseBody.errors.map(({ message }) => message).join(" "),
      )
  }

  if (!("data" in responseBody))
    throw new Error("The GraphQL service returned no search data.")

  return responseBody.data as TData
}

export function pokemonSearchFetcher<TData, TVariables>(
  query: GraphqlDocumentString,
  variables: TVariables,
) {
  return async () => {
    const response = await fetch(POKEMON_GRAPHQL_ENDPOINT, {
      body: JSON.stringify({ query: String(query), variables }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    if (!response.ok)
      throw new Error(`The GraphQL service returned HTTP ${response.status}.`)

    return readGraphqlResponseData<TData>(await response.json())
  }
}
