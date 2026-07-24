import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type UIEvent,
} from "react"
import PokemonCatalogEntries from "@/components/PokemonCatalogEntries"
import useProgressivePokemonCatalog from "@/hooks/useProgressivePokemonCatalog"
import type { PokemonCatalogEntry } from "@/types/pokemon"

const POKEMON_CATALOG_PRELOAD_DISTANCE_PIXELS = 800
const POKEMON_CATALOG_PRELOAD_EXPANSIONS_PER_GESTURE = 2
const POKEMON_CATALOG_WINDOW_PRELOAD_DISTANCE_PIXELS = 1_200

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
  const hasPreparedInitialBufferReference = useRef(false)
  const isExpansionPendingReference = useRef(false)
  const isRestoringScrollPositionReference = useRef(false)
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
  const handleBoundaryApproach = useCallback(() => {
    const navigation = navigationReference.current
    const firstVisiblePokemon = visiblePokemons[0]
    const expansionDirections: Array<"before" | "after" | "both"> = []

    if (
      !navigation ||
      !firstVisiblePokemon ||
      isExpansionPendingReference.current ||
      (!canExpandBefore && !canExpandAfter)
    )
      return

    const remainingScrollDistance =
      navigation.scrollHeight - navigation.clientHeight - navigation.scrollTop
    const isNearTop =
      navigation.scrollTop <= POKEMON_CATALOG_PRELOAD_DISTANCE_PIXELS
    const isNearBottom =
      remainingScrollDistance <= POKEMON_CATALOG_PRELOAD_DISTANCE_PIXELS

    if (!isNearTop && !isNearBottom) return

    if (isNearTop && canExpandBefore) expansionDirections.push("before")
    if (isNearBottom && canExpandAfter) expansionDirections.push("after")

    if (
      isNearTop &&
      isNearBottom &&
      canExpandBefore &&
      canExpandAfter &&
      !expansionDirections.includes("both")
    )
      expansionDirections.push("both")

    const expansionDirection = expansionDirections.includes("both")
      ? "both"
      : expansionDirections.length > 0
        ? expansionDirections[0]
        : canExpandBefore
          ? "before"
          : "after"

    if (expansionDirection === "before" || expansionDirection === "both") {
      const anchor = navigation.querySelector<HTMLElement>(
        "[data-pokemon-id='" + firstVisiblePokemon.id + "']",
      )

      if (!anchor) return

      pendingPrependAnchorReference.current = {
        offsetTop: anchor.offsetTop,
        pokemonId: firstVisiblePokemon.id,
      }
    }

    isExpansionPendingReference.current = true
    expandVisibleRange(
      expansionDirection,
      POKEMON_CATALOG_PRELOAD_EXPANSIONS_PER_GESTURE,
    )
  }, [canExpandAfter, canExpandBefore, expandVisibleRange, visiblePokemons])
  const handleCatalogScroll = (event: UIEvent<HTMLElement>) => {
    if (isRestoringScrollPositionReference.current) return

    const navigation = event.currentTarget
    const remainingScrollDistance =
      navigation.scrollHeight - navigation.clientHeight - navigation.scrollTop

    if (
      navigation.scrollTop <= POKEMON_CATALOG_PRELOAD_DISTANCE_PIXELS ||
      remainingScrollDistance <= POKEMON_CATALOG_PRELOAD_DISTANCE_PIXELS
    )
      handleBoundaryApproach()
  }

  useEffect(() => {
    if (hasPreparedInitialBufferReference.current) return

    const animationFrame = window.requestAnimationFrame(() => {
      if (hasPreparedInitialBufferReference.current) return

      hasPreparedInitialBufferReference.current = true
      handleBoundaryApproach()
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [handleBoundaryApproach])

  useEffect(() => {
    const handleWindowScroll = () => {
      const navigation = navigationReference.current
      const beforeSentinel = beforeSentinelReference.current
      const afterSentinel = afterSentinelReference.current

      if (
        !navigation ||
        !beforeSentinel ||
        !afterSentinel ||
        navigation.scrollHeight > navigation.clientHeight
      )
        return

      const beforeBounds = beforeSentinel.getBoundingClientRect()
      const afterBounds = afterSentinel.getBoundingClientRect()

      if (
        beforeBounds.bottom >=
          -POKEMON_CATALOG_WINDOW_PRELOAD_DISTANCE_PIXELS ||
        afterBounds.top <=
          window.innerHeight + POKEMON_CATALOG_WINDOW_PRELOAD_DISTANCE_PIXELS
      )
        handleBoundaryApproach()
    }

    window.addEventListener("scroll", handleWindowScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleWindowScroll)
    }
  }, [handleBoundaryApproach])

  useLayoutEffect(() => {
    const navigation = navigationReference.current
    const pendingAnchor = pendingPrependAnchorReference.current

    isExpansionPendingReference.current = false

    if (!navigation || !pendingAnchor) return

    const anchor = navigation.querySelector<HTMLElement>(
      "[data-pokemon-id='" + pendingAnchor.pokemonId + "']",
    )

    if (anchor) {
      const restoredScrollTop =
        navigation.scrollTop + anchor.offsetTop - pendingAnchor.offsetTop

      if (restoredScrollTop !== navigation.scrollTop) {
        isRestoringScrollPositionReference.current = true
        navigation.scrollTop = restoredScrollTop
        window.requestAnimationFrame(() => {
          isRestoringScrollPositionReference.current = false
        })
      }
    }

    pendingPrependAnchorReference.current = null
  }, [visiblePokemons.length])

  useLayoutEffect(() => {
    const navigation = navigationReference.current

    if (!navigation || hasPositionedCurrentPokemonReference.current) return

    const currentPokemon = navigation.querySelector<HTMLElement>(
      "[data-pokemon-id='" + currentPokemonId + "']",
    )

    if (!currentPokemon) return

    const centeredScrollTop =
      currentPokemon.offsetTop -
      (navigation.clientHeight - currentPokemon.offsetHeight) / 2

    if (centeredScrollTop !== navigation.scrollTop) {
      isRestoringScrollPositionReference.current = true
      navigation.scrollTop = centeredScrollTop
      window.requestAnimationFrame(() => {
        isRestoringScrollPositionReference.current = false
      })
    }

    hasPositionedCurrentPokemonReference.current = true
  }, [currentPokemonId, visiblePokemons.length])

  return (
    <nav
      ref={navigationReference}
      aria-label="Pokémon catalog"
      onScroll={handleCatalogScroll}
      className="md:min-h-0 md:flex-1 md:overflow-y-auto"
    >
      <div
        ref={beforeSentinelReference}
        aria-hidden="true"
        className="h-px w-full"
      />
      <PokemonCatalogEntries
        currentPokemonId={currentPokemonId}
        pokemons={visiblePokemons}
      />
      <div
        ref={afterSentinelReference}
        aria-hidden="true"
        className="h-px w-full"
      />
    </nav>
  )
}
