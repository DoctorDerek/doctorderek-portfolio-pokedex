export const POKEMON_ARTWORK_REPOSITORY_PATH =
  "/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"

export const POKEMON_ARTWORK_BASE_URL = `https://raw.githubusercontent.com${POKEMON_ARTWORK_REPOSITORY_PATH}`

export function createPokemonArtworkUrl(pokemonId: number) {
  return `${POKEMON_ARTWORK_BASE_URL}/${pokemonId}.png`
}
