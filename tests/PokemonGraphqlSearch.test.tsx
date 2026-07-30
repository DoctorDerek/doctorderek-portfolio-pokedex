import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import ApplicationProviders from "@/app/providers"
import PokemonGraphqlSearch from "@/components/PokemonGraphqlSearch"
import { POKEMON_GRAPHQL_ENDPOINT } from "@/data/pokemonSearch"
import type { AdvancedPokemonSearchQueryVariables } from "@/graphql/pokemonSearch.generated"
import { pokemonApiMockServer } from "@/tests/mocks/server"

interface PokemonSearchRequestBody {
  variables: AdvancedPokemonSearchQueryVariables
}

function renderPokemonGraphqlSearch() {
  return render(
    <ApplicationProviders>
      <PokemonGraphqlSearch />
    </ApplicationProviders>,
  )
}

function createPokemonSearchResult({
  baseExperience,
  id,
  name,
}: {
  baseExperience: number
  id: number
  name: string
}) {
  return {
    base_experience: baseExperience,
    id,
    name: name.toLowerCase(),
    pokemonspecy: {
      generation: { name: "generation-i" },
      is_legendary: false,
      is_mythical: false,
      pokemonspeciesnames: [{ name }],
    },
    pokemontypes: [{ type: { name: "electric" } }],
  }
}

