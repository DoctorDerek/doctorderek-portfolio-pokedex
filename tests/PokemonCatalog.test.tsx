import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokemonCatalog from "@/components/PokemonCatalog"
import { MAX_POKEMON_NUMBER } from "@/data/pokemonCatalog"

function renderPokemonCatalog() {
  return render(<PokemonCatalog currentPokemonId={1} />)
}

function getPokemonNavigation() {
  return screen.getByRole("navigation", { name: "Pokémon catalog" })
}

describe("PokemonCatalog", () => {
  it("presents a nearby default window without loading states", () => {
    renderPokemonCatalog()

    const pokemonNavigation = getPokemonNavigation()
    const currentPokemonLink = within(pokemonNavigation).getByRole("link", {
      name: "0001 Bulbasaur",
    })

    expect(currentPokemonLink).toHaveAttribute("aria-current", "page")
    expect(currentPokemonLink).toHaveAttribute("href", "/pokemon/1")
    expect(
      within(pokemonNavigation).getByRole("link", { name: "0002 Ivysaur" }),
    ).toHaveAttribute("href", "/pokemon/2")
    expect(within(pokemonNavigation).getAllByRole("link")).toHaveLength(21)
    expect(
      within(pokemonNavigation).getByRole("link", { name: "0021 Spearow" }),
    ).toHaveAttribute("href", "/pokemon/21")
    expect(
      within(pokemonNavigation).queryByRole("link", {
        name: "1025 Pecharunt",
      }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent(
      `21 nearby initially · ${MAX_POKEMON_NUMBER.toLocaleString("en-US")} ready locally.`,
    )
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(
      screen.queryByRole("navigation", { name: "Pokémon catalog pages" }),
    ).not.toBeInTheDocument()
  })

  it.each([
    {
      currentPokemonId: 500,
      firstHref: "/pokemon/490",
      lastHref: "/pokemon/510",
    },
    {
      currentPokemonId: 1_025,
      firstHref: "/pokemon/1005",
      lastHref: "/pokemon/1025",
    },
  ])(
    "keeps route $currentPokemonId inside a stable contextual window",
    ({ currentPokemonId, firstHref, lastHref }) => {
      render(<PokemonCatalog currentPokemonId={currentPokemonId} />)

      const pokemonNavigation = getPokemonNavigation()
      const pokemonLinks = within(pokemonNavigation).getAllByRole("link")

      expect(pokemonLinks).toHaveLength(21)
      expect(pokemonLinks.at(0)).toHaveAttribute("href", firstHref)
      expect(pokemonLinks.at(-1)).toHaveAttribute("href", lastHref)
      expect(
        within(pokemonNavigation).getByRole("link", { current: "page" }),
      ).toHaveAttribute("href", `/pokemon/${currentPokemonId}`)
    },
  )

  it("searches by name and number while filtering by Pokémon type", () => {
    renderPokemonCatalog()

    const pokemonSearch = screen.getByRole("searchbox", {
      name: "Search Pokémon",
    })
    const pokemonType = screen.getByRole("combobox", { name: "Type" })

    fireEvent.change(pokemonSearch, { target: { value: "saur" } })

    expect(
      within(getPokemonNavigation()).getByRole("link", {
        name: "0001 Bulbasaur",
      }),
    ).toBeInTheDocument()
    expect(
      within(getPokemonNavigation()).getByRole("link", {
        name: "0002 Ivysaur",
      }),
    ).toBeInTheDocument()
    expect(
      within(getPokemonNavigation()).queryByRole("link", {
        name: "0004 Charmander",
      }),
    ).not.toBeInTheDocument()

    fireEvent.change(pokemonSearch, { target: { value: "#0004" } })

    expect(
      within(getPokemonNavigation()).getByRole("link", {
        name: "0004 Charmander",
      }),
    ).toBeInTheDocument()
    expect(within(getPokemonNavigation()).getAllByRole("link")).toHaveLength(1)

    fireEvent.change(pokemonSearch, { target: { value: "" } })
    fireEvent.change(pokemonType, { target: { value: "Fire" } })

    expect(
      within(getPokemonNavigation()).getByRole("link", {
        name: "0004 Charmander",
      }),
    ).toBeInTheDocument()
    expect(
      within(getPokemonNavigation()).queryByRole("link", {
        name: "0001 Bulbasaur",
      }),
    ).not.toBeInTheDocument()
  })

  it("sorts the canonical catalog and resets every discovery control", () => {
    renderPokemonCatalog()

    const pokemonSearch = screen.getByRole("searchbox", {
      name: "Search Pokémon",
    })
    const pokemonType = screen.getByRole("combobox", { name: "Type" })
    const pokemonSort = screen.getByRole("combobox", { name: "Sort" })

    fireEvent.change(pokemonSort, { target: { value: "baseStatTotal" } })

    expect(
      within(getPokemonNavigation())
        .getAllByRole("link")
        .slice(0, 3)
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/pokemon/493", "/pokemon/890", "/pokemon/150"])

    fireEvent.change(pokemonSearch, { target: { value: "MissingNo" } })
    fireEvent.change(pokemonType, { target: { value: "Fire" } })

    expect(
      within(getPokemonNavigation()).getByText(
        "No Pokémon match these filters.",
      ),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }))

    expect(pokemonSearch).toHaveValue("")
    expect(pokemonType).toHaveValue("all")
    expect(pokemonSort).toHaveValue("nationalNumber")
    const resetPokemonLinks = within(getPokemonNavigation()).getAllByRole(
      "link",
    )

    expect(resetPokemonLinks).toHaveLength(21)
    expect(resetPokemonLinks.at(0)).toHaveAttribute("href", "/pokemon/1")
    expect(screen.getByRole("status")).toHaveTextContent(
      "21 nearby initially · 1,025 ready locally.",
    )
  })

  it("keeps catalog form submission local", () => {
    renderPokemonCatalog()

    expect(() =>
      fireEvent.submit(
        screen.getByRole("search", {
          name: "Pokémon catalog discovery",
        }),
      ),
    ).not.toThrow()
  })
})
