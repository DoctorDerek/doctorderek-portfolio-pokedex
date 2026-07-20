import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
import { BULBASAUR_FIXTURE } from "@/tests/fixtures/pokemon"

describe("PokemonDetailsPanel", () => {
  it("presents the selected Pokémon as a labeled statistics region", () => {
    render(
      <PokemonDetailsPanel pokemon={{ ...BULBASAUR_FIXTURE, image: null }} />,
    )

    const selectedPokemonRegion = screen.getByRole("region", {
      name: "Bulbasaur #001",
    })

    expect(
      within(selectedPokemonRegion).getByRole("heading", {
        level: 2,
        name: "Bulbasaur #001",
      }),
    ).toBeInTheDocument()
    expect(
      within(selectedPokemonRegion).getByText("Classification"),
    ).toBeInTheDocument()
    expect(
      within(selectedPokemonRegion).getByText("“Seed Pokémon”"),
    ).toBeInTheDocument()
    expect(within(selectedPokemonRegion).getAllByRole("term")).toHaveLength(9)
    expect(
      within(selectedPokemonRegion).getAllByRole("definition"),
    ).toHaveLength(9)
    expect(
      within(selectedPokemonRegion).getByText("Grass, Poison"),
    ).toBeInTheDocument()
    expect(
      within(selectedPokemonRegion).getByText("Fire, Ice, Flying, Psychic"),
    ).toBeInTheDocument()
  })

  it("formats fractional flee rates without floating-point artifacts", () => {
    render(
      <PokemonDetailsPanel
        pokemon={{ ...BULBASAUR_FIXTURE, fleeRate: 0.07, image: null }}
      />,
    )

    const fleeRateStatistic = screen.getByTitle("The flee rate of this Pokémon")

    expect(within(fleeRateStatistic).getByRole("definition")).toHaveTextContent(
      "7%",
    )
  })
})
