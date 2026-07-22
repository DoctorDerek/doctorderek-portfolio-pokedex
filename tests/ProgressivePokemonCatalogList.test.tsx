import { act, render, screen, within } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ProgressivePokemonCatalogList from "@/components/ProgressivePokemonCatalogList"
import { POKEMON_CATALOG } from "@/data/pokemonCatalog"
import {
  installIntersectionObserverMock,
  restoreIntersectionObserverMock,
  triggerLatestIntersectionObserver,
} from "@/tests/mocks/intersectionObserver"

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

describe("ProgressivePokemonCatalogList", () => {
  beforeEach(() => {
    installIntersectionObserverMock()
  })

  afterEach(() => {
    restoreIntersectionObserverMock()
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

    act(() => {
      triggerLatestIntersectionObserver()
    })

    expect(getRenderedPokemonHrefs()).toHaveLength(41)
    expect(getRenderedPokemonHrefs().at(0)).toBe("/480")
    expect(getRenderedPokemonHrefs().at(-1)).toBe("/520")

    act(() => {
      triggerLatestIntersectionObserver()
    })

    expect(getRenderedPokemonHrefs()).toHaveLength(61)
    expect(getRenderedPokemonHrefs().at(0)).toBe("/470")
    expect(getRenderedPokemonHrefs().at(-1)).toBe("/530")
    expect(fetchSpy).not.toHaveBeenCalled()

    fetchSpy.mockRestore()
  })

  it.each([
    {
      currentPokemonId: 1,
      expectedFirstHref: "/1",
      expectedLastHref: "/31",
    },
    {
      currentPokemonId: 1_025,
      expectedFirstHref: "/995",
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

      act(() => {
        triggerLatestIntersectionObserver()
      })

      expect(getRenderedPokemonHrefs()).toHaveLength(31)
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
    navigation.scrollTop = 50

    act(() => {
      triggerLatestIntersectionObserver()
    })

    expect(navigation.scrollTop).toBe(690)
  })
})
