import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import PokemonCatalogEntries from "@/components/PokemonCatalogEntries"
import useProgressivePokemonCatalog from "@/hooks/useProgressivePokemonCatalog"
import type { PokemonCatalogEntry } from "@/types/pokemon"

const POKEMON_CATALOG_PRELOAD_ROOT_MARGIN = "1600px 0px"

export default function ProgressivePokemonCatalogList({
  currentPokemonId,
  pokemons,
}: {
  currentPokemonId: number
  pokemons: ReadonlyArray<PokemonCatalogEntry>
}) {
  const navigationReference = useRef<HTMLElement>(null)
  const beforeSentinelReference = useRef<HTMLDivElement>(null)
  const afterSentinelReference = useRef<HTMLDivElement>(null)
  const pendingPrependAnchorReference = useRef<{
    offsetTop: number
    pokemonId: number
  } | null>(null)
  const hasPositionedCurrentPokemonReference = useRef(false)
  const {
    canExpandAfter,
    canExpandBefore,
    expandVisibleRange,
    visiblePokemons,
  } = useProgressivePokemonCatalog({
    currentPokemonId,
    enabled: true,
    pokemons,
  })
  const handleBeforeSentinelIntersection = useCallback(() => {
    const navigation = navigationReference.current
    const firstVisiblePokemon = visiblePokemons[0]

    if (!navigation || !firstVisiblePokemon) return

    const anchor = navigation.querySelector<HTMLElement>(
      "[data-pokemon-id='" + firstVisiblePokemon.id + "']",
    )

    if (!anchor) return

    pendingPrependAnchorReference.current = {
      offsetTop: anchor.offsetTop,
      pokemonId: firstVisiblePokemon.id,
    }
    expandVisibleRange("before")
  }, [expandVisibleRange, visiblePokemons])
  const handleAfterSentinelIntersection = useCallback(() => {
    expandVisibleRange("after")
  }, [expandVisibleRange])

  useEffect(() => {
    const navigation = navigationReference.current
    const beforeSentinel = beforeSentinelReference.current
    const afterSentinel = afterSentinelReference.current

    if (!navigation) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (entry.target === beforeSentinel && canExpandBefore)
            handleBeforeSentinelIntersection()
          if (entry.target === afterSentinel && canExpandAfter)
            handleAfterSentinelIntersection()
        }
      },
      {
        root: navigation,
        rootMargin: POKEMON_CATALOG_PRELOAD_ROOT_MARGIN,
      },
    )

    if (beforeSentinel && canExpandBefore) observer.observe(beforeSentinel)
    if (afterSentinel && canExpandAfter) observer.observe(afterSentinel)

    return () => {
      observer.disconnect()
    }
  }, [
    canExpandAfter,
    canExpandBefore,
    handleAfterSentinelIntersection,
    handleBeforeSentinelIntersection,
  ])

  useLayoutEffect(() => {
    const navigation = navigationReference.current
    const pendingAnchor = pendingPrependAnchorReference.current

    if (!navigation || !pendingAnchor) return

    const anchor = navigation.querySelector<HTMLElement>(
      "[data-pokemon-id='" + pendingAnchor.pokemonId + "']",
    )

    if (anchor)
      navigation.scrollTop += anchor.offsetTop - pendingAnchor.offsetTop

    pendingPrependAnchorReference.current = null
  }, [visiblePokemons.length])

  useLayoutEffect(() => {
    const navigation = navigationReference.current

    if (!navigation || hasPositionedCurrentPokemonReference.current) return

    const currentPokemon = navigation.querySelector<HTMLElement>(
      "[data-pokemon-id='" + currentPokemonId + "']",
    )

    if (!currentPokemon) return

    navigation.scrollTop =
      currentPokemon.offsetTop -
      (navigation.clientHeight - currentPokemon.offsetHeight) / 2
    hasPositionedCurrentPokemonReference.current = true
  }, [currentPokemonId, visiblePokemons.length])

  return (
    <nav
      ref={navigationReference}
      aria-label="Pokémon catalog"
      className="md:min-h-0 md:flex-1 md:overflow-y-auto"
    >
      <div ref={beforeSentinelReference} aria-hidden="true" />
      <PokemonCatalogEntries
        currentPokemonId={currentPokemonId}
        pokemons={visiblePokemons}
      />
      <div ref={afterSentinelReference} aria-hidden="true" />
    </nav>
  )
}
