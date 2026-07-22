import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import {
  POKEMON_GRAPHQL_ENDPOINT,
  pokemonSearchFetcher,
} from "@/data/pokemonSearch"
import { pokemonApiMockServer } from "@/tests/mocks/server"

const TEST_DOCUMENT = "query TestPokemonSearch { pokemon { id } }"
const TEST_VARIABLES = { limit: 20 }

interface TestPokemonSearchData {
  pokemon: Array<{ id: number }>
}

interface TestPokemonSearchRequest {
  query: string
  variables: typeof TEST_VARIABLES
}

describe("pokemonSearchFetcher", () => {
  it("posts the generated document and variables before returning data", async () => {
    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, async ({ request }) => {
        const requestBody = (await request.json()) as TestPokemonSearchRequest

        expect(requestBody).toEqual({
          query: TEST_DOCUMENT,
          variables: TEST_VARIABLES,
        })

        return HttpResponse.json({ data: { pokemon: [{ id: 25 }] } })
      }),
    )

    await expect(
      pokemonSearchFetcher<TestPokemonSearchData, typeof TEST_VARIABLES>(
        TEST_DOCUMENT,
        TEST_VARIABLES,
      )(),
    ).resolves.toEqual({ pokemon: [{ id: 25 }] })
  })

  it("rejects unsuccessful HTTP responses", async () => {
    pokemonApiMockServer.use(
      http.post(
        POKEMON_GRAPHQL_ENDPOINT,
        () => new HttpResponse(null, { status: 503 }),
      ),
    )

    await expect(
      pokemonSearchFetcher<TestPokemonSearchData, typeof TEST_VARIABLES>(
        TEST_DOCUMENT,
        TEST_VARIABLES,
      )(),
    ).rejects.toThrow("The GraphQL service returned HTTP 503.")
  })

  it("rejects GraphQL errors instead of returning partial data", async () => {
    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () =>
        HttpResponse.json({
          data: { pokemon: [{ id: 25 }] },
          errors: [{ message: "Research access is temporarily unavailable." }],
        }),
      ),
    )

    await expect(
      pokemonSearchFetcher<TestPokemonSearchData, typeof TEST_VARIABLES>(
        TEST_DOCUMENT,
        TEST_VARIABLES,
      )(),
    ).rejects.toThrow("Research access is temporarily unavailable.")
  })

  it.each([
    { responseBody: null, expectedMessage: "invalid response" },
    {
      responseBody: { errors: "invalid" },
      expectedMessage: "invalid response",
    },
    { responseBody: {}, expectedMessage: "no search data" },
  ])(
    "rejects malformed response envelope %#",
    async ({ responseBody, expectedMessage }) => {
      pokemonApiMockServer.use(
        http.post(POKEMON_GRAPHQL_ENDPOINT, () =>
          HttpResponse.json(responseBody),
        ),
      )

      await expect(
        pokemonSearchFetcher<TestPokemonSearchData, typeof TEST_VARIABLES>(
          TEST_DOCUMENT,
          TEST_VARIABLES,
        )(),
      ).rejects.toThrow(expectedMessage)
    },
  )
})
