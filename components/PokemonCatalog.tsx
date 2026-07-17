import Link from "next/link"
import PokemonImage from "@/components/PokemonImage"
import PokemonPagination from "@/components/PokemonPagination"
import type { Pokemon } from "@/graphql/generated"
import classNames from "@/utils/classNames"

export default function PokemonCatalog({
  pokemons,
  currentPokemonNumber,
  currentPageNumber,
}: {
  pokemons: Pokemon[]
  currentPokemonNumber: string
  currentPageNumber: number
}) {
  return (
    <div className="relative w-full bg-gray-800 text-sm md:overflow-y-auto">
      <div className="space-y-2 p-3 md:space-y-4 md:p-4">
        {pokemons.map((pokemon) => {
          const pokemonNumber = pokemon.number ?? ""
          const pokemonName = pokemon.name ?? ""
          const pokemonImageUrl = pokemon.image ?? ""

          return (
            <Link key={pokemon.id} href={`/${Number(pokemonNumber)}`}>
              <div
                className={classNames(
                  "flex min-h-12 items-center justify-start gap-3 rounded-lg border-2 border-solid px-3 py-2 md:gap-4 md:px-4 md:py-3",
                  pokemonNumber === currentPokemonNumber
                    ? "border-yellow-400 bg-gray-700"
                    : "border-transparent bg-gray-600 hover:bg-gray-700",
                )}
              >
                <PokemonImage
                  size="h-8 w-8"
                  imageUrl={pokemonImageUrl}
                  altText={pokemonName}
                />
                <span className="shrink-0 font-bold text-yellow-400">
                  {pokemonNumber}
                </span>
                <span className="min-w-0 truncate">{pokemonName}</span>
              </div>
            </Link>
          )
        })}
      </div>
      <PokemonPagination currentPageNumber={currentPageNumber} />
    </div>
  )
}
