import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokedexPageContent from "@/components/PokedexPageContent"
import { IVYSAUR_DOSSIER_FIXTURE } from "@/tests/fixtures/pokedex"

describe("PokedexPageContent", () => {
  it("presents a canonical dossier inside the complete static catalog", () => {
    render(<PokedexPageContent id="2" pokemon={IVYSAUR_DOSSIER_FIXTURE} />)

    expect(
      screen.getByRole("region", { name: "Ivysaur #0002" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "0002 Ivysaur" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(
      screen.getByRole("link", { name: "1025 Pecharunt" }),
    ).toBeInTheDocument()
  })

  it("reports a missing selected Pokémon without rendering an empty shell", () => {
    render(<PokedexPageContent id="1026" pokemon={undefined} />)

    expect(screen.getByText("Sorry, Pokémon #1026 not found 😔.")).toBeVisible()
    expect(
      screen.queryByRole("region", { name: "Pokémon discovery" }),
    ).not.toBeInTheDocument()
  })
})
