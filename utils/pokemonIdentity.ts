const NATIONAL_POKEDEX_NUMBER_LENGTH = 3
const POKEMON_API_GLOBAL_ID_PREFIX = "Pokemon:"

export function getPokemonApiGlobalId({
  nationalPokedexNumber,
}: {
  nationalPokedexNumber: number
}) {
  const paddedNationalPokedexNumber = String(nationalPokedexNumber).padStart(
    NATIONAL_POKEDEX_NUMBER_LENGTH,
    "0",
  )

  return btoa(`${POKEMON_API_GLOBAL_ID_PREFIX}${paddedNationalPokedexNumber}`)
}
