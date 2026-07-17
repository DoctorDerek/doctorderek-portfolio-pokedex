import PokemonImage from "@/components/PokemonImage"
import type { Pokemon } from "@/graphql/generated"

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

export default function PokemonDetailsPanel({ pokemon }: { pokemon: Pokemon }) {
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
  } = pokemon

  return (
    <div className="w-full bg-gray-700">
      <h2 className="flex justify-between border-b-2 border-solid border-b-gray-800 p-8 text-2xl">
        {name && (
          <span
            className="tracking-wide"
            title={ACCESSIBLE_ATTRIBUTE_TITLES.name}
          >
            {name}
          </span>
        )}
        {number && (
          <span
            className="tracking-widest text-yellow-400"
            title={ACCESSIBLE_ATTRIBUTE_TITLES.number}
          >
            #{number}
          </span>
        )}
      </h2>
      <div className="flex h-104 flex-col items-stretch justify-between p-4">
        <div className="flex shrink-0 justify-between">
          {classification && (
            <PokemonAttribute
              title="classification"
              attribute="Classification"
              value={`“${classification}”`}
            />
          )}
          {image && (
            <PokemonImage
              size="h-16 w-16"
              imageUrl={image}
              altText={name ?? ""}
            />
          )}
          {Array.isArray(types) && (
            <PokemonAttribute
              title="types"
              attribute="Types"
              value={types.join(", ")}
            />
          )}
        </div>
        <div className="flex shrink-0 justify-between">
          {maxCP && (
            <PokemonAttribute
              title="maxCP"
              attribute="Max CP"
              value={String(maxCP)}
            />
          )}
          {maxHP && (
            <PokemonAttribute
              title="maxHP"
              attribute="Max HP"
              value={String(maxHP)}
            />
          )}
          {fleeRate && (
            <PokemonAttribute
              title="fleeRate"
              attribute="Flee Rate"
              value={String(fleeRate * 100) + "%"}
            />
          )}
        </div>
        <div className="flex shrink-0 justify-between">
          {height?.minimum && height.maximum && (
            <PokemonAttribute
              title="height"
              attribute="Height"
              value={`Min: ${height.minimum}; Max: ${height.maximum}`}
            />
          )}
          {weight?.minimum && weight.maximum && (
            <PokemonAttribute
              title="weight"
              attribute="Weight"
              value={`Min: ${weight.minimum}; Max: ${weight.maximum}`}
            />
          )}
        </div>
        <div className="flex justify-between">
          {Array.isArray(weaknesses) && (
            <PokemonAttribute
              title="weaknesses"
              attribute="Weaknesses"
              value={weaknesses.join(", ")}
            />
          )}
          {Array.isArray(resistant) && (
            <PokemonAttribute
              title="resistant"
              attribute="Resistances"
              value={resistant.join(", ")}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PokemonAttribute({
  title,
  attribute,
  value,
}: {
  title: keyof typeof ACCESSIBLE_ATTRIBUTE_TITLES
  attribute: string
  value: string
}) {
  return (
    <div
      className="flex flex-col rounded-md border-2 border-solid border-gray-400 p-2 text-center"
      title={ACCESSIBLE_ATTRIBUTE_TITLES[title]}
    >
      <h3 className="font-semi-bold underline">{attribute}</h3>
      <h4>{value}</h4>
    </div>
  )
}
