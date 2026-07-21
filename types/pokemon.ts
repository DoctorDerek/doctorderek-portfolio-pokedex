export interface PokemonCatalogEntry {
  baseStatTotal: number
  generation: string
  id: number
  imageUrl: string
  name: string
  number: string
  slug: string
  types: string[]
}

export interface PokemonDossier extends PokemonCatalogEntry {
  abilities: {
    isHidden: boolean
    name: string
  }[]
  baseExperience: number | null
  baseHappiness: number | null
  baseStats: {
    attack: number
    defense: number
    hp: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  captureRate: number | null
  category: string
  color: string | null
  habitat: string | null
  heightInMeters: number | null
  isLegendary: boolean
  isMythical: boolean
  shape: string | null
  weightInKilograms: number | null
}

export interface PokedexArtifacts {
  catalog: PokemonCatalogEntry[]
  dossiers: PokemonDossier[]
}
