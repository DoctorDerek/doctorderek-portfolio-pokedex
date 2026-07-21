import type { PokemonCatalogEntry } from "@/types/pokemon"

export const BULBASAUR_CATALOG_FIXTURE: PokemonCatalogEntry = {
  baseStatTotal: 318,
  generation: "Generation I",
  id: 1,
  imageUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  name: "Bulbasaur",
  number: "0001",
  slug: "bulbasaur",
  types: ["Grass", "Poison"],
}

export const IVYSAUR_CATALOG_FIXTURE: PokemonCatalogEntry = {
  baseStatTotal: 405,
  generation: "Generation I",
  id: 2,
  imageUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
  name: "Ivysaur",
  number: "0002",
  slug: "ivysaur",
  types: ["Grass", "Poison"],
}

export const CHARMANDER_CATALOG_FIXTURE: PokemonCatalogEntry = {
  baseStatTotal: 309,
  generation: "Generation I",
  id: 4,
  imageUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
  name: "Charmander",
  number: "0004",
  slug: "charmander",
  types: ["Fire"],
}

export const POKEMON_CATALOG_FIXTURES = [
  BULBASAUR_CATALOG_FIXTURE,
  IVYSAUR_CATALOG_FIXTURE,
  CHARMANDER_CATALOG_FIXTURE,
]
