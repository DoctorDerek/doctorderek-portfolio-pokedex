export const POKEMON_GRAPHQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2"

const HTTP_ERROR_PREFIX = "The GraphQL service returned HTTP "
const TRANSIENT_HTTP_ERROR_MINIMUM = 500
const TRANSIENT_HTTP_ERROR_MAXIMUM = 599

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

async function executePokemonSearchFetcher<TData, TVariables>(
  query: GraphqlDocumentString,
  variables: TVariables,
) {
  const response = await fetch(POKEMON_GRAPHQL_ENDPOINT, {
    body: JSON.stringify({ query: String(query), variables }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })

  if (!response.ok) {
    throw new Error(`The GraphQL service returned HTTP ${response.status}.`)
  }

  return readGraphqlResponseData<TData>(await response.json())
}

export function pokemonSearchFetcher<TData, TVariables>(
  query: GraphqlDocumentString,
  variables: TVariables,
) {
  return () =>
    pokemonSearchFetcherWithTransientRetry<TData, TVariables>(query, variables)
}

export function isRetryablePokemonSearchError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  if (!error.message.startsWith(HTTP_ERROR_PREFIX)) return false

  const statusCode = Number(error.message.replace(HTTP_ERROR_PREFIX, ""))

  return (
    Number.isInteger(statusCode) &&
    statusCode >= TRANSIENT_HTTP_ERROR_MINIMUM &&
    statusCode <= TRANSIENT_HTTP_ERROR_MAXIMUM
  )
}

export async function pokemonSearchFetcherWithTransientRetry<TData, TVariables>(
  query: GraphqlDocumentString,
  variables: TVariables,
): Promise<TData> {
  const attempt = () =>
    executePokemonSearchFetcher<TData, TVariables>(query, variables)

  try {
    return await attempt()
  } catch (error) {
    if (!isRetryablePokemonSearchError(error)) throw error
  }

  return attempt()
}
