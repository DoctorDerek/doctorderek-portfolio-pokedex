import { PokemonsQuery } from "@/graphql/generated"

export const GRAPHQL_API_ENDPOINT = "https://graphql-pokemon2.vercel.app/"

export async function fetchPokemonApi({
  pokemonCount,
}: {
  pokemonCount: number
}) {
  return await fetch(GRAPHQL_API_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${process.env.POKEMON_API_KEY}` // Ready for future secrets
    },
    body: JSON.stringify({
      query: `
        query pokemons {
          pokemons(first: ${pokemonCount}) {
            id
            number
            name
            weight{
              minimum
              maximum
            }
            height{
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
      `,
      variables: {},
    }),
    method: "POST",
  })
    .then((res) => res.json())
    .then((res) => res.data as PokemonsQuery)
}
