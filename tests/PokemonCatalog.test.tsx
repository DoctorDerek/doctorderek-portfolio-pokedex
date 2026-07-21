import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokemonCatalog from "@/components/PokemonCatalog"
import { MAX_POKEMON_NUMBER } from "@/data/pokemonCatalog"

function renderPokemonCatalog() {
  return render(<PokemonCatalog currentPokemonId={1} />)
}

describe("PokemonCatalog", () => {
  it("presents the complete prefetched catalog without loading states", () => {
    renderPokemonCatalog()

    const pokemonNavigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    const currentPokemonLink = within(pokemonNavigation).getByRole("link", {
      name: "0001 Bulbasaur",
    })

    expect(currentPokemonLink).toHaveAttribute("aria-current", "page")
    expect(currentPokemonLink).toHaveAttribute("href", "/1")
    expect(
      within(pokemonNavigation).getByRole("link", { name: "0002 Ivysaur" }),
    ).toHaveAttribute("href", "/2")
    expect(screen.getByRole("status")).toHaveTextContent(
      `${MAX_POKEMON_NUMBER} Pokémon ready · ${MAX_POKEMON_NUMBER} shown.`,
    )
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(
      screen.queryByRole("navigation", { name: "Pokémon catalog pages" }),
    ).not.toBeInTheDocument()
  })

  it("searches by name and number while filtering by Pokémon type", () => {
    renderPokemonCatalog()

    const pokemonNavigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    const pokemonSearch = screen.getByRole("searchbox", {
      name: "Search Pokémon",
    })
    const pokemonType = screen.getByRole("combobox", { name: "Type" })

    fireEvent.change(pokemonSearch, { target: { value: "saur" } })

    expect(
      within(pokemonNavigation).getByRole("link", {
        name: "0001 Bulbasaur",
      }),
    ).toBeInTheDocument()
    expect(
      within(pokemonNavigation).getByRole("link", { name: "0002 Ivysaur" }),
    ).toBeInTheDocument()
    expect(
      within(pokemonNavigation).queryByRole("link", {
        name: "0004 Charmander",
      }),
    ).not.toBeInTheDocument()

    fireEvent.change(pokemonSearch, { target: { value: "#0004" } })

    expect(
      within(pokemonNavigation).getByRole("link", {
        name: "0004 Charmander",
      }),
    ).toBeInTheDocument()
    expect(within(pokemonNavigation).getAllByRole("link")).toHaveLength(1)

    fireEvent.change(pokemonSearch, { target: { value: "" } })
    fireEvent.change(pokemonType, { target: { value: "Fire" } })

    expect(
      within(pokemonNavigation).getByRole("link", {
        name: "0004 Charmander",
      }),
    ).toBeInTheDocument()
    expect(
      within(pokemonNavigation).queryByRole("link", {
        name: "0001 Bulbasaur",
      }),
    ).not.toBeInTheDocument()
  })

  it("sorts the canonical catalog and resets every discovery control", () => {
    renderPokemonCatalog()

    const pokemonNavigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    const pokemonSearch = screen.getByRole("searchbox", {
      name: "Search Pokémon",
    })
    const pokemonType = screen.getByRole("combobox", { name: "Type" })
    const pokemonSort = screen.getByRole("combobox", { name: "Sort" })

    fireEvent.change(pokemonSort, { target: { value: "baseStatTotal" } })

    expect(
      within(pokemonNavigation)
        .getAllByRole("link")
        .slice(0, 3)
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/493", "/890", "/150"])

    fireEvent.change(pokemonSearch, { target: { value: "MissingNo" } })
    fireEvent.change(pokemonType, { target: { value: "Fire" } })

    expect(
      within(pokemonNavigation).getByText("No Pokémon match these filters."),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }))

    expect(pokemonSearch).toHaveValue("")
    expect(pokemonType).toHaveValue("all")
    expect(pokemonSort).toHaveValue("nationalNumber")
    expect(
      within(pokemonNavigation).getAllByRole("link").at(0),
    ).toHaveAttribute("href", "/1")
  })
})
