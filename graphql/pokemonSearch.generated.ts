import { DocumentTypeDecoration } from "@graphql-typed-document-node/core"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { pokemonSearchFetcher } from "@/data/pokemonSearch"

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }

export type AdvancedPokemonSearchQueryVariables = Exact<{
  namePattern: string
  typePattern: string
  generationPattern: string
  legendaryStatuses: Array<boolean> | boolean
  mythicalStatuses: Array<boolean> | boolean
  minimumBaseExperience: number
  maximumPokemonId: number
  limit: number
  orderByNumber: boolean
  orderByName: boolean
  orderByBaseExperience: boolean
}>

export type AdvancedPokemonSearchQuery = {
  byNumber?: Array<{
    base_experience: number | null
    id: number
    name: string
    pokemonspecy: {
      is_legendary: boolean
      is_mythical: boolean
      generation: { name: string } | null
      pokemonspeciesnames: Array<{ name: string }>
    } | null
    pokemontypes: Array<{ type: { name: string } | null }>
  }>
  byName?: Array<{
    base_experience: number | null
    id: number
    name: string
    pokemonspecy: {
      is_legendary: boolean
      is_mythical: boolean
      generation: { name: string } | null
      pokemonspeciesnames: Array<{ name: string }>
    } | null
    pokemontypes: Array<{ type: { name: string } | null }>
  }>
  byBaseExperience?: Array<{
    base_experience: number | null
    id: number
    name: string
    pokemonspecy: {
      is_legendary: boolean
      is_mythical: boolean
      generation: { name: string } | null
      pokemonspeciesnames: Array<{ name: string }>
    } | null
    pokemontypes: Array<{ type: { name: string } | null }>
  }>
}

export type PokemonSearchResultFragment = {
  base_experience: number | null
  id: number
  name: string
  pokemonspecy: {
    is_legendary: boolean
    is_mythical: boolean
    generation: { name: string } | null
    pokemonspeciesnames: Array<{ name: string }>
  } | null
  pokemontypes: Array<{ type: { name: string } | null }>
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
export const PokemonSearchResultFragmentDoc = new TypedDocumentString(
  `
    fragment PokemonSearchResult on pokemon {
  base_experience
  id
  name
  pokemonspecy {
    generation {
      name
    }
    is_legendary
    is_mythical
    pokemonspeciesnames(limit: 1, where: {language: {name: {_eq: "en"}}}) {
      name
    }
  }
  pokemontypes(order_by: [{slot: asc}]) {
    type {
      name
    }
  }
}
    `,
  { fragmentName: "PokemonSearchResult" },
)
export const AdvancedPokemonSearchDocument = new TypedDocumentString(`
    query AdvancedPokemonSearch($namePattern: String!, $typePattern: String!, $generationPattern: String!, $legendaryStatuses: [Boolean!]!, $mythicalStatuses: [Boolean!]!, $minimumBaseExperience: Int!, $maximumPokemonId: Int!, $limit: Int!, $orderByNumber: Boolean!, $orderByName: Boolean!, $orderByBaseExperience: Boolean!) {
  byNumber: pokemon(
    limit: $limit
    order_by: [{id: asc}]
    where: {id: {_lte: $maximumPokemonId}, is_default: {_eq: true}, name: {_ilike: $namePattern}, base_experience: {_gte: $minimumBaseExperience}, pokemontypes: {type: {name: {_ilike: $typePattern}}}, pokemonspecy: {generation: {name: {_ilike: $generationPattern}}, is_legendary: {_in: $legendaryStatuses}, is_mythical: {_in: $mythicalStatuses}}}
  ) @include(if: $orderByNumber) {
    ...PokemonSearchResult
  }
  byName: pokemon(
    limit: $limit
    order_by: [{name: asc}, {id: asc}]
    where: {id: {_lte: $maximumPokemonId}, is_default: {_eq: true}, name: {_ilike: $namePattern}, base_experience: {_gte: $minimumBaseExperience}, pokemontypes: {type: {name: {_ilike: $typePattern}}}, pokemonspecy: {generation: {name: {_ilike: $generationPattern}}, is_legendary: {_in: $legendaryStatuses}, is_mythical: {_in: $mythicalStatuses}}}
  ) @include(if: $orderByName) {
    ...PokemonSearchResult
  }
  byBaseExperience: pokemon(
    limit: $limit
    order_by: [{base_experience: desc_nulls_last}, {id: asc}]
    where: {id: {_lte: $maximumPokemonId}, is_default: {_eq: true}, name: {_ilike: $namePattern}, base_experience: {_gte: $minimumBaseExperience}, pokemontypes: {type: {name: {_ilike: $typePattern}}}, pokemonspecy: {generation: {name: {_ilike: $generationPattern}}, is_legendary: {_in: $legendaryStatuses}, is_mythical: {_in: $mythicalStatuses}}}
  ) @include(if: $orderByBaseExperience) {
    ...PokemonSearchResult
  }
}
    fragment PokemonSearchResult on pokemon {
  base_experience
  id
  name
  pokemonspecy {
    generation {
      name
    }
    is_legendary
    is_mythical
    pokemonspeciesnames(limit: 1, where: {language: {name: {_eq: "en"}}}) {
      name
    }
  }
  pokemontypes(order_by: [{slot: asc}]) {
    type {
      name
    }
  }
}`)

export const useAdvancedPokemonSearchQuery = <
  TData = AdvancedPokemonSearchQuery,
  TError = unknown,
>(
  variables: AdvancedPokemonSearchQueryVariables,
  options?: Omit<
    UseQueryOptions<AdvancedPokemonSearchQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      AdvancedPokemonSearchQuery,
      TError,
      TData
    >["queryKey"]
  },
) => {
  return useQuery<AdvancedPokemonSearchQuery, TError, TData>({
    queryKey: ["AdvancedPokemonSearch", variables],
    queryFn: pokemonSearchFetcher<
      AdvancedPokemonSearchQuery,
      AdvancedPokemonSearchQueryVariables
    >(AdvancedPokemonSearchDocument, variables),
    ...options,
  })
}

useAdvancedPokemonSearchQuery.document = AdvancedPokemonSearchDocument

useAdvancedPokemonSearchQuery.getKey = (
  variables: AdvancedPokemonSearchQueryVariables,
) => ["AdvancedPokemonSearch", variables]
