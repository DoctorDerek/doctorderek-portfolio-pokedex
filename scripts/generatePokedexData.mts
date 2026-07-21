import { mkdir, readFile, writeFile } from "node:fs/promises"
import { pathToFileURL } from "node:url"
import type { PokedexSnapshotQuery } from "@/graphql/pokeapi.generated"
import {
  createPokedexArtifacts,
  EXPECTED_POKEMON_COUNT,
} from "./createPokedexArtifacts.ts"

const POKEAPI_GRAPHQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2"
const POKEAPI_GRAPHQL_DOCUMENT_URL = new URL(
  "../graphql/pokeapi.graphql",
  import.meta.url,
)
const DATA_OUTPUT_DIRECTORY_URL = new URL("../data/", import.meta.url)
const POKEMON_CATALOG_OUTPUT_URL = new URL(
  "../data/pokemonCatalog.json",
  import.meta.url,
)
const POKEMON_DOSSIERS_OUTPUT_URL = new URL(
  "../data/pokemonDossiers.json",
  import.meta.url,
)

interface GraphqlResponse {
  data?: unknown
  errors?: unknown
}

function isGraphqlResponse(value: unknown): value is GraphqlResponse {
  return typeof value === "object" && value !== null
}

function getGraphqlErrorMessage(errors: unknown) {
  if (!Array.isArray(errors)) return null

  const firstError: unknown = errors[0]

  if (typeof firstError !== "object" || firstError === null) return null
  if (!("message" in firstError) || typeof firstError.message !== "string")
    return null

  return firstError.message
}

async function fetchPokedexSnapshot() {
  const graphqlDocument = await readFile(POKEAPI_GRAPHQL_DOCUMENT_URL, "utf8")
  const response = await fetch(POKEAPI_GRAPHQL_ENDPOINT, {
    body: JSON.stringify({
      query: graphqlDocument,
      variables: { pokemonCount: EXPECTED_POKEMON_COUNT },
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })

  if (!response.ok)
    throw new Error(
      `PokéAPI GraphQL request failed with status ${response.status}.`,
    )

  const responseBody: unknown = await response.json()

  if (!isGraphqlResponse(responseBody))
    throw new Error("PokéAPI GraphQL returned an invalid response.")

  const graphqlErrorMessage = getGraphqlErrorMessage(responseBody.errors)

  if (graphqlErrorMessage) throw new Error(graphqlErrorMessage)
  if (!responseBody.data)
    throw new Error("PokéAPI GraphQL returned no snapshot data.")

  return responseBody.data as PokedexSnapshotQuery
}

async function generatePokedexData() {
  const snapshot = await fetchPokedexSnapshot()
  const { catalog, dossiers } = createPokedexArtifacts(snapshot)

  await mkdir(DATA_OUTPUT_DIRECTORY_URL, { recursive: true })
  await Promise.all([
    writeFile(
      POKEMON_CATALOG_OUTPUT_URL,
      `${JSON.stringify(catalog, null, 2)}\n`,
    ),
    writeFile(
      POKEMON_DOSSIERS_OUTPUT_URL,
      `${JSON.stringify(dossiers, null, 2)}\n`,
    ),
  ])
}

const executedFilePath = process.argv[1]

if (
  executedFilePath &&
  pathToFileURL(executedFilePath).href === import.meta.url
)
  await generatePokedexData()
