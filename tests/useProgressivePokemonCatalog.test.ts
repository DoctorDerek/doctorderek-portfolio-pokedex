import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import useProgressivePokemonCatalog from "@/hooks/useProgressivePokemonCatalog"
import { POKEMON_CATALOG } from "@/data/pokemonCatalog"

describe("useProgressivePokemonCatalog", () => {
  it("returns the full catalog and ignores expansion when disabled", () => {
    const { result } = renderHook(() =>
      useProgressivePokemonCatalog({
        currentPokemonId: 500,
        enabled: false,
        pokemons: POKEMON_CATALOG,
      }),
    )

    expect(result.current.visiblePokemons).toHaveLength(POKEMON_CATALOG.length)
    expect(result.current.canExpandBefore).toBe(false)
    expect(result.current.canExpandAfter).toBe(false)

    act(() => {
      result.current.expandVisibleRange("both", 2)
    })

    expect(result.current.visiblePokemons).toHaveLength(POKEMON_CATALOG.length)
  })
})
