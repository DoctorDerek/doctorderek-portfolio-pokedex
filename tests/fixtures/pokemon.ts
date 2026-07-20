import type { Pokemon } from "@/graphql/generated"

export const BULBASAUR_FIXTURE: Pokemon = {
  classification: "Seed Pokémon",
  fleeRate: 0.1,
  height: { minimum: "0.61m", maximum: "0.79m" },
  id: "UG9rZW1vbjowMDE=",
  image: "https://img.pokemondb.net/artwork/bulbasaur.jpg",
  maxCP: 951,
  maxHP: 1071,
  name: "Bulbasaur",
  number: "001",
  resistant: ["Water", "Electric", "Grass", "Fighting", "Fairy"],
  types: ["Grass", "Poison"],
  weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
  weight: { minimum: "6.04kg", maximum: "7.76kg" },
}

export const IVYSAUR_FIXTURE: Pokemon = {
  id: "UG9rZW1vbjowMDI=",
  image: "https://img.pokemondb.net/artwork/ivysaur.jpg",
  name: "Ivysaur",
  number: "002",
}

export const POKEMON_CATALOG_FIXTURES = [BULBASAUR_FIXTURE, IVYSAUR_FIXTURE]
