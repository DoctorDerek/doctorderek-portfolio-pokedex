import PokemonImage from "@/components/PokemonImage"
import type { PokemonDossier } from "@/types/pokemon"
import classNames from "@/utils/classNames"

const ACCESSIBLE_ATTRIBUTE_TITLES = {
  abilities: "The abilities of this Pokémon",
  baseExperience: "The base experience awarded by this Pokémon",
  baseHp: "The base Hit Points of this Pokémon",
  baseSpeed: "The base Speed of this Pokémon",
  baseStatTotal: "The total of this Pokémon’s six base stats",
  category: "The category of this Pokémon",
  generation: "The generation in which this Pokémon debuted",
  height: "The canonical height of this Pokémon",
  name: "The name of this Pokémon",
  number: "The National Pokédex identifier of this Pokémon",
  types: "The type or types of this Pokémon",
  weight: "The canonical weight of this Pokémon",
} as const

export default function PokemonDetailsPanel({
  pokemon,
}: {
  pokemon: PokemonDossier
}) {
  return (
    <section
      aria-labelledby="selected-pokemon-heading"
      className="order-1 w-full bg-gray-700 motion-safe:animate-[dossier-reveal_240ms_ease-out] md:order-2"
    >
      <h2
        id="selected-pokemon-heading"
        className="flex justify-between border-b-2 border-solid border-b-gray-800 p-5 text-xl sm:p-6 sm:text-2xl md:p-8"
      >
        <span
          className="tracking-wide"
          title={ACCESSIBLE_ATTRIBUTE_TITLES.name}
        >
          {pokemon.name}
        </span>
        <span
          className="tracking-widest text-yellow-400"
          title={ACCESSIBLE_ATTRIBUTE_TITLES.number}
        >
          #{pokemon.number}
        </span>
      </h2>
      <div className="grid gap-3 p-4 md:h-104 md:content-between">
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <PokemonAttribute
            title="category"
            attribute="Category"
            value={`“${pokemon.category}”`}
            className="col-start-1 row-start-2 sm:row-start-1"
          />
          <div className="col-span-2 row-start-1 flex items-center justify-center sm:col-span-1 sm:col-start-2">
            <PokemonImage
              size="h-16 w-16"
              imageUrl={pokemon.imageUrl}
              altText={pokemon.name}
            />
          </div>
          <PokemonAttribute
            title="types"
            attribute="Types"
            value={pokemon.types.join(", ")}
            className="col-start-2 row-start-2 sm:col-start-3 sm:row-start-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <PokemonAttribute
            title="baseStatTotal"
            attribute="Base Stat Total"
            value={String(pokemon.baseStatTotal)}
          />
          <PokemonAttribute
            title="baseHp"
            attribute="Base HP"
            value={String(pokemon.baseStats.hp)}
          />
          <PokemonAttribute
            title="baseSpeed"
            attribute="Base Speed"
            value={String(pokemon.baseStats.speed)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {pokemon.heightInMeters !== null && (
            <PokemonAttribute
              title="height"
              attribute="Height"
              value={`${pokemon.heightInMeters} m`}
            />
          )}
          {pokemon.weightInKilograms !== null && (
            <PokemonAttribute
              title="weight"
              attribute="Weight"
              value={`${pokemon.weightInKilograms} kg`}
            />
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <PokemonAttribute
            title="generation"
            attribute="Debut"
            value={pokemon.generation}
          />
          <PokemonAttribute
            title="abilities"
            attribute="Abilities"
            value={pokemon.abilities
              .map(({ isHidden, name }) =>
                isHidden ? `${name} (Hidden)` : name,
              )
              .join(", ")}
          />
        </div>
        {pokemon.baseExperience !== null && (
          <PokemonAttribute
            title="baseExperience"
            attribute="Base Experience"
            value={String(pokemon.baseExperience)}
          />
        )}
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
