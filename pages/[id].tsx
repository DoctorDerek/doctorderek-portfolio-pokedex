import gql from "graphql-tag"
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import Link from "next/link"
import AppContainer from "@/components/AppContainer"
import PokemonImage from "@/components/PokemonImage"
import PokemonPagination from "@/components/PokemonPagination"
import { Pokemon, PokemonsQuery } from "@/graphql/generated"
import classNames from "@/utils/classNames"
import { fetchPokemonApi } from "@/utils/fetchPokemonApi"
import {
  calculateCurrentPage,
  calculatePokemonCount,
  MAX_POKEMON_NUMBER,
} from "@/utils/pokemonPagination"

const ACCESSIBLE_ATTRIBUTE_TITLES: { [key in keyof Pokemon]: string } = {
  attacks: "The attacks of this Pokémon",
  classification: "The classification of this Pokémon",
  evolutionRequirements: "The evolution requirements of this Pokémon",
  evolutions: "The evolutions of this Pokémon",
  fleeRate: "The flee rate of this Pokémon",
  height: "The minimum and maximum height of this Pokémon",
  maxCP: "The maximum Combat Power (CP) of this Pokémon",
  maxHP: "The maximum Hit Points (HP) of this Pokémon",
  name: "The name of this Pokémon",
  number: "The identifier of this Pokémon",
  resistant: "The type(s) of Pokémons that this Pokémon is resistant to",
  types: "The type(s) of this Pokémon",
  weaknesses: "The type(s) of Pokémons that this Pokémon weak to",
  weight: "The minimum and maximum weight of this Pokémon",
  id: "The unique identifier of this Pokémon in the API",
}

const Pokedex: InferGetStaticPropsType<typeof getStaticProps> = ({
  data,
  id,
}: {
  data: PokemonsQuery
  id: string
}) => {
  const allPokemons = data.pokemons as Pokemon[]
  const currentPokemon = allPokemons[Number(id) - 1]
  const currentPageNumber = calculateCurrentPage({ id })
  const pokemons = allPokemons.slice(
    (currentPageNumber - 1) * 10,
    currentPageNumber * 10,
  )

  if (!currentPokemon) return <div>Sorry, Pokémon #{id} not found 😔.</div>

  const {
    classification,
    fleeRate,
    height,
    image,
    maxCP,
    maxHP,
    name,
    number,
    resistant,
    types,
    weaknesses,
    weight,
  } = currentPokemon

  return (
    <AppContainer bgColor="bg-gray-600">
      <div className="flex h-128 w-192 overflow-hidden rounded-lg">
        <div className="relative w-[40%] space-y-4 overflow-y-auto bg-gray-800 text-sm">
          {pokemons?.map((thisPokemon) => {
            const {
              id,
              number: thisNumber,
              name: thisName,
              image: thisImage,
            } = thisPokemon
            const thisPokemonNumber = thisNumber ? thisNumber : ""
            const thisPokemonName = thisName ? thisName : ""
            const thisImageUrl = thisImage ? thisImage : ""
            return (
              <Link key={id} href={`/${Number(thisPokemonNumber)}`}>
                <div
                  className={classNames(
                    "m-4 flex items-center justify-start space-x-4 rounded-lg border-2 border-solid py-3 pl-4",
                    thisPokemonNumber === number
                      ? "border-yellow-400 bg-gray-700"
                      : "border-transparent bg-gray-600 hover:bg-gray-700",
                  )}
                >
                  <PokemonImage
                    size="h-8 w-8"
                    imageUrl={thisImageUrl}
                    altText={thisPokemonName}
                  />
                  <span className="font-bold text-yellow-400">
                    {thisPokemonNumber}
                  </span>
                  <span>{thisPokemonName}</span>
                </div>
              </Link>
            )
          })}
          <PokemonPagination currentPageNumber={currentPageNumber} />
        </div>
        <div className="w-[60%] bg-gray-700">
          <h2 className="flex justify-between border-b-2 border-solid border-b-gray-800 p-8 text-2xl">
            {name && (
              <span
                className="tracking-wide"
                title={ACCESSIBLE_ATTRIBUTE_TITLES["name"]}
              >
                {name}
              </span>
            )}
            {number && (
              <span
                className="tracking-widest text-yellow-400"
                title={ACCESSIBLE_ATTRIBUTE_TITLES["number"]}
              >
                #{number}
              </span>
            )}
          </h2>
          <div className="flex h-104 flex-col items-stretch justify-between p-4">
            <div className="flex shrink-0 justify-between">
              {classification && (
                <PokemonDetails
                  title="classification"
                  attribute="Classification"
                  value={`“${classification}”`}
                />
              )}
              {image && (
                <PokemonImage
                  size="h-16 w-16"
                  imageUrl={image}
                  altText={name ? name : ""}
                />
              )}
              {Array.isArray(types) && (
                <PokemonDetails
                  title="types"
                  attribute="Types"
                  value={types.join(", ")}
                />
              )}
            </div>
            <div className="flex shrink-0 justify-between">
              {maxCP && (
                <PokemonDetails
                  title="maxCP"
                  attribute="Max CP"
                  value={String(maxCP)}
                />
              )}
              {maxHP && (
                <PokemonDetails
                  title="maxHP"
                  attribute="Max HP"
                  value={String(maxHP)}
                />
              )}
              {fleeRate && (
                <PokemonDetails
                  title="fleeRate"
                  attribute="Flee Rate"
                  value={String(fleeRate * 100) + "%"}
                />
              )}
            </div>
            <div className="flex shrink-0 justify-between">
              {height && height.minimum && height.maximum && (
                <PokemonDetails
                  title="height"
                  attribute="Height"
                  value={`Min: ${height.minimum}; Max: ${height.maximum}`}
                />
              )}
              {weight && weight.minimum && weight.maximum && (
                <PokemonDetails
                  title="weight"
                  attribute="Weight"
                  value={`Min: ${weight.minimum}; Max: ${weight.maximum}`}
                />
              )}
            </div>
            <div className="flex justify-between">
              {Array.isArray(weaknesses) && (
                <PokemonDetails
                  title="weaknesses"
                  attribute="Weaknesses"
                  value={weaknesses.join(", ")}
                />
              )}
              {Array.isArray(resistant) && (
                <PokemonDetails
                  title="resistant"
                  attribute="Resistances"
                  value={resistant.join(", ")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  )
}

function PokemonDetails({
  title,
  attribute,
  value,
}: {
  title?: keyof typeof ACCESSIBLE_ATTRIBUTE_TITLES
  attribute?: string
  value?: string
}) {
  return (
    <div
      className="flex flex-col rounded-md border-2 border-solid border-gray-400 p-2 text-center"
      title={title ? ACCESSIBLE_ATTRIBUTE_TITLES[title] : ""}
    >
      <h3 className="font-semi-bold underline">{attribute}</h3>
      <h4>{value}</h4>
    </div>
  )
}

gql`
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
`

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string }
  const pokemonCount = calculatePokemonCount({ id })
  return { props: { data: await fetchPokemonApi({ pokemonCount }), id } }
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: Array(MAX_POKEMON_NUMBER)
      .fill(MAX_POKEMON_NUMBER)
      .map((_, index) => index + 1)
      .map((pokemonNumber) => ({
        params: {
          id: String(pokemonNumber),
        },
      })),
    fallback: false,
  }
}

export default Pokedex