describe("PokemonGraphqlSearch", () => {
  it("keeps field editing and reset entirely request-free", () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () => {
        requestCount += 1

        return HttpResponse.json({ data: { byNumber: [] } })
      }),
    )
    renderPokemonGraphqlSearch()

    fireEvent.change(screen.getByRole("searchbox", { name: "Pokémon name" }), {
      target: { value: "Pikachu" },
    })
    fireEvent.change(screen.getByRole("combobox", { name: "Type" }), {
      target: { value: "Electric" },
    })
    fireEvent.change(
      screen.getByRole("combobox", { name: "Debut generation" }),
      { target: { value: "generation-i" } },
    )

    expect(requestCount).toBe(0)

    fireEvent.click(screen.getByRole("button", { name: "Reset research" }))

    expect(requestCount).toBe(0)
    expect(screen.getByRole("searchbox", { name: "Pokémon name" })).toHaveValue(
      "",
    )
    expect(
      screen.getByText(/editing these fields does not make network requests/i),
    ).toBeVisible()
  })

  it("requests once per changed submission and reuses a fresh identical result", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, async ({ request }) => {
        requestCount += 1

        const { variables } = (await request.json()) as PokemonSearchRequestBody
        const isEeveeSearch = variables.namePattern === "%eevee%"

        return HttpResponse.json({
          data: {
            byNumber: [
              createPokemonSearchResult(
                isEeveeSearch
                  ? { baseExperience: 65, id: 133, name: "Eevee" }
                  : { baseExperience: 112, id: 25, name: "Pikachu" },
              ),
            ],
          },
        })
      }),
    )
    renderPokemonGraphqlSearch()
    const pokemonName = screen.getByRole("searchbox", {
      name: "Pokémon name",
    })
    const submitSearch = screen.getByRole("button", {
      name: "GraphQL Search",
    })

    fireEvent.change(pokemonName, { target: { value: "Pikachu" } })
    fireEvent.click(submitSearch)

    expect(
      await screen.findByRole("link", { name: /Pikachu/ }),
    ).toHaveAttribute("href", "/pokemon/25")
    expect(requestCount).toBe(1)

    fireEvent.click(submitSearch)

    expect(requestCount).toBe(1)

    fireEvent.change(pokemonName, { target: { value: "Eevee" } })

    expect(screen.getByRole("link", { name: /Pikachu/ })).toBeVisible()
    expect(requestCount).toBe(1)

    fireEvent.click(submitSearch)

    expect(await screen.findByRole("link", { name: /Eevee/ })).toHaveAttribute(
      "href",
      "/pokemon/133",
    )
    await waitFor(() => expect(requestCount).toBe(2))

    fireEvent.change(pokemonName, { target: { value: "Pikachu" } })
    fireEvent.click(submitSearch)

    expect(await screen.findByRole("link", { name: /Pikachu/ })).toBeVisible()
    expect(requestCount).toBe(2)
  })

  it("retries once on transient HTTP failure and succeeds automatically", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () => {
        requestCount += 1

        if (requestCount === 1) return new HttpResponse(null, { status: 503 })

        return HttpResponse.json({
          data: {
            byNumber: [
              createPokemonSearchResult({
                baseExperience: 64,
                id: 1,
                name: "Bulbasaur",
              }),
            ],
          },
        })
      }),
    )
    renderPokemonGraphqlSearch()

    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(
      await screen.findByRole("link", { name: /Bulbasaur/ }),
    ).toHaveAttribute("href", "/pokemon/1")
    expect(requestCount).toBe(2)
  })

  it("does not retry automatically on API errors and recovers when the same query is resubmitted", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () => {
        requestCount += 1

        if (requestCount === 1)
          return HttpResponse.json({
            errors: [{ message: "Research index temporarily unavailable." }],
          })

        return HttpResponse.json({
          data: {
            byNumber: [
              createPokemonSearchResult({
                baseExperience: 64,
                id: 1,
                name: "Bulbasaur",
              }),
            ],
          },
        })
      }),
    )
    renderPokemonGraphqlSearch()

    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Research index temporarily unavailable.",
    )
    expect(requestCount).toBe(1)

    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(
      await screen.findByRole("link", { name: /Bulbasaur/ }),
    ).toHaveAttribute("href", "/pokemon/1")
    expect(requestCount).toBe(2)
  })

  it("does not treat bad requests as retryable", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, () => {
        requestCount += 1

        return new HttpResponse(null, { status: 429 })
      }),
    )
    renderPokemonGraphqlSearch()

    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The GraphQL service returned HTTP 429.",
    )
    expect(requestCount).toBe(1)

    fireEvent.change(screen.getByRole("searchbox", { name: "Pokémon name" }), {
      target: { value: "Pikachu" },
    })
    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The GraphQL service returned HTTP 429.",
    )
    await waitFor(() => expect(requestCount).toBe(2))
  })

  it("validates the form before sending every advanced field in one request", async () => {
    let requestCount = 0

    pokemonApiMockServer.use(
      http.post(POKEMON_GRAPHQL_ENDPOINT, async ({ request }) => {
        requestCount += 1

        const { variables } = (await request.json()) as PokemonSearchRequestBody

        expect(variables).toEqual({
          generationPattern: "%generation-ix%",
          legendaryStatuses: [false],
          limit: 100,
          maximumPokemonId: 1_025,
          minimumBaseExperience: 120,
          mythicalStatuses: [true],
          namePattern: "%mr-mime%",
          orderByBaseExperience: true,
          orderByName: false,
          orderByNumber: false,
          typePattern: "%psychic%",
        })

        return HttpResponse.json({ data: { byBaseExperience: [] } })
      }),
    )
    renderPokemonGraphqlSearch()
    const minimumBaseExperience = screen.getByRole("spinbutton", {
      name: "Minimum base experience",
    })

    fireEvent.change(minimumBaseExperience, { target: { value: "-1" } })
    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Enter 0 or more.",
    )
    expect(requestCount).toBe(0)

    fireEvent.change(screen.getByRole("searchbox", { name: "Pokémon name" }), {
      target: { value: "Mr. Mime" },
    })
    fireEvent.change(screen.getByRole("combobox", { name: "Type" }), {
      target: { value: "Psychic" },
    })
    fireEvent.change(
      screen.getByRole("combobox", { name: "Debut generation" }),
      { target: { value: "generation-ix" } },
    )
    fireEvent.change(screen.getByRole("combobox", { name: "Legendary" }), {
      target: { value: "no" },
    })
    fireEvent.change(screen.getByRole("combobox", { name: "Mythical" }), {
      target: { value: "yes" },
    })
    fireEvent.change(minimumBaseExperience, { target: { value: "120" } })
    fireEvent.change(screen.getByRole("combobox", { name: "Server sort" }), {
      target: { value: "baseExperience" },
    })
    fireEvent.change(screen.getByRole("combobox", { name: "Result limit" }), {
      target: { value: "100" },
    })
    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(
      await screen.findByText(
        "No Pokémon matched this GraphQL research query.",
      ),
    ).toBeVisible()
    expect(requestCount).toBe(1)
  })
})
