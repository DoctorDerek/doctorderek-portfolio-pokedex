import { graphql, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { BULBASAUR_FIXTURE } from "@/tests/fixtures/pokemon"
import { pokemonApiServer } from "@/tests/mocks/pokemonApiServer"
import { fetchPokemonApi, GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"

const REQUESTED_POKEMON_COUNT = 151

describe("fetchPokemonApi", () => {
  it("forwards the requested Pokémon count and returns GraphQL data", async () => {
    pokemonApiServer.use(
      graphql.link(GRAPHQL_API_ENDPOINT).query("pokemons", ({ variables }) => {
        expect(variables).toEqual({ first: REQUESTED_POKEMON_COUNT })

        return HttpResponse.json({
          data: { pokemons: [BULBASAUR_FIXTURE] },
        })
      }),
    )

    await expect(
      fetchPokemonApi({ pokemonCount: REQUESTED_POKEMON_COUNT }),
    ).resolves.toEqual({ pokemons: [BULBASAUR_FIXTURE] })
  })
})
