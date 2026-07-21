import type { PokemonCatalogEntry, PokemonDossier } from "@/types/pokemon"

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

export const BULBASAUR_DOSSIER_FIXTURE: PokemonDossier = {
  ...BULBASAUR_CATALOG_FIXTURE,
  abilities: [
    { isHidden: false, name: "Overgrow" },
    { isHidden: true, name: "Chlorophyll" },
  ],
  baseExperience: 64,
  baseHappiness: 50,
  baseStats: {
    attack: 49,
    defense: 49,
    hp: 45,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45,
  },
  captureRate: 45,
  category: "Seed Pokémon",
  color: "Green",
  habitat: "Grassland",
  heightInMeters: 0.7,
  isLegendary: false,
  isMythical: false,
  shape: "Quadruped",
  weightInKilograms: 6.9,
}

export const IVYSAUR_DOSSIER_FIXTURE: PokemonDossier = {
  ...BULBASAUR_DOSSIER_FIXTURE,
  ...IVYSAUR_CATALOG_FIXTURE,
  baseExperience: 142,
  baseStats: {
    attack: 62,
    defense: 63,
    hp: 60,
    specialAttack: 80,
    specialDefense: 80,
    speed: 60,
  },
  heightInMeters: 1,
  weightInKilograms: 13,
}
