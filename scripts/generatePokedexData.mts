import { mkdir, readFile, writeFile } from "node:fs/promises"
import { pathToFileURL } from "node:url"
import type { PokedexSnapshotQuery } from "@/graphql/pokeapi.generated"

export const EXPECTED_POKEMON_COUNT = 1_025
export const POKEAPI_GRAPHQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2"

const POKEMON_NUMBER_WIDTH = String(EXPECTED_POKEMON_COUNT).length
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
const OFFICIAL_ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"

const REQUIRED_BASE_STAT_NAMES = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
] as const

type RequiredBaseStatName = (typeof REQUIRED_BASE_STAT_NAMES)[number]

export interface PokemonCatalogArtifactEntry {
  baseStatTotal: number
  generation: string
  id: number
  imageUrl: string
  name: string
  number: string
  slug: string
  types: Array<string>
}

export interface PokemonDossierArtifact extends PokemonCatalogArtifactEntry {
  abilities: Array<{
    isHidden: boolean
    name: string
  }>
  baseExperience: number | null
  baseHappiness: number | null
  baseStats: {
    attack: number
    defense: number
    hp: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  captureRate: number | null
  category: string
  color: string | null
  habitat: string | null
  heightInMeters: number | null
  isLegendary: boolean
  isMythical: boolean
  shape: string | null
  weightInKilograms: number | null
}

export interface PokedexArtifacts {
  catalog: Array<PokemonCatalogArtifactEntry>
  dossiers: Array<PokemonDossierArtifact>
}

interface GraphqlResponse {
  data?: unknown
  errors?: unknown
}

export function createPokedexArtifacts(data: PokedexSnapshotQuery) {
  const aggregatePokemonCount = data.pokemonspecies_aggregate.aggregate?.count

  if (aggregatePokemonCount !== EXPECTED_POKEMON_COUNT)
    throw new Error(
      `Expected ${EXPECTED_POKEMON_COUNT} Pokémon species but received ${String(aggregatePokemonCount)}.`,
    )
  if (data.pokemon.length !== EXPECTED_POKEMON_COUNT)
    throw new Error(
      `Expected ${EXPECTED_POKEMON_COUNT} default Pokémon but received ${data.pokemon.length}.`,
    )

  const dossiers = data.pokemon.map(createPokemonDossier)
  const uniquePokemonIds = new Set(dossiers.map(({ id }) => id))

  if (uniquePokemonIds.size !== EXPECTED_POKEMON_COUNT)
    throw new Error("PokéAPI returned duplicate canonical Pokémon identifiers.")
  if (dossiers.some(({ id }, index) => id !== index + 1))
    throw new Error("PokéAPI did not return one continuous national Pokédex.")

  const catalog = dossiers.map(
    ({
      baseStatTotal,
      generation,
      id,
      imageUrl,
      name,
      number,
      slug,
      types,
    }) => ({
      baseStatTotal,
      generation,
      id,
      imageUrl,
      name,
      number,
      slug,
      types,
    }),
  )

  return { catalog, dossiers } satisfies PokedexArtifacts
}

function createPokemonDossier(
  pokemon: PokedexSnapshotQuery["pokemon"][number],
): PokemonDossierArtifact {
  const speciesId = pokemon.pokemon_species_id
  const species = pokemon.pokemonspecy

  if (speciesId === null || species === null)
    throw new Error(
      `Pokémon ${pokemon.name} is missing canonical species data.`,
    )
  if (pokemon.id !== speciesId || species.id !== speciesId)
    throw new Error(
      `Pokémon ${pokemon.name} does not map directly to canonical species ${speciesId}.`,
    )

  const englishSpeciesName = species.pokemonspeciesnames[0]

  if (!englishSpeciesName)
    throw new Error(
      `Pokémon ${pokemon.name} is missing its English species name.`,
    )

  const baseStatsByName = new Map<RequiredBaseStatName, number>()

  for (const pokemonStat of pokemon.pokemonstats) {
    const statName = pokemonStat.stat?.name

    if (!isRequiredBaseStatName(statName)) continue
    if (baseStatsByName.has(statName))
      throw new Error(
        `Pokémon ${pokemon.name} has a duplicate ${statName} stat.`,
      )

    baseStatsByName.set(statName, pokemonStat.base_stat)
  }

  const baseStats = {
    attack: getRequiredBaseStat(baseStatsByName, "attack", pokemon.name),
    defense: getRequiredBaseStat(baseStatsByName, "defense", pokemon.name),
    hp: getRequiredBaseStat(baseStatsByName, "hp", pokemon.name),
    specialAttack: getRequiredBaseStat(
      baseStatsByName,
      "special-attack",
      pokemon.name,
    ),
    specialDefense: getRequiredBaseStat(
      baseStatsByName,
      "special-defense",
      pokemon.name,
    ),
    speed: getRequiredBaseStat(baseStatsByName, "speed", pokemon.name),
  }
  const generationName = species.generation?.name

  if (!generationName)
    throw new Error(`Pokémon ${pokemon.name} is missing its debut generation.`)

  return {
    abilities: pokemon.pokemonabilities.map(({ ability, is_hidden }) => {
      if (!ability)
        throw new Error(`Pokémon ${pokemon.name} has an unnamed ability.`)

      return {
        isHidden: is_hidden,
        name: formatIdentifier(ability.name),
      }
    }),
    baseExperience: pokemon.base_experience,
    baseHappiness: species.base_happiness,
    baseStats,
    baseStatTotal: Object.values(baseStats).reduce(
      (total, baseStat) => total + baseStat,
      0,
    ),
    captureRate: species.capture_rate,
    category: englishSpeciesName.genus,
    color: formatOptionalIdentifier(species.pokemoncolor?.name),
    generation: formatGenerationName(generationName),
    habitat: formatOptionalIdentifier(species.pokemonhabitat?.name),
    heightInMeters: pokemon.height === null ? null : pokemon.height / 10,
    id: speciesId,
    imageUrl: `${OFFICIAL_ARTWORK_BASE_URL}/${speciesId}.png`,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    name: englishSpeciesName.name,
    number: String(speciesId).padStart(POKEMON_NUMBER_WIDTH, "0"),
    shape: formatOptionalIdentifier(species.pokemonshape?.name),
    slug: pokemon.name,
    types: pokemon.pokemontypes.map(({ type }) => {
      if (!type) throw new Error(`Pokémon ${pokemon.name} has an unnamed type.`)

      return formatIdentifier(type.name)
    }),
    weightInKilograms: pokemon.weight === null ? null : pokemon.weight / 10,
  }
}

function getRequiredBaseStat(
  baseStatsByName: ReadonlyMap<RequiredBaseStatName, number>,
  statName: RequiredBaseStatName,
  pokemonName: string,
) {
  const baseStat = baseStatsByName.get(statName)

  if (baseStat === undefined)
    throw new Error(`Pokémon ${pokemonName} is missing its ${statName} stat.`)

  return baseStat
}

function isRequiredBaseStatName(
  statName: string | undefined,
): statName is RequiredBaseStatName {
  return REQUIRED_BASE_STAT_NAMES.some(
    (requiredStatName) => requiredStatName === statName,
  )
}

function formatOptionalIdentifier(identifier: string | undefined) {
  return identifier ? formatIdentifier(identifier) : null
}

function formatIdentifier(identifier: string) {
  return identifier
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ")
}

function formatGenerationName(generationName: string) {
  const romanNumeral = generationName.replace("generation-", "").toUpperCase()

  return `Generation ${romanNumeral}`
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
