import Link from "next/link"
import PokemonImage from "@/components/PokemonImage"
import type { PokemonCatalogEntry } from "@/types/pokemon"
import classNames from "@/utils/classNames"

export default function PokemonCatalogList({
  currentPokemonId,
  pokemons,
}: {
  currentPokemonId: number
  pokemons: ReadonlyArray<PokemonCatalogEntry>
}) {
  return (
    <nav
      aria-label="Pokémon catalog"
      className="md:min-h-0 md:flex-1 md:overflow-y-auto"
    >
      {pokemons.length === 0 ? (
        <p className="p-4 text-center text-gray-300">
          No Pokémon match these filters.
        </p>
      ) : (
        <ul className="space-y-2 p-3 md:space-y-4 md:p-4">
          {pokemons.map((pokemon) => {
            const isCurrentPokemon = pokemon.id === currentPokemonId

            return (
              <li key={pokemon.id}>
                <Link
                  href={`/${pokemon.id}`}
                  aria-current={isCurrentPokemon ? "page" : undefined}
                  className={classNames(
                    "group flex min-h-12 items-center justify-start gap-3 rounded-lg border-2 border-solid px-3 py-2 motion-safe:transition-[background-color,border-color,transform] motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 md:gap-4 md:px-4 md:py-3",
                    isCurrentPokemon
                      ? "border-yellow-400 bg-gray-700"
                      : "border-transparent bg-gray-600 hover:bg-gray-700",
                  )}
                >
                  <PokemonImage
                    size="h-8 w-8"
                    imageUrl={pokemon.imageUrl}
                    altText=""
                  />
                  <span className="shrink-0 font-bold text-yellow-400">
                    {pokemon.number}
                  </span>
                  <span className="min-w-0 truncate">{pokemon.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
