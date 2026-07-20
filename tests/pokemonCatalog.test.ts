import { describe, expect, it } from "vitest"
import type { PokemonCatalogEntryFragment } from "@/graphql/generated"
import {
  compactPokemonCatalogEntries,
  getPokemonCatalogTypes,
  getVisiblePokemonCatalogEntries,
  includeSelectedPokemon,
} from "@/utils/pokemonCatalog"

const BULBASAUR: PokemonCatalogEntryFragment = {
  id: "bulbasaur",
  image: "bulbasaur.png",
  maxCP: 951,
  name: "Bulbasaur",
  number: "001",
  types: ["Grass", "Poison"],
}

const IVYSAUR: PokemonCatalogEntryFragment = {
  id: "ivysaur",
  image: "ivysaur.png",
  maxCP: 1483,
  name: "Ivysaur",
  number: "002",
  types: ["Grass", "Poison"],
}

const CHARMANDER: PokemonCatalogEntryFragment = {
  id: "charmander",
  image: "charmander.png",
  maxCP: 841,
  name: "Charmander",
  number: "004",
  types: ["Fire"],
}

const POKEMONS = [CHARMANDER, BULBASAUR, IVYSAUR]

describe("Pokémon catalog model", () => {
  it("compacts nullable API entries and includes a missing selection once", () => {
    const compactedPokemons = compactPokemonCatalogEntries({
      pokemons: [BULBASAUR, null],
    })

    expect(
      includeSelectedPokemon({
        pokemons: compactedPokemons,
        selectedPokemon: IVYSAUR,
      }),
    ).toEqual([BULBASAUR, IVYSAUR])
    expect(
      includeSelectedPokemon({
        pokemons: [BULBASAUR, IVYSAUR],
        selectedPokemon: IVYSAUR,
      }),
    ).toEqual([BULBASAUR, IVYSAUR])
  })

  it("derives unique Pokémon types in alphabetical order", () => {
    expect(getPokemonCatalogTypes({ pokemons: POKEMONS })).toEqual([
      "Fire",
      "Grass",
      "Poison",
    ])
  })

  it.each([
    { search: "saur", type: "all", expected: [BULBASAUR, IVYSAUR] },
    { search: "#004", type: "all", expected: [CHARMANDER] },
    { search: "", type: "Fire", expected: [CHARMANDER] },
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
      expected: [BULBASAUR, IVYSAUR, CHARMANDER],
    },
    { sort: "name" as const, expected: [BULBASAUR, CHARMANDER, IVYSAUR] },
    {
      sort: "maximumCombatPower" as const,
      expected: [IVYSAUR, BULBASAUR, CHARMANDER],
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
