import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import {
  isRetryablePokemonSearchError,
  POKEMON_GRAPHQL_ENDPOINT,
  pokemonSearchFetcher,
  pokemonSearchFetcherWithTransientRetry,
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

  it("accepts an explicitly empty GraphQL errors envelope", async () => {
    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () =>
        HttpResponse.json({ errors: [], data: { pokemon: [{ id: 25 }] } }),
      ),
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

  it("classifies transient HTTP failures as retryable", () => {
    expect(
      isRetryablePokemonSearchError(
        new Error("The GraphQL service returned HTTP 500."),
      ),
    ).toBe(true)
    expect(
      isRetryablePokemonSearchError(
        new Error("The GraphQL service returned HTTP 503."),
      ),
    ).toBe(true)
    expect(
      isRetryablePokemonSearchError(
        new Error("The GraphQL service returned HTTP 429."),
      ),
    ).toBe(false)
  })

  it("does not retry non-http or non-transient errors", () => {
    expect(
      isRetryablePokemonSearchError(
        new Error("The GraphQL service returned an invalid response."),
      ),
    ).toBe(false)
    expect(
      isRetryablePokemonSearchError(new Error("Temporary network outage")),
    ).toBe(false)
    expect(isRetryablePokemonSearchError(null)).toBe(false)
  })

  it("retries once for transient HTTP failures", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () => {
        requestCount += 1

        if (requestCount === 1) return new HttpResponse(null, { status: 503 })

        return HttpResponse.json({ data: { pokemon: [{ id: 25 }] } })
      }),
    )

    await expect(
      pokemonSearchFetcherWithTransientRetry<
        TestPokemonSearchData,
        typeof TEST_VARIABLES
      >(TEST_DOCUMENT, TEST_VARIABLES),
    ).resolves.toEqual({ pokemon: [{ id: 25 }] })
    expect(requestCount).toBe(2)
  })

  it("does not retry non-transient HTTP responses", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () => {
        requestCount += 1

        return new HttpResponse(null, { status: 400 })
      }),
    )

    await expect(
      pokemonSearchFetcherWithTransientRetry<
        TestPokemonSearchData,
        typeof TEST_VARIABLES
      >(TEST_DOCUMENT, TEST_VARIABLES),
    ).rejects.toThrow("The GraphQL service returned HTTP 400.")
    expect(requestCount).toBe(1)
  })

  it("retries transient HTTP failures when using the default fetcher", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () => {
        requestCount += 1

        if (requestCount === 1) return new HttpResponse(null, { status: 500 })

        return HttpResponse.json({ data: { pokemon: [{ id: 25 }] } })
      }),
    )

    await expect(
      pokemonSearchFetcher<TestPokemonSearchData, typeof TEST_VARIABLES>(
        TEST_DOCUMENT,
        TEST_VARIABLES,
      )(),
    ).resolves.toEqual({ pokemon: [{ id: 25 }] })
    expect(requestCount).toBe(2)
  })

  it("does not retry non-transient HTTP failures when using the default fetcher", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () => {
        requestCount += 1

        return new HttpResponse(null, { status: 400 })
      }),
    )

    await expect(
      pokemonSearchFetcher<TestPokemonSearchData, typeof TEST_VARIABLES>(
        TEST_DOCUMENT,
        TEST_VARIABLES,
      )(),
    ).rejects.toThrow("The GraphQL service returned HTTP 400.")
    expect(requestCount).toBe(1)
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
