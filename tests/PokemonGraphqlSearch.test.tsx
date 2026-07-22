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
    ).toHaveAttribute("href", "/25")
    expect(requestCount).toBe(1)

    fireEvent.click(submitSearch)

    expect(requestCount).toBe(1)

    fireEvent.change(pokemonName, { target: { value: "Eevee" } })

    expect(screen.getByRole("link", { name: /Pikachu/ })).toBeVisible()
    expect(requestCount).toBe(1)

    fireEvent.click(submitSearch)

    expect(await screen.findByRole("link", { name: /Eevee/ })).toHaveAttribute(
      "href",
      "/133",
    )
    await waitFor(() => expect(requestCount).toBe(2))

    fireEvent.change(pokemonName, { target: { value: "Pikachu" } })
    fireEvent.click(submitSearch)

    expect(await screen.findByRole("link", { name: /Pikachu/ })).toBeVisible()
    expect(requestCount).toBe(2)
  })
})
