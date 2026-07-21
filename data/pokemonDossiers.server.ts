import pokemonDossiers from "@/data/pokemonDossiers.json"
import type { PokemonDossier } from "@/types/pokemon"

const POKEMON_DOSSIERS: ReadonlyArray<PokemonDossier> = pokemonDossiers

export function getPokemonDossier({ id }: { id: string }) {
  const nationalPokedexNumber = Number(id)
  const pokemonDossier = POKEMON_DOSSIERS[nationalPokedexNumber - 1]

  return pokemonDossier?.id === nationalPokedexNumber
    ? pokemonDossier
    : undefined
}
