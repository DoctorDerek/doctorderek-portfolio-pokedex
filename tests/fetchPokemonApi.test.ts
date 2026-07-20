import { graphql, http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { PokedexPageDocument } from "@/graphql/generated"
import { BULBASAUR_FIXTURE } from "@/tests/fixtures/pokemon"
import { pokemonApiServer } from "@/tests/mocks/pokemonApiServer"
import { fetchPokemonApi, GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"

const POKEDEX_PAGE_VARIABLES = {
  catalogSize: 20,
  pokemonId: "UG9rZW1vbjowMDE=",
}

describe("fetchPokemonApi", () => {
  it("forwards typed page variables and returns GraphQL data", async () => {
    pokemonApiServer.use(
      graphql
        .link(GRAPHQL_API_ENDPOINT)
        .query("PokedexPage", ({ variables }) => {
          expect(variables).toEqual(POKEDEX_PAGE_VARIABLES)

          return HttpResponse.json({
            data: {
              pokemon: BULBASAUR_FIXTURE,
              pokemons: [BULBASAUR_FIXTURE],
            },
          })
        }),
    )

    await expect(
      fetchPokemonApi({
        document: PokedexPageDocument,
        variables: POKEDEX_PAGE_VARIABLES,
      }),
    ).resolves.toEqual({
      pokemon: BULBASAUR_FIXTURE,
      pokemons: [BULBASAUR_FIXTURE],
    })
  })

  it("surfaces the first GraphQL error", async () => {
    pokemonApiServer.use(
      graphql.link(GRAPHQL_API_ENDPOINT).query("PokedexPage", () =>
        HttpResponse.json({
          errors: [{ message: "Pokémon registry unavailable." }],
        }),
      ),
    )

    await expect(
      fetchPokemonApi({
        document: PokedexPageDocument,
        variables: POKEDEX_PAGE_VARIABLES,
      }),
    ).rejects.toThrow("Pokémon registry unavailable.")
  })

  it("surfaces non-successful HTTP status codes", async () => {
    pokemonApiServer.use(
      http.post(
        GRAPHQL_API_ENDPOINT,
        () => new HttpResponse(null, { status: 503 }),
      ),
    )

    await expect(
      fetchPokemonApi({
        document: PokedexPageDocument,
        variables: POKEDEX_PAGE_VARIABLES,
      }),
    ).rejects.toThrow("Pokémon API request failed with status 503.")
  })
})
