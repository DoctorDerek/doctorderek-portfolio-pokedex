import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
import { BULBASAUR_DOSSIER_FIXTURE } from "@/tests/fixtures/pokedex"

describe("PokemonDetailsPanel", () => {
  it("presents canonical identity, base stats, and abilities", () => {
    render(<PokemonDetailsPanel pokemon={BULBASAUR_DOSSIER_FIXTURE} />)

    const selectedPokemonRegion = screen.getByRole("region", {
      name: "Bulbasaur #0001",
    })

    expect(
      within(selectedPokemonRegion).getByRole("heading", {
        level: 2,
        name: "Bulbasaur #0001",
      }),
    ).toBeInTheDocument()
    expect(within(selectedPokemonRegion).getByText("Category")).toBeVisible()
    expect(
      within(selectedPokemonRegion).getByText("“Seed Pokémon”"),
    ).toBeVisible()
    expect(
      within(selectedPokemonRegion).getByText("Grass, Poison"),
    ).toBeVisible()
    expect(
      within(selectedPokemonRegion).getByText("Overgrow, Chlorophyll (Hidden)"),
    ).toBeVisible()
    expect(within(selectedPokemonRegion).getAllByRole("term")).toHaveLength(10)
    expect(
      within(selectedPokemonRegion).getAllByRole("definition"),
    ).toHaveLength(10)
  })

  it("omits unavailable physical and experience measurements", () => {
    render(
      <PokemonDetailsPanel
        pokemon={{
          ...BULBASAUR_DOSSIER_FIXTURE,
          baseExperience: null,
          heightInMeters: null,
          weightInKilograms: null,
        }}
      />,
    )

    expect(
      screen.queryByTitle("The canonical height of this Pokémon"),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTitle("The canonical weight of this Pokémon"),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTitle("The base experience awarded by this Pokémon"),
    ).not.toBeInTheDocument()
  })
})
