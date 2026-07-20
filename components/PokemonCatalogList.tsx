import Link from "next/link"
import PokemonImage from "@/components/PokemonImage"
import type { PokemonCatalogEntryFragment } from "@/graphql/generated"
import classNames from "@/utils/classNames"

export default function PokemonCatalogList({
  currentPokemonNumber,
  pokemons,
}: {
  currentPokemonNumber: string
  pokemons: ReadonlyArray<PokemonCatalogEntryFragment>
}) {
  return (
    <nav
      aria-label="Pokémon catalog"
      className="md:min-h-0 md:flex-1 md:overflow-y-auto"
    >
      <ul className="space-y-2 p-3 md:space-y-4 md:p-4">
        {pokemons.map((pokemon) => {
          const pokemonNumber = pokemon.number ?? ""
          const pokemonName = pokemon.name ?? ""
          const pokemonImageUrl = pokemon.image ?? ""
          const isCurrentPokemon = pokemonNumber === currentPokemonNumber

          return (
            <li key={pokemon.id}>
              <Link
                href={`/${Number(pokemonNumber)}`}
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
                  imageUrl={pokemonImageUrl}
                  altText=""
                />
                <span className="shrink-0 font-bold text-yellow-400">
                  {pokemonNumber}
                </span>
                <span className="min-w-0 truncate">{pokemonName}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
