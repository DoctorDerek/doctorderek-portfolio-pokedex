import pokemonCatalog from "@/data/pokemonCatalog.json"
import type { PokemonCatalogEntry } from "@/types/pokemon"

export const POKEMON_CATALOG: ReadonlyArray<PokemonCatalogEntry> =
  pokemonCatalog

export const MAX_POKEMON_NUMBER = POKEMON_CATALOG.length

export function getPokedexStaticParameters() {
  return POKEMON_CATALOG.map(({ id }) => ({ id: String(id) }))
}
