import { describe, expect, it } from "vitest"
import type { PokemonSearchResultFragment } from "@/graphql/pokemonSearch.generated"
import {
  DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS,
  getPokemonSearchGenerationOptions,
  getPokemonSearchResults,
  normalizePokemonSearchVariables,
} from "@/utils/pokemonSearch"

const BULBASAUR_SEARCH_RESULT: PokemonSearchResultFragment = {
  base_experience: 64,
  id: 1,
  name: "bulbasaur",
  pokemonspecy: {
    generation: { name: "generation-i" },
    is_legendary: false,
    is_mythical: false,
    pokemonspeciesnames: [{ name: "Bulbasaur" }],
  },
  pokemontypes: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
}

describe("Pokémon GraphQL search variables", () => {
  it("normalizes the default form into one bounded national search", () => {
    expect(
      normalizePokemonSearchVariables(DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS),
    ).toEqual({
      generationPattern: "%",
      legendaryStatuses: [true, false],
      limit: 20,
      maximumPokemonId: 1_025,
      minimumBaseExperience: 0,
      mythicalStatuses: [true, false],
      namePattern: "%",
      orderByBaseExperience: false,
      orderByName: false,
      orderByNumber: true,
      typePattern: "%",
    })
  })

  it("maps display values to exact API conventions", () => {
    expect(
      normalizePokemonSearchVariables({
        generation: "generation-i",
        isLegendary: "yes",
        isMythical: "no",
        limit: 50,
        minimumBaseExperience: 100,
        name: "Mr. Mime",
        sort: "name",
        type: "Psychic",
      }),
    ).toEqual({
      generationPattern: "%generation-i%",
      legendaryStatuses: [true],
      limit: 50,
      maximumPokemonId: 1_025,
      minimumBaseExperience: 100,
      mythicalStatuses: [false],
      namePattern: "%mr-mime%",
      orderByBaseExperience: false,
      orderByName: true,
      orderByNumber: false,
      typePattern: "%psychic%",
    })
  })

  it("normalizes partial identifiers without losing canonical exact names", () => {
    expect(
      normalizePokemonSearchVariables({
        ...DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS,
        name: " Flabébé ",
      }).namePattern,
    ).toBe("%flabebe%")
    expect(
      normalizePokemonSearchVariables({
        ...DEFAULT_POKEMON_GRAPHQL_SEARCH_FILTERS,
        name: "  Mr. Mime family  ",
      }).namePattern,
    ).toBe("%mr-mime-family%")
  })

  it("derives all generation labels and API values from the local catalog", () => {
    expect(getPokemonSearchGenerationOptions()).toEqual([
      { label: "Generation I", value: "generation-i" },
      { label: "Generation II", value: "generation-ii" },
      { label: "Generation III", value: "generation-iii" },
      { label: "Generation IV", value: "generation-iv" },
      { label: "Generation V", value: "generation-v" },
      { label: "Generation VI", value: "generation-vi" },
      { label: "Generation VII", value: "generation-vii" },
      { label: "Generation VIII", value: "generation-viii" },
      { label: "Generation IX", value: "generation-ix" },
    ])
  })
})

describe("Pokémon GraphQL search results", () => {
  it.each([
    { sort: "nationalNumber" as const, property: "byNumber" as const },
    { sort: "name" as const, property: "byName" as const },
    {
      sort: "baseExperience" as const,
      property: "byBaseExperience" as const,
    },
  ])("selects only the requested $sort response", ({ property, sort }) => {
    expect(
      getPokemonSearchResults({ [property]: [BULBASAUR_SEARCH_RESULT] }, sort),
    ).toEqual([BULBASAUR_SEARCH_RESULT])
  })

  it("rejects a response that omits the requested order", () => {
    expect(() => getPokemonSearchResults({}, "nationalNumber")).toThrow(
      "The GraphQL service omitted the requested result order.",
    )
  })
})
