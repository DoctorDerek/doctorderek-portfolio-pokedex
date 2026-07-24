import { fireEvent, render, screen, within } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ProgressivePokemonCatalogList from "@/components/ProgressivePokemonCatalogList"
import { POKEMON_CATALOG } from "@/data/pokemonCatalog"

vi.mock("@/components/PokemonImage", () => ({
  default: () => <span aria-hidden="true" />,
}))

function getRenderedPokemonHrefs() {
  const navigation = screen.getByRole("navigation", {
    name: "Pokémon catalog",
  })

  return within(navigation)
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"))
}

function approachCatalogBoundary(scrollTop = 0) {
  const navigation = screen.getByRole("navigation", {
    name: "Pokémon catalog",
  })

  Object.defineProperties(navigation, {
    clientHeight: { configurable: true, value: 200 },
    scrollHeight: { configurable: true, value: 2_000 },
  })
  navigation.scrollTop = scrollTop
  fireEvent.scroll(navigation)
}

describe("ProgressivePokemonCatalogList", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1)
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("server-renders only the selected 21-entry context", () => {
    const serverMarkup = renderToStaticMarkup(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )
    const serverDocument = new DOMParser().parseFromString(
      serverMarkup,
      "text/html",
    )
    const serverPokemonLinks = serverDocument.querySelectorAll(
      "[data-pokemon-id] a",
    )

    expect(serverPokemonLinks).toHaveLength(21)
    expect(serverPokemonLinks.item(0)).toHaveAttribute("href", "/490")
    expect(serverPokemonLinks.item(20)).toHaveAttribute("href", "/510")
  })

  it("repeatedly prepares more local entries in both directions", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")

    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    expect(getRenderedPokemonHrefs()).toHaveLength(21)
    expect(getRenderedPokemonHrefs().at(0)).toBe("/490")
    expect(getRenderedPokemonHrefs().at(-1)).toBe("/510")

    approachCatalogBoundary()

    expect(getRenderedPokemonHrefs()).toHaveLength(61)
    expect(getRenderedPokemonHrefs().at(0)).toBe("/450")
    expect(getRenderedPokemonHrefs().at(-1)).toBe("/510")

    approachCatalogBoundary()

    expect(getRenderedPokemonHrefs()).toHaveLength(101)
    expect(getRenderedPokemonHrefs().at(0)).toBe("/410")
    expect(getRenderedPokemonHrefs().at(-1)).toBe("/510")
    expect(fetchSpy).not.toHaveBeenCalled()

    fetchSpy.mockRestore()
  })

  it.each([
    {
      currentPokemonId: 1,
      expectedFirstHref: "/1",
      expectedLastHref: "/61",
    },
    {
      currentPokemonId: 1_025,
      expectedFirstHref: "/965",
      expectedLastHref: "/1025",
    },
  ])(
    "expands route $currentPokemonId only toward available entries",
    ({ currentPokemonId, expectedFirstHref, expectedLastHref }) => {
      render(
        <ProgressivePokemonCatalogList
          currentPokemonId={currentPokemonId}
          pokemons={POKEMON_CATALOG}
        />,
      )

      approachCatalogBoundary()

      expect(getRenderedPokemonHrefs()).toHaveLength(61)
      expect(getRenderedPokemonHrefs().at(0)).toBe(expectedFirstHref)
      expect(getRenderedPokemonHrefs().at(-1)).toBe(expectedLastHref)
    },
  )

  it("preserves the visible anchor when local entries are prepended", () => {
    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const navigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    const originalFirstPokemon = navigation.querySelector<HTMLElement>(
      "[data-pokemon-id='490']",
    )

    if (!originalFirstPokemon)
      throw new Error("The original catalog anchor is unavailable.")

    Object.defineProperty(originalFirstPokemon, "offsetTop", {
      configurable: true,
      get: () =>
        navigation.querySelectorAll("[data-pokemon-id]").length > 21
          ? 740
          : 100,
    })
    approachCatalogBoundary(50)

    expect(navigation.scrollTop).toBe(690)
  })
})
