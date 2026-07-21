import { describe, expect, it } from "vitest"
import {
  BULBASAUR_CATALOG_FIXTURE,
  CHARMANDER_CATALOG_FIXTURE,
  IVYSAUR_CATALOG_FIXTURE,
} from "@/tests/fixtures/pokedex"
import {
  getPokemonCatalogTypes,
  getVisiblePokemonCatalogEntries,
} from "@/utils/pokemonCatalog"

const POKEMONS = [
  CHARMANDER_CATALOG_FIXTURE,
  BULBASAUR_CATALOG_FIXTURE,
  IVYSAUR_CATALOG_FIXTURE,
]

describe("Pokémon catalog model", () => {
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
