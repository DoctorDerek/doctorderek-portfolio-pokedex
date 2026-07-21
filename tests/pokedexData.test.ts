import { describe, expect, it } from "vitest"
import {
  getPokedexStaticParameters,
  MAX_POKEMON_NUMBER,
  POKEMON_CATALOG,
} from "@/data/pokemonCatalog"
import { getPokemonDossier } from "@/data/pokemonDossiers.server"

describe("static Pokédex data", () => {
  it("owns one continuous catalog from Bulbasaur through Pecharunt", () => {
    expect(MAX_POKEMON_NUMBER).toBe(1_025)
    expect(POKEMON_CATALOG).toHaveLength(MAX_POKEMON_NUMBER)
    expect(POKEMON_CATALOG.at(0)).toMatchObject({
      id: 1,
      name: "Bulbasaur",
      number: "0001",
    })
    expect(POKEMON_CATALOG.at(-1)).toMatchObject({
      id: 1_025,
      name: "Pecharunt",
      number: "1025",
    })
  })

  it("generates one unique static parameter for every catalog entry", () => {
    const staticParameters = getPokedexStaticParameters()

    expect(staticParameters).toHaveLength(MAX_POKEMON_NUMBER)
    expect(staticParameters.at(0)).toEqual({ id: "1" })
    expect(staticParameters.at(-1)).toEqual({ id: "1025" })
    expect(new Set(staticParameters.map(({ id }) => id)).size).toBe(
      MAX_POKEMON_NUMBER,
    )
  })

  it("resolves only exact canonical dossier identifiers", () => {
    expect(getPokemonDossier({ id: "1" })).toMatchObject({
      id: 1,
      name: "Bulbasaur",
    })
    expect(getPokemonDossier({ id: "1025" })).toMatchObject({
      id: 1_025,
      name: "Pecharunt",
    })
    expect(getPokemonDossier({ id: "0" })).toBeUndefined()
    expect(getPokemonDossier({ id: "1.5" })).toBeUndefined()
    expect(getPokemonDossier({ id: "1026" })).toBeUndefined()
    expect(getPokemonDossier({ id: "bulbasaur" })).toBeUndefined()
  })
})
