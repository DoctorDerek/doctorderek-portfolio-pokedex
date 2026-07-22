import { useCallback, useState } from "react"
import type { PokemonCatalogEntry } from "@/types/pokemon"
import {
  expandPokemonCatalogRange,
  getContextualPokemonCatalogRange,
  getPokemonCatalogEntriesInRange,
  type PokemonCatalogExpansionDirection,
} from "@/utils/pokemonCatalog"

export default function useProgressivePokemonCatalog({
  currentPokemonId,
  enabled,
  pokemons,
}: {
  currentPokemonId: number
  enabled: boolean
  pokemons: ReadonlyArray<PokemonCatalogEntry>
}) {
  const [visibleRange, setVisibleRange] = useState(() =>
    getContextualPokemonCatalogRange({ currentPokemonId, pokemons }),
  )
  const expandVisibleRange = useCallback(
    (direction: PokemonCatalogExpansionDirection) => {
      if (!enabled) return

      setVisibleRange((currentRange) =>
        expandPokemonCatalogRange({
          direction,
          pokemonCount: pokemons.length,
          range: currentRange,
        }),
      )
    },
    [enabled, pokemons.length],
  )

  return {
    canExpandAfter: enabled && visibleRange.endIndex < pokemons.length,
    canExpandBefore: enabled && visibleRange.startIndex > 0,
    expandVisibleRange,
    visiblePokemons: enabled
      ? getPokemonCatalogEntriesInRange({
          pokemons,
          range: visibleRange,
        })
      : pokemons,
  }
}
