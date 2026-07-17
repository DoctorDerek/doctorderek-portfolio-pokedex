import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

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

function fetcher<TData, TVariables>(
  endpoint: string,
  requestInit: RequestInit,
  query: TypedDocumentString<unknown, unknown>,
  variables?: TVariables,
) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: "POST",
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    })

    const json = await res.json()

    if (json.errors) {
      const { message } = json.errors[0]

      throw new Error(message)
    }

    return json.data
  }
}
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

export type PokemonsQueryVariables = Exact<{
  first: number
}>

export type PokemonsQuery = {
  pokemons: Array<{
    id: string
    number: string | null
    name: string | null
    classification: string | null
    types: Array<string | null> | null
    resistant: Array<string | null> | null
    weaknesses: Array<string | null> | null
    fleeRate: number | null
    maxCP: number | null
    maxHP: number | null
    image: string | null
    weight: { minimum: string | null; maximum: string | null } | null
    height: { minimum: string | null; maximum: string | null } | null
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

export const PokemonsDocument = new TypedDocumentString(`
    query pokemons($first: Int!) {
  pokemons(first: $first) {
    id
    number
    name
    weight {
      minimum
      maximum
    }
    height {
      minimum
      maximum
    }
    classification
    types
    resistant
    weaknesses
    fleeRate
    maxCP
    maxHP
    image
  }
}
    `)

export const usePokemonsQuery = <TData = PokemonsQuery, TError = unknown>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables: PokemonsQueryVariables,
  options?: Omit<UseQueryOptions<PokemonsQuery, TError, TData>, "queryKey"> & {
    queryKey?: UseQueryOptions<PokemonsQuery, TError, TData>["queryKey"]
  },
) => {
  return useQuery<PokemonsQuery, TError, TData>({
    queryKey: ["pokemons", variables],
    queryFn: fetcher<PokemonsQuery, PokemonsQueryVariables>(
      dataSource.endpoint,
      dataSource.fetchParams || {},
      PokemonsDocument,
      variables,
    ),
    ...options,
  })
}
