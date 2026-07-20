import { describe, expect, it } from "vitest"
import { getPokemonApiGlobalId } from "@/utils/pokemonIdentity"

describe("getPokemonApiGlobalId", () => {
  it("encodes a national Pokédex number as the API’s Relay identity", () => {
    expect(getPokemonApiGlobalId({ nationalPokedexNumber: 1 })).toBe(
      "UG9rZW1vbjowMDE=",
    )
  })
})
