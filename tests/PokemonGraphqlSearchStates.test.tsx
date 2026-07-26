import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ApplicationProviders from "@/app/providers"
import PokemonGraphqlSearch from "@/components/PokemonGraphqlSearch"

const mockQueryState = vi.hoisted(() => ({
  data: undefined,
  error: null as Error | null,
  isError: false,
  isFetching: false,
  isPending: false,
  refetch: vi.fn(),
}))

vi.mock("@/graphql/pokemonSearch.generated", () => ({
  useAdvancedPokemonSearchQuery: () => mockQueryState,
}))

function renderPokemonGraphqlSearch() {
  return render(
    <ApplicationProviders>
      <PokemonGraphqlSearch />
    </ApplicationProviders>,
  )
}

describe("PokemonGraphqlSearch state fallbacks", () => {
  beforeEach(() => {
    mockQueryState.data = undefined
    mockQueryState.error = null
    mockQueryState.isError = false
    mockQueryState.isFetching = false
    mockQueryState.isPending = false
    mockQueryState.refetch.mockReset()
  })

  it("uses the stable service fallback when an error has no message", async () => {
    mockQueryState.isError = true

    renderPokemonGraphqlSearch()
    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The research service rejected the request.",
    )
  })

  it("renders an empty result state when a successful query has no data", async () => {
    renderPokemonGraphqlSearch()
    fireEvent.click(screen.getByRole("button", { name: "GraphQL Search" }))

    expect(
      await screen.findByText("No Pokémon matched this GraphQL research query."),
    ).toBeVisible()
  })
})
