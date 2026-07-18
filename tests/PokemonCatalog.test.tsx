import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokemonCatalog from "@/components/PokemonCatalog"
import { POKEMON_CATALOG_FIXTURES } from "@/tests/fixtures/pokemon"

describe("PokemonCatalog", () => {
  it("exposes the selected Pokémon and catalog page through navigation semantics", () => {
    render(
      <PokemonCatalog
        pokemons={POKEMON_CATALOG_FIXTURES}
        currentPokemonNumber="001"
        currentPageNumber={1}
      />,
    )

    const pokemonNavigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    const currentPokemonLink = within(pokemonNavigation).getByRole("link", {
      name: "001 Bulbasaur",
    })
    const nextPokemonLink = within(pokemonNavigation).getByRole("link", {
      name: "002 Ivysaur",
    })

    expect(currentPokemonLink).toHaveAttribute("aria-current", "page")
    expect(currentPokemonLink).toHaveAttribute("href", "/1")
    expect(nextPokemonLink).not.toHaveAttribute("aria-current")
    expect(nextPokemonLink).toHaveAttribute("href", "/2")

    const pageNavigation = screen.getByRole("navigation", {
      name: "Pokémon catalog pages",
    })
    expect(
      within(pageNavigation).getByRole("link", { name: "1" }),
    ).toHaveAttribute("aria-current", "page")
    expect(
      within(pageNavigation).getByRole("link", { name: "Next" }),
    ).toHaveAttribute("href", "/11")
  })
})
