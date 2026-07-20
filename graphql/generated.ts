import { DocumentTypeDecoration } from "@graphql-typed-document-node/core"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { pokemonApiQueryFetcher } from "../utils/fetchPokemonApi"

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

/** Represents a Pokémon's attack types */
export type Attack = {
  __typename?: "Attack"
  /** The damage of this Pokémon attack */
  damage?: Maybe<Scalars["Int"]["output"]>
  /** The name of this Pokémon attack */
  name?: Maybe<Scalars["String"]["output"]>
  /** The type of this Pokémon attack */
  type?: Maybe<Scalars["String"]["output"]>
}

/** Represents a Pokémon */
export type Pokemon = {
  __typename?: "Pokemon"
  /** The attacks of this Pokémon */
  attacks?: Maybe<PokemonAttack>
  /** The classification of this Pokémon */
  classification?: Maybe<Scalars["String"]["output"]>
  /** The evolution requirements of this Pokémon */
  evolutionRequirements?: Maybe<PokemonEvolutionRequirement>
  /** The evolutions of this Pokémon */
  evolutions?: Maybe<Array<Maybe<Pokemon>>>
  fleeRate?: Maybe<Scalars["Float"]["output"]>
  /** The minimum and maximum weight of this Pokémon */
  height?: Maybe<PokemonDimension>
  /** The ID of an object */
  id: Scalars["ID"]["output"]
  image?: Maybe<Scalars["String"]["output"]>
  /** The maximum CP of this Pokémon */
  maxCP?: Maybe<Scalars["Int"]["output"]>
  /** The maximum HP of this Pokémon */
  maxHP?: Maybe<Scalars["Int"]["output"]>
  /** The name of this Pokémon */
  name?: Maybe<Scalars["String"]["output"]>
  /** The identifier of this Pokémon */
  number?: Maybe<Scalars["String"]["output"]>
  /** The type(s) of Pokémons that this Pokémon is resistant to */
  resistant?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  /** The type(s) of this Pokémon */
  types?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  /** The type(s) of Pokémons that this Pokémon weak to */
  weaknesses?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  /** The minimum and maximum weight of this Pokémon */
  weight?: Maybe<PokemonDimension>
}

/** Represents a Pokémon's attack types */
export type PokemonAttack = {
  __typename?: "PokemonAttack"
  /** The fast attacks of this Pokémon */
  fast?: Maybe<Array<Maybe<Attack>>>
  /** The special attacks of this Pokémon */
  special?: Maybe<Array<Maybe<Attack>>>
}

/** Represents a Pokémon's dimensions */
export type PokemonDimension = {
  __typename?: "PokemonDimension"
  /** The maximum value of this dimension */
  maximum?: Maybe<Scalars["String"]["output"]>
  /** The minimum value of this dimension */
  minimum?: Maybe<Scalars["String"]["output"]>
}

/** Represents a Pokémon's requirement to evolve */
export type PokemonEvolutionRequirement = {
  __typename?: "PokemonEvolutionRequirement"
  /** The amount of candy to evolve */
  amount?: Maybe<Scalars["Int"]["output"]>
  /** The name of the candy to evolve */
  name?: Maybe<Scalars["String"]["output"]>
}

/** Query any Pokémon by number or name */
export type Query = {
  __typename?: "Query"
  pokemon?: Maybe<Pokemon>
  pokemons?: Maybe<Array<Maybe<Pokemon>>>
  query?: Maybe<Query>
}

/** Query any Pokémon by number or name */
export type QueryPokemonArgs = {
  id?: InputMaybe<Scalars["String"]["input"]>
  name?: InputMaybe<Scalars["String"]["input"]>
}

/** Query any Pokémon by number or name */
export type QueryPokemonsArgs = {
  first: Scalars["Int"]["input"]
}

export type PokemonCatalogEntryFragment = {
  id: string
  number: string | null
  name: string | null
  image: string | null
  types: Array<string | null> | null
  maxCP: number | null
}

export type PokemonDossierFragment = {
  classification: string | null
  resistant: Array<string | null> | null
  weaknesses: Array<string | null> | null
  fleeRate: number | null
  maxHP: number | null
  id: string
  number: string | null
  name: string | null
  image: string | null
  types: Array<string | null> | null
  maxCP: number | null
  weight: { minimum: string | null; maximum: string | null } | null
  height: { minimum: string | null; maximum: string | null } | null
  attacks: {
    fast: Array<{
      damage: number | null
      name: string | null
      type: string | null
    } | null> | null
    special: Array<{
      damage: number | null
      name: string | null
      type: string | null
    } | null> | null
  } | null
  evolutionRequirements: { amount: number | null; name: string | null } | null
  evolutions: Array<{
    id: string
    number: string | null
    name: string | null
    image: string | null
  } | null> | null
}

export type PokedexPageQueryVariables = Exact<{
  catalogSize: number
  pokemonId: string
}>

