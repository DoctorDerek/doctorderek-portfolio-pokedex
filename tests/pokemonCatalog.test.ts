import { describe, expect, it } from "vitest"
import { POKEMON_CATALOG } from "@/data/pokemonCatalog"
import {
  BULBASAUR_CATALOG_FIXTURE,
  CHARMANDER_CATALOG_FIXTURE,
  IVYSAUR_CATALOG_FIXTURE,
} from "@/tests/fixtures/pokedex"
import {
  DEFAULT_POKEMON_CATALOG_FILTERS,
  expandPokemonCatalogRange,
  getContextualPokemonCatalogEntries,
  getContextualPokemonCatalogRange,
  getPokemonCatalogEntriesInRange,
  getPokemonCatalogTypes,
  getVisiblePokemonCatalogEntries,
  hasActivePokemonCatalogDiscovery,
} from "@/utils/pokemonCatalog"

const POKEMONS = [
  CHARMANDER_CATALOG_FIXTURE,
  BULBASAUR_CATALOG_FIXTURE,
  IVYSAUR_CATALOG_FIXTURE,
]

describe("Pokémon catalog model", () => {
  it("centers a 21-entry contextual window on the selected dossier", () => {
    const contextualPokemons = getContextualPokemonCatalogEntries({
      currentPokemonId: 500,
      pokemons: POKEMON_CATALOG,
    })

    expect(contextualPokemons).toHaveLength(21)
    expect(contextualPokemons.at(0)?.id).toBe(490)
    expect(contextualPokemons.at(-1)?.id).toBe(510)
  })

  it.each([
    { currentPokemonId: 1, firstPokemonId: 1, lastPokemonId: 21 },
    { currentPokemonId: 1_025, firstPokemonId: 1_005, lastPokemonId: 1_025 },
  ])(
    "clamps route $currentPokemonId to a complete boundary window",
    ({ currentPokemonId, firstPokemonId, lastPokemonId }) => {
      const contextualPokemons = getContextualPokemonCatalogEntries({
        currentPokemonId,
        pokemons: POKEMON_CATALOG,
      })

      expect(contextualPokemons).toHaveLength(21)
      expect(contextualPokemons.at(0)?.id).toBe(firstPokemonId)
      expect(contextualPokemons.at(-1)?.id).toBe(lastPokemonId)
    },
  )

  it("returns every entry when the catalog is smaller than one window", () => {
    expect(
      getContextualPokemonCatalogEntries({
        currentPokemonId: 2,
        pokemons: POKEMONS,
      }),
    ).toEqual(POKEMONS)
  })

  it("expands one local buffer in both directions around the selected dossier", () => {
    const contextualRange = getContextualPokemonCatalogRange({
      currentPokemonId: 500,
      pokemons: POKEMON_CATALOG,
    })
    const expandedRange = expandPokemonCatalogRange({
      direction: "both",
      pokemonCount: POKEMON_CATALOG.length,
      range: contextualRange,
    })
    const expandedPokemons = getPokemonCatalogEntriesInRange({
      pokemons: POKEMON_CATALOG,
      range: expandedRange,
    })

    expect(expandedPokemons).toHaveLength(61)
    expect(expandedPokemons.at(0)?.id).toBe(470)
    expect(expandedPokemons.at(-1)?.id).toBe(530)
  })

  it.each([
    { currentPokemonId: 1, firstPokemonId: 1, lastPokemonId: 41 },
    { currentPokemonId: 1_025, firstPokemonId: 985, lastPokemonId: 1_025 },
  ])(
    "clamps expanded route $currentPokemonId to its dataset boundary",
    ({ currentPokemonId, firstPokemonId, lastPokemonId }) => {
      const contextualRange = getContextualPokemonCatalogRange({
        currentPokemonId,
        pokemons: POKEMON_CATALOG,
      })
      const expandedRange = expandPokemonCatalogRange({
        direction: "both",
        pokemonCount: POKEMON_CATALOG.length,
        range: contextualRange,
      })
      const expandedPokemons = getPokemonCatalogEntriesInRange({
        pokemons: POKEMON_CATALOG,
        range: expandedRange,
      })

      expect(expandedPokemons).toHaveLength(41)
      expect(expandedPokemons.at(0)?.id).toBe(firstPokemonId)
      expect(expandedPokemons.at(-1)?.id).toBe(lastPokemonId)
    },
  )

  it("accumulates repeated expansion until the complete local catalog is ready", () => {
    let range = getContextualPokemonCatalogRange({
      currentPokemonId: 500,
      pokemons: POKEMON_CATALOG,
    })

    for (let expansion = 0; expansion < 103; expansion += 1)
      range = expandPokemonCatalogRange({
        direction: "both",
        pokemonCount: POKEMON_CATALOG.length,
        range,
      })

    expect(range).toEqual({ endIndex: 1_025, startIndex: 0 })
    expect(
      getPokemonCatalogEntriesInRange({
        pokemons: POKEMON_CATALOG,
        range,
      }),
    ).toHaveLength(1_025)
  })

  it.each([
    { filters: DEFAULT_POKEMON_CATALOG_FILTERS, expected: false },
    {
      filters: { ...DEFAULT_POKEMON_CATALOG_FILTERS, search: "   " },
      expected: false,
    },
    {
      filters: { ...DEFAULT_POKEMON_CATALOG_FILTERS, search: "Pikachu" },
      expected: true,
    },
    {
      filters: { ...DEFAULT_POKEMON_CATALOG_FILTERS, type: "Electric" },
      expected: true,
    },
    {
      filters: { ...DEFAULT_POKEMON_CATALOG_FILTERS, sort: "name" as const },
      expected: true,
    },
  ])(
    "identifies whether discovery controls express intent",
    ({ filters, expected }) => {
      expect(hasActivePokemonCatalogDiscovery({ filters })).toBe(expected)
    },
  )

  it("derives unique Pokémon types in alphabetical order", () => {
    expect(getPokemonCatalogTypes({ pokemons: POKEMONS })).toEqual([
      "Fire",
      "Grass",
      "Poison",
    ])
  })

  it.each([
    {
      search: "saur",
      type: "all",
      expected: [BULBASAUR_CATALOG_FIXTURE, IVYSAUR_CATALOG_FIXTURE],
    },
    {
      search: "#0004",
      type: "all",
      expected: [CHARMANDER_CATALOG_FIXTURE],
    },
    {
      search: "",
      type: "Fire",
      expected: [CHARMANDER_CATALOG_FIXTURE],
    },
  ])("filters by search and type", ({ search, type, expected }) => {
    expect(
      getVisiblePokemonCatalogEntries({
        filters: { search, sort: "nationalNumber", type },
        pokemons: POKEMONS,
      }),
    ).toEqual(expected)
  })

  it.each([
    {
      sort: "nationalNumber" as const,
      expected: [
        BULBASAUR_CATALOG_FIXTURE,
        IVYSAUR_CATALOG_FIXTURE,
        CHARMANDER_CATALOG_FIXTURE,
      ],
    },
    {
      sort: "name" as const,
      expected: [
        BULBASAUR_CATALOG_FIXTURE,
        CHARMANDER_CATALOG_FIXTURE,
        IVYSAUR_CATALOG_FIXTURE,
      ],
    },
    {
      sort: "baseStatTotal" as const,
      expected: [
        IVYSAUR_CATALOG_FIXTURE,
        BULBASAUR_CATALOG_FIXTURE,
        CHARMANDER_CATALOG_FIXTURE,
      ],
    },
  ])("sorts deterministically by $sort", ({ sort, expected }) => {
    expect(
      getVisiblePokemonCatalogEntries({
        filters: { search: "", sort, type: "all" },
        pokemons: POKEMONS,
      }),
    ).toEqual(expected)
  })
})
