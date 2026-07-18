import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
import type { Pokemon } from "@/graphql/generated"

const BULBASAUR: Pokemon = {
  classification: "Seed Pokémon",
  fleeRate: 0.1,
  height: { minimum: "0.61m", maximum: "0.79m" },
  id: "UG9rZW1vbjowMDE=",
  image: null,
  maxCP: 951,
  maxHP: 1071,
  name: "Bulbasaur",
  number: "001",
  resistant: ["Water", "Electric", "Grass", "Fighting", "Fairy"],
  types: ["Grass", "Poison"],
  weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
  weight: { minimum: "6.04kg", maximum: "7.76kg" },
}

describe("PokemonDetailsPanel", () => {
  it("presents the selected Pokémon as a labeled statistics region", () => {
    render(<PokemonDetailsPanel pokemon={BULBASAUR} />)

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
})
