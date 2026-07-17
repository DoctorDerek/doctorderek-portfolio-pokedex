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
    <div className="relative w-[40%] space-y-4 overflow-y-auto bg-gray-800 text-sm">
      {pokemons.map((pokemon) => {
        const pokemonNumber = pokemon.number ?? ""
        const pokemonName = pokemon.name ?? ""
        const pokemonImageUrl = pokemon.image ?? ""

        return (
          <Link key={pokemon.id} href={`/${Number(pokemonNumber)}`}>
            <div
              className={classNames(
                "m-4 flex items-center justify-start space-x-4 rounded-lg border-2 border-solid py-3 pl-4",
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
              <span className="font-bold text-yellow-400">{pokemonNumber}</span>
              <span>{pokemonName}</span>
            </div>
          </Link>
        )
      })}
      <PokemonPagination currentPageNumber={currentPageNumber} />
    </div>
  )
}
