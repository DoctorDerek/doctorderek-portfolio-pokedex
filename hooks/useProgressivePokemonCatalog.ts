import { useCallback, useState } from "react"
import type { PokemonCatalogEntry } from "@/types/pokemon"
import {
  expandPokemonCatalogRange,
  getContextualPokemonCatalogRange,
  getPokemonCatalogEntriesInRange,
  type PokemonCatalogExpansionDirection,
  type PokemonCatalogRange,
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
    (direction: PokemonCatalogExpansionDirection, expansionMultiplier = 1) => {
      if (!enabled) return

      const safeExpansionMultiplier = Math.max(
        1,
        Math.floor(expansionMultiplier),
      )

      setVisibleRange((currentRange) =>
        Array.from<PokemonCatalogRange>({
          length: safeExpansionMultiplier,
        }).reduce((range) => {
          return expandPokemonCatalogRange({
            direction,
            pokemonCount: pokemons.length,
            range,
          })
        }, currentRange),
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
