export const POKEMON_ARTWORK_GITHUB_REVISION =
  "8dfa3d97e953caaafaafd4963eff7621811af08e"

export const POKEMON_ARTWORK_REPOSITORY_PATH = `/PokeAPI/sprites/${POKEMON_ARTWORK_GITHUB_REVISION}/sprites/pokemon/other/official-artwork`

export const POKEMON_ARTWORK_BASE_URL = `https://raw.githubusercontent.com${POKEMON_ARTWORK_REPOSITORY_PATH}`

export function createPokemonArtworkUrl(pokemonId: number) {
  return `${POKEMON_ARTWORK_BASE_URL}/${pokemonId}.png`
}
