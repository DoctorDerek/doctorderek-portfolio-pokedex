export const POKEMON_DOSSIER_ROUTE_PREFIX = "/pokemon"

export function getPokemonDossierRoute(pokemonId: number) {
  return `${POKEMON_DOSSIER_ROUTE_PREFIX}/${pokemonId}`
}
