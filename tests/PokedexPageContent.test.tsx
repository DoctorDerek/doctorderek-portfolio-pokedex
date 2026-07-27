import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ApplicationProviders from "@/app/providers"
import PokedexPageContent from "@/components/PokedexPageContent"
import { IVYSAUR_DOSSIER_FIXTURE } from "@/tests/fixtures/pokedex"

function renderPokedexPageContent({
  id,
  pokemon,
}: {
  id: string
  pokemon: typeof IVYSAUR_DOSSIER_FIXTURE | undefined
}) {
  return render(
    <ApplicationProviders>
      <PokedexPageContent id={id} pokemon={pokemon} />
    </ApplicationProviders>,
  )
}

describe("PokedexPageContent", () => {
  it("presents a canonical dossier inside the complete static catalog", () => {
    renderPokedexPageContent({ id: "2", pokemon: IVYSAUR_DOSSIER_FIXTURE })

    const selectedPokemon = screen.getByRole("region", {
      name: "Ivysaur #0002",
    })
    const localPokedex = screen.getByRole("region", {
      name: "Local Pokédex",
    })
    const graphqlSearch = screen.getByRole("region", {
      name: "GraphQL Search",
    })
    const workspaceNavigation = screen.getByRole("navigation", {
      name: "Pokédex research workspace",
    })

    expect(selectedPokemon).toBeInTheDocument()
    expect(
      selectedPokemon.compareDocumentPosition(localPokedex) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(selectedPokemon).toHaveAttribute("id", "pokemon-dossier")
    expect(localPokedex).toHaveAttribute("id", "local-pokedex")
    expect(graphqlSearch).toHaveAttribute("id", "graphql-search")
    expect(
      within(workspaceNavigation).getByRole("link", { name: "Dossier" }),
    ).toHaveAttribute("href", "#pokemon-dossier")
    expect(
      within(workspaceNavigation).getByRole("link", {
        name: "Local Pokédex",
      }),
    ).toHaveAttribute("href", "#local-pokedex")
    expect(
      within(workspaceNavigation).getByRole("link", {
        name: "GraphQL Search",
      }),
    ).toHaveAttribute("href", "#graphql-search")
    expect(screen.getByRole("link", { name: "0002 Ivysaur" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByRole("link", { name: "0021 Spearow" })).toBeVisible()
    expect(
      screen.queryByRole("link", { name: "1025 Pecharunt" }),
    ).not.toBeInTheDocument()
  })

  it("reports a missing selected Pokémon without rendering an empty shell", () => {
    renderPokedexPageContent({ id: "1026", pokemon: undefined })

    expect(screen.getByText("Sorry, Pokémon #1026 not found 😔.")).toBeVisible()
    expect(
      screen.queryByRole("region", { name: "Local Pokédex" }),
    ).not.toBeInTheDocument()
  })
})
