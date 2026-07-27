import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokemonDetailsPanel from "@/components/PokemonDetailsPanel"
import { BULBASAUR_DOSSIER_FIXTURE } from "@/tests/fixtures/pokedex"

describe("PokemonDetailsPanel", () => {
  it("presents canonical identity and complete dossier research indicators", () => {
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
    expect(within(selectedPokemonRegion).getByText("HP")).toBeVisible()
    expect(within(selectedPokemonRegion).getByText("Attack")).toBeVisible()
    expect(within(selectedPokemonRegion).getByText("Defense")).toBeVisible()
    expect(
      within(selectedPokemonRegion).getByText("Special Attack"),
    ).toBeVisible()
    expect(
      within(selectedPokemonRegion).getByText("Special Defense"),
    ).toBeVisible()
    expect(within(selectedPokemonRegion).getByText("Speed")).toBeVisible()
    expect(within(selectedPokemonRegion).getByText("Legendary")).toBeVisible()
    expect(within(selectedPokemonRegion).getByText("Mythical")).toBeVisible()
    expect(
      within(selectedPokemonRegion).getByText("Capture Rate"),
    ).toBeVisible()
    expect(
      within(selectedPokemonRegion).getByText("Base Happiness"),
    ).toBeVisible()
    expect(within(selectedPokemonRegion).getByText("Habitat")).toBeVisible()
    expect(within(selectedPokemonRegion).getByText("Shape")).toBeVisible()
    expect(within(selectedPokemonRegion).getByText("Color")).toBeVisible()
  })

  it("omits unavailable physical and experience measurements", () => {
    render(
      <PokemonDetailsPanel
        pokemon={{
          ...BULBASAUR_DOSSIER_FIXTURE,
          baseExperience: null,
          baseHappiness: null,
          heightInMeters: null,
          captureRate: null,
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
    expect(
      screen.queryByTitle("The base happiness tendency for this Pokémon"),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTitle("The catch success likelihood for this Pokémon"),
    ).not.toBeInTheDocument()
  })

  it("labels affirmative legendary and mythical classifications", () => {
    render(
      <PokemonDetailsPanel
        pokemon={{
          ...BULBASAUR_DOSSIER_FIXTURE,
          isLegendary: true,
          isMythical: true,
        }}
      />,
    )

    expect(
      within(
        screen.getByTitle(
          "Whether this Pokémon is officially marked as legendary",
        ),
      ).getByText("Yes"),
    ).toBeVisible()
    expect(
      within(
        screen.getByTitle(
          "Whether this Pokémon is officially marked as mythical",
        ),
      ).getByText("Yes"),
    ).toBeVisible()
  })
})
