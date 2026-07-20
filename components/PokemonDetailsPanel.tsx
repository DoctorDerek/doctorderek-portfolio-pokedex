import PokemonImage from "@/components/PokemonImage"
import type { Pokemon } from "@/graphql/generated"
import classNames from "@/utils/classNames"

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
  resistant: "The types this Pokémon resists",
  types: "The type(s) of this Pokémon",
  weaknesses: "The types this Pokémon is weak to",
  weight: "The minimum and maximum weight of this Pokémon",
  id: "The unique identifier of this Pokémon in the API",
}

const PERCENTAGE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
})

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
    <section
      aria-labelledby="selected-pokemon-heading"
      className="order-1 w-full bg-gray-700 motion-safe:animate-[dossier-reveal_240ms_ease-out] md:order-2"
    >
      <h2
        id="selected-pokemon-heading"
        className="flex justify-between border-b-2 border-solid border-b-gray-800 p-5 text-xl sm:p-6 sm:text-2xl md:p-8"
      >
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
      <div className="grid gap-3 p-4 md:h-104 md:content-between">
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
          {classification && (
            <PokemonAttribute
              title="classification"
              attribute="Classification"
              value={`“${classification}”`}
              className="col-start-1 row-start-2 sm:row-start-1"
            />
          )}
          {image && (
            <div className="col-span-2 row-start-1 flex items-center justify-center sm:col-span-1 sm:col-start-2">
              <PokemonImage
                size="h-16 w-16"
                imageUrl={image}
                altText={name ?? ""}
              />
            </div>
          )}
          {Array.isArray(types) && (
            <PokemonAttribute
              title="types"
              attribute="Types"
              value={types.join(", ")}
              className="col-start-2 row-start-2 sm:col-start-3 sm:row-start-1"
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
              value={PERCENTAGE_FORMATTER.format(fleeRate)}
            />
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="grid gap-3 sm:grid-cols-2">
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
    </section>
  )
}

function PokemonAttribute({
  title,
  attribute,
  value,
  className = "",
}: {
  title: keyof typeof ACCESSIBLE_ATTRIBUTE_TITLES
  attribute: string
  value: string
  className?: string
}) {
  return (
    <dl
      className={classNames(
        "flex min-w-0 flex-col rounded-md border-2 border-solid border-gray-400 p-2 text-center text-sm sm:text-base",
        className,
      )}
      title={ACCESSIBLE_ATTRIBUTE_TITLES[title]}
    >
      <dt className="font-semi-bold underline">{attribute}</dt>
      <dd className="break-words">{value}</dd>
    </dl>
  )
}
