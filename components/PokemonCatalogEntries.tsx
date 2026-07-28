import Link from "next/link"
import PokemonImage from "@/components/PokemonImage"
import type { PokemonCatalogEntry } from "@/types/pokemon"
import classNames from "@/utils/classNames"

export default function PokemonCatalogEntries({
  currentPokemonId,
  pokemons,
}: {
  currentPokemonId: number
  pokemons: ReadonlyArray<PokemonCatalogEntry>
}) {
  return (
    <ul className="space-y-2 p-3 md:space-y-4 md:p-4">
      {pokemons.map((pokemon) => {
        const isCurrentPokemon = pokemon.id === currentPokemonId

        return (
          <li key={pokemon.id} data-pokemon-id={pokemon.id}>
            <Link
              href={`/${pokemon.id}`}
              prefetch={false}
              aria-current={isCurrentPokemon ? "page" : undefined}
              className={classNames(
                "group flex min-h-12 items-center justify-start gap-3 rounded-lg border-2 border-solid px-3 py-2 motion-safe:transition-[background-color,border-color,transform] motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 md:gap-4 md:px-4 md:py-3",
                isCurrentPokemon
                  ? "border-brand bg-panel-strong"
                  : "bg-panel hover:border-accent hover:bg-panel-strong border-transparent",
              )}
            >
              <PokemonImage
                size="h-8 w-8"
                imageUrl={pokemon.imageUrl}
                altText=""
              />
              <span className="text-brand shrink-0 font-bold">
                {pokemon.number}
              </span>
              <span className="min-w-0 truncate">{pokemon.name}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
