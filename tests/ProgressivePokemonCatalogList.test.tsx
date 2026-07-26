import { act, fireEvent, render, screen, within } from "@testing-library/react"
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

function mockAnimationFrameQueue() {
  const animationFrameCallbacks: Array<FrameRequestCallback> = []

  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    animationFrameCallbacks.push(callback)
    return animationFrameCallbacks.length
  })

  return animationFrameCallbacks
}

function flushAnimationFrame(animationFrameCallbacks: Array<FrameRequestCallback>) {
  const callback = animationFrameCallbacks.shift()

  if (!callback) throw new Error("The expected animation frame is unavailable.")

  act(() => {
    callback(0)
  })
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

  it("prepares the initial bidirectional buffer after the browser frame", () => {
    const animationFrameCallbacks: Array<FrameRequestCallback> = []

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrameCallbacks.push(callback)
      return animationFrameCallbacks.length
    })

    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    expect(getRenderedPokemonHrefs()).toHaveLength(21)

    const initialBufferCallback = animationFrameCallbacks.shift()
    expect(initialBufferCallback).toBeDefined()

    act(() => {
      initialBufferCallback?.(0)
    })

    expect(getRenderedPokemonHrefs()).toHaveLength(61)
    expect(getRenderedPokemonHrefs().at(0)).toBe("/470")
    expect(getRenderedPokemonHrefs().at(-1)).toBe("/530")
  })

  it("ignores a repeated initial frame after the buffer is prepared", () => {
    const animationFrameCallbacks = mockAnimationFrameQueue()

    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const initialBufferCallback = animationFrameCallbacks.shift()
    expect(initialBufferCallback).toBeDefined()

    act(() => {
      initialBufferCallback?.(0)
      initialBufferCallback?.(0)
    })

    expect(getRenderedPokemonHrefs()).toHaveLength(61)
  })

  it("expands only toward the bottom when the lower boundary is approached", () => {
    const animationFrameCallbacks: Array<FrameRequestCallback> = []

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrameCallbacks.push(callback)
      return animationFrameCallbacks.length
    })

    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const initialBufferCallback = animationFrameCallbacks.shift()
    act(() => {
      initialBufferCallback?.(0)
    })

    approachCatalogBoundary(1_800)

    expect(getRenderedPokemonHrefs()).toHaveLength(101)
    expect(getRenderedPokemonHrefs().at(0)).toBe("/470")
    expect(getRenderedPokemonHrefs().at(-1)).toBe("/570")
  })

  it("ignores a reentrant boundary event while an expansion is pending", () => {
    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const navigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    Object.defineProperties(navigation, {
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 2_000 },
    })
    navigation.scrollTop = 0

    act(() => {
      navigation.dispatchEvent(new Event("scroll", { bubbles: true }))
      navigation.dispatchEvent(new Event("scroll", { bubbles: true }))
    })

    expect(getRenderedPokemonHrefs()).toHaveLength(61)
  })

  it("uses the window sentinel observer when the catalog has no internal overflow", () => {
    const animationFrameCallbacks: Array<FrameRequestCallback> = []

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrameCallbacks.push(callback)
      return animationFrameCallbacks.length
    })

    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const navigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    const beforeSentinel = navigation.firstElementChild
    const afterSentinel = navigation.lastElementChild

    if (!(beforeSentinel instanceof HTMLElement))
      throw new Error("The before sentinel is unavailable.")
    if (!(afterSentinel instanceof HTMLElement))
      throw new Error("The after sentinel is unavailable.")

    Object.defineProperties(navigation, {
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 200 },
    })
    vi.spyOn(beforeSentinel, "getBoundingClientRect").mockReturnValue({
      bottom: 0,
    } as DOMRect)
    vi.spyOn(afterSentinel, "getBoundingClientRect").mockReturnValue({
      top: 0,
    } as DOMRect)

    const initialBufferCallback = animationFrameCallbacks.shift()
    act(() => {
      initialBufferCallback?.(0)
    })
    fireEvent.scroll(window)

    expect(getRenderedPokemonHrefs()).toHaveLength(141)
  })

  it("does not expand after the initial frame is cancelled by unmounting", () => {
    const animationFrameCallbacks = mockAnimationFrameQueue()
    const { unmount } = render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const initialBufferCallback = animationFrameCallbacks.shift()
    expect(initialBufferCallback).toBeDefined()

    unmount()

    expect(() => {
      act(() => {
        initialBufferCallback?.(0)
      })
    }).not.toThrow()
  })

  it("keeps the local range stable when the scroll is away from both boundaries", () => {
    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    approachCatalogBoundary(900)

    expect(getRenderedPokemonHrefs()).toHaveLength(21)
  })

  it("keeps the local range stable when a prepend anchor is unavailable", () => {
    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const navigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    vi.spyOn(navigation, "querySelector").mockReturnValue(null)

    approachCatalogBoundary()

    expect(getRenderedPokemonHrefs()).toHaveLength(21)
  })

  it("ignores catalog scroll events while a prepend restoration is pending", () => {
    const animationFrameCallbacks = mockAnimationFrameQueue()

    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )
    animationFrameCallbacks.shift()

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
    fireEvent.scroll(navigation)
    flushAnimationFrame(animationFrameCallbacks)

    expect(getRenderedPokemonHrefs()).toHaveLength(61)
  })

  it("skips window sentinel work when the catalog already has internal overflow", () => {
    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const navigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    Object.defineProperties(navigation, {
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 2_000 },
    })

    fireEvent.scroll(window)

    expect(getRenderedPokemonHrefs()).toHaveLength(21)
  })

  it("ignores distant window sentinels", () => {
    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={500}
        pokemons={POKEMON_CATALOG}
      />,
    )

    const navigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    const beforeSentinel = navigation.firstElementChild
    const afterSentinel = navigation.lastElementChild

    if (!(beforeSentinel instanceof HTMLElement))
      throw new Error("The before sentinel is unavailable.")
    if (!(afterSentinel instanceof HTMLElement))
      throw new Error("The after sentinel is unavailable.")

    Object.defineProperties(navigation, {
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 200 },
    })
    vi.spyOn(beforeSentinel, "getBoundingClientRect").mockReturnValue({
      bottom: -3_000,
    } as DOMRect)
    vi.spyOn(afterSentinel, "getBoundingClientRect").mockReturnValue({
      top: 3_000,
    } as DOMRect)

    fireEvent.scroll(window)

    expect(getRenderedPokemonHrefs()).toHaveLength(21)
  })

  it("leaves the current position unchanged when the selected entry is absent", () => {
    render(
      <ProgressivePokemonCatalogList
        currentPokemonId={9_999}
        pokemons={POKEMON_CATALOG}
      />,
    )

    expect(getRenderedPokemonHrefs()).toHaveLength(21)
    expect(getRenderedPokemonHrefs()).not.toContain("/9999")
  })

  it("centers a newly selected entry when its geometry requires scrolling", () => {
    const animationFrameCallbacks = mockAnimationFrameQueue()
    const originalQuerySelector = HTMLElement.prototype.querySelector
    const querySelectorSpy = vi
      .spyOn(HTMLElement.prototype, "querySelector")
      .mockImplementation(function (selector) {
        if (
          this.getAttribute("aria-label") === "Pokémon catalog" &&
          selector === "[data-pokemon-id='1']"
        )
          return null

        return originalQuerySelector.call(this, selector)
      })

    const { rerender } = render(
      <ProgressivePokemonCatalogList
        currentPokemonId={1}
        pokemons={POKEMON_CATALOG}
      />,
    )
    querySelectorSpy.mockRestore()

    const navigation = screen.getByRole("navigation", {
      name: "Pokémon catalog",
    })
    Object.defineProperty(navigation, "clientHeight", {
      configurable: true,
      value: 200,
    })
    const newlySelectedPokemon = navigation.querySelector<HTMLElement>(
      "[data-pokemon-id='2']",
    )

    if (!newlySelectedPokemon)
      throw new Error("The newly selected catalog entry is unavailable.")

    Object.defineProperties(newlySelectedPokemon, {
      offsetHeight: { configurable: true, value: 40 },
      offsetTop: { configurable: true, value: 300 },
    })

    rerender(
      <ProgressivePokemonCatalogList
        currentPokemonId={2}
        pokemons={POKEMON_CATALOG}
      />,
    )

    expect(navigation.scrollTop).toBe(220)
    expect(animationFrameCallbacks.length).toBeGreaterThan(1)
    flushAnimationFrame(animationFrameCallbacks)
    flushAnimationFrame(animationFrameCallbacks)
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