export type PokedexPageQuery = {
  pokemons: Array<{
    id: string
    number: string | null
    name: string | null
    image: string | null
    types: Array<string | null> | null
    maxCP: number | null
  } | null> | null
  pokemon: {
    classification: string | null
    resistant: Array<string | null> | null
    weaknesses: Array<string | null> | null
    fleeRate: number | null
    maxHP: number | null
    id: string
    number: string | null
    name: string | null
    image: string | null
    types: Array<string | null> | null
    maxCP: number | null
    weight: { minimum: string | null; maximum: string | null } | null
    height: { minimum: string | null; maximum: string | null } | null
    attacks: {
      fast: Array<{
        damage: number | null
        name: string | null
        type: string | null
      } | null> | null
      special: Array<{
        damage: number | null
        name: string | null
        type: string | null
      } | null> | null
    } | null
    evolutionRequirements: { amount: number | null; name: string | null } | null
    evolutions: Array<{
      id: string
      number: string | null
      name: string | null
      image: string | null
    } | null> | null
  } | null
}

export type PokemonCatalogQueryVariables = Exact<{
  first: number
}>

export type PokemonCatalogQuery = {
  pokemons: Array<{
    id: string
    number: string | null
    name: string | null
    image: string | null
    types: Array<string | null> | null
    maxCP: number | null
  } | null> | null
}

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<
    DocumentTypeDecoration<TResult, TVariables>["__apiType"]
  >
  private value: string
  public __meta__?: Record<string, any> | undefined

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value)
    this.value = value
    this.__meta__ = __meta__
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value
  }
}
export const PokemonCatalogEntryFragmentDoc = new TypedDocumentString(
  `
    fragment PokemonCatalogEntry on Pokemon {
  id
  number
  name
  image
  types
  maxCP
}
    `,
  { fragmentName: "PokemonCatalogEntry" },
)
export const PokemonDossierFragmentDoc = new TypedDocumentString(
  `
    fragment PokemonDossier on Pokemon {
  ...PokemonCatalogEntry
  weight {
    minimum
    maximum
  }
  height {
    minimum
    maximum
  }
  classification
  resistant
  weaknesses
  fleeRate
  maxHP
  attacks {
    fast {
      damage
      name
      type
    }
    special {
      damage
      name
      type
    }
  }
  evolutionRequirements {
    amount
    name
  }
  evolutions {
    id
    number
    name
    image
  }
}
    fragment PokemonCatalogEntry on Pokemon {
  id
  number
  name
  image
  types
  maxCP
}`,
  { fragmentName: "PokemonDossier" },
)
export const PokedexPageDocument = new TypedDocumentString(`
    query PokedexPage($catalogSize: Int!, $pokemonId: String!) {
  pokemons(first: $catalogSize) {
    ...PokemonCatalogEntry
  }
  pokemon(id: $pokemonId) {
    ...PokemonDossier
  }
}
    fragment PokemonCatalogEntry on Pokemon {
  id
  number
  name
  image
  types
  maxCP
}
fragment PokemonDossier on Pokemon {
  ...PokemonCatalogEntry
  weight {
    minimum
    maximum
  }
  height {
    minimum
    maximum
  }
  classification
  resistant
  weaknesses
  fleeRate
  maxHP
  attacks {
    fast {
      damage
      name
      type
    }
    special {
      damage
      name
      type
    }
  }
  evolutionRequirements {
    amount
    name
  }
  evolutions {
    id
    number
    name
    image
  }
}`)

export const usePokedexPageQuery = <TData = PokedexPageQuery, TError = unknown>(
  variables: PokedexPageQueryVariables,
  options?: Omit<
    UseQueryOptions<PokedexPageQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<PokedexPageQuery, TError, TData>["queryKey"]
  },
) => {
  return useQuery<PokedexPageQuery, TError, TData>({
    queryKey: ["PokedexPage", variables],
    queryFn: pokemonApiQueryFetcher<
      PokedexPageQuery,
      PokedexPageQueryVariables
    >(PokedexPageDocument, variables),
    ...options,
  })
}

export const PokemonCatalogDocument = new TypedDocumentString(`
    query PokemonCatalog($first: Int!) {
  pokemons(first: $first) {
    ...PokemonCatalogEntry
  }
}
    fragment PokemonCatalogEntry on Pokemon {
  id
  number
  name
  image
  types
  maxCP
}`)

export const usePokemonCatalogQuery = <
  TData = PokemonCatalogQuery,
  TError = unknown,
>(
  variables: PokemonCatalogQueryVariables,
  options?: Omit<
    UseQueryOptions<PokemonCatalogQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<PokemonCatalogQuery, TError, TData>["queryKey"]
  },
) => {
  return useQuery<PokemonCatalogQuery, TError, TData>({
    queryKey: ["PokemonCatalog", variables],
    queryFn: pokemonApiQueryFetcher<
      PokemonCatalogQuery,
      PokemonCatalogQueryVariables
    >(PokemonCatalogDocument, variables),
    ...options,
  })
}
