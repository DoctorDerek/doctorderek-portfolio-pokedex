import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { graphql, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import PokemonCatalog from "@/components/PokemonCatalog"
import { POKEMON_CATALOG_FIXTURES } from "@/tests/fixtures/pokemon"
import { pokemonApiServer } from "@/tests/mocks/pokemonApiServer"
import { GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"
import { MAX_POKEMON_NUMBER } from "@/utils/pokemonCatalog"

function renderPokemonCatalog({
  initialPokemonCount = 1,
}: {
  initialPokemonCount?: number
} = {}) {
  const queryClient = new QueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <PokemonCatalog
        initialPokemons={POKEMON_CATALOG_FIXTURES.slice(0, initialPokemonCount)}
        currentPokemonNumber="001"
      />
    </QueryClientProvider>,
  )
}

function mockCompleteCatalogResponse() {
  pokemonApiServer.use(
    graphql
      .link(GRAPHQL_API_ENDPOINT)
      .query("PokemonCatalog", ({ variables }) => {
        expect(variables).toEqual({ first: MAX_POKEMON_NUMBER })

        return HttpResponse.json({
          data: { pokemons: POKEMON_CATALOG_FIXTURES },
        })
      }),
  )
}

describe("PokemonCatalog", () => {
  it("keeps initial navigation usable while loading the complete catalog", async () => {
    mockCompleteCatalogResponse()
    renderPokemonCatalog()

    const pokemonNavigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    const currentPokemonLink = within(pokemonNavigation).getByRole("link", {
      name: "001 Bulbasaur",
    })

    expect(currentPokemonLink).toHaveAttribute("aria-current", "page")
    expect(currentPokemonLink).toHaveAttribute("href", "/1")
    expect(
      screen.queryByRole("navigation", { name: "Pokémon catalog pages" }),
    ).not.toBeInTheDocument()

    const nextPokemonLink = await within(pokemonNavigation).findByRole("link", {
      name: "002 Ivysaur",
    })
    expect(nextPokemonLink).not.toHaveAttribute("aria-current")
    expect(nextPokemonLink).toHaveAttribute("href", "/2")
    expect(screen.getByRole("status")).toHaveTextContent(
      `2 of ${MAX_POKEMON_NUMBER} Pokémon ready.`,
    )
  })

  it("preserves ready Pokémon and offers recovery when background loading fails", async () => {
    pokemonApiServer.use(
      graphql.link(GRAPHQL_API_ENDPOINT).query("PokemonCatalog", () =>
        HttpResponse.json({
          errors: [{ message: "Pokémon registry unavailable." }],
        }),
      ),
    )
    renderPokemonCatalog({ initialPokemonCount: 2 })

    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent(
      `Couldn’t finish loading all ${MAX_POKEMON_NUMBER} Pokémon. Showing 2 ready.`,
    )
    expect(
      screen.getByRole("link", { name: "001 Bulbasaur" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "002 Ivysaur" }),
    ).toBeInTheDocument()

    mockCompleteCatalogResponse()
    fireEvent.click(within(alert).getByRole("button", { name: "Retry" }))

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    })
    expect(screen.getByRole("status")).toHaveTextContent(
      `2 of ${MAX_POKEMON_NUMBER} Pokémon ready.`,
    )
  })
})
