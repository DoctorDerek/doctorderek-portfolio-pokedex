import { render, screen } from "@testing-library/react"
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

    expect(
      screen.getByRole("region", { name: "Ivysaur #0002" }),
    ).toBeInTheDocument()
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
      screen.queryByRole("region", { name: "Pokémon discovery" }),
    ).not.toBeInTheDocument()
  })
})
