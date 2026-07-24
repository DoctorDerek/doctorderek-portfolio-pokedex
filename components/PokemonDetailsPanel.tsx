import PokemonBaseStats from "@/components/PokemonBaseStats"
import PokemonImage from "@/components/PokemonImage"
import { POKEDEX_WORKSPACE_SECTION_IDS } from "@/data/pokedexWorkspace"
import type { PokemonDossier } from "@/types/pokemon"
import classNames from "@/utils/classNames"

type DirectAccessiblePokemonAttribute = keyof Pick<
  PokemonDossier,
  | "abilities"
  | "baseExperience"
  | "baseStatTotal"
  | "baseHappiness"
  | "category"
  | "captureRate"
  | "generation"
  | "habitat"
  | "heightInMeters"
  | "isLegendary"
  | "isMythical"
  | "shape"
  | "color"
  | "name"
  | "number"
  | "weightInKilograms"
  | "types"
>

type AccessiblePokemonBaseStat = keyof Pick<
  PokemonDossier["baseStats"],
  "hp" | "attack" | "defense" | "specialAttack" | "specialDefense" | "speed"
>

type AccessiblePokemonAttribute =
  DirectAccessiblePokemonAttribute | `baseStats.${AccessiblePokemonBaseStat}`

const ACCESSIBLE_ATTRIBUTE_TITLES: Record<AccessiblePokemonAttribute, string> =
  {
    abilities: "The abilities of this Pokémon",
    baseExperience: "The base experience awarded by this Pokémon",
    baseHappiness: "The baseline happiness tendency for this Pokémon",
    "baseStats.hp": "The base Hit Points of this Pokémon",
    "baseStats.attack": "The base Attack of this Pokémon",
    "baseStats.defense": "The base Defense of this Pokémon",
    "baseStats.specialAttack": "The base Special Attack of this Pokémon",
    "baseStats.specialDefense": "The base Special Defense of this Pokémon",
    "baseStats.speed": "The base Speed of this Pokémon",
    captureRate: "The catch success likelihood for this Pokémon",
    color: "The color category used for this Pokémon",
    habitat: "The habitat where this Pokémon is typically found",
    isLegendary: "Whether this Pokémon is officially marked as legendary",
    isMythical: "Whether this Pokémon is officially marked as mythical",
    shape: "The dominant structural shape of this Pokémon",
    baseStatTotal: "The total of this Pokémon’s six base stats",
    category: "The category of this Pokémon",
    generation: "The generation in which this Pokémon debuted",
    heightInMeters: "The canonical height of this Pokémon",
    name: "The name of this Pokémon",
    number: "The National Pokédex identifier of this Pokémon",
    types: "The type or types of this Pokémon",
    weightInKilograms: "The canonical weight of this Pokémon",
  } as const

export default function PokemonDetailsPanel({
  pokemon,
}: {
  pokemon: PokemonDossier
}) {
  return (
    <section
      id={POKEDEX_WORKSPACE_SECTION_IDS.dossier}
      aria-labelledby="selected-pokemon-heading"
      tabIndex={-1}
      className="order-1 w-full scroll-mt-20 bg-gray-700 motion-safe:animate-[dossier-reveal_240ms_ease-out] md:order-2"
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
            title="isLegendary"
            attribute="Legendary"
            value={pokemon.isLegendary ? "Yes" : "No"}
          />
          <PokemonAttribute
            title="isMythical"
            attribute="Mythical"
            value={pokemon.isMythical ? "Yes" : "No"}
          />
        </div>
        <PokemonBaseStats baseStats={pokemon.baseStats} />
        <div className="grid gap-3 sm:grid-cols-2">
          {pokemon.heightInMeters !== null && (
            <PokemonAttribute
              title="heightInMeters"
              attribute="Height"
              value={`${pokemon.heightInMeters} m`}
            />
          )}
          {pokemon.weightInKilograms !== null && (
            <PokemonAttribute
              title="weightInKilograms"
              attribute="Weight"
              value={`${pokemon.weightInKilograms} kg`}
            />
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {pokemon.baseHappiness !== null && (
            <PokemonAttribute
              title="baseHappiness"
              attribute="Base Happiness"
              value={String(pokemon.baseHappiness)}
            />
          )}
          {pokemon.captureRate !== null && (
            <PokemonAttribute
              title="captureRate"
              attribute="Capture Rate"
              value={String(pokemon.captureRate)}
            />
          )}
          {pokemon.habitat !== null && (
            <PokemonAttribute
              title="habitat"
              attribute="Habitat"
              value={pokemon.habitat}
            />
          )}
          {pokemon.shape !== null && (
            <PokemonAttribute
              title="shape"
              attribute="Shape"
              value={pokemon.shape}
            />
          )}
          {pokemon.color !== null && (
            <PokemonAttribute
              title="color"
              attribute="Color"
              value={pokemon.color}
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
      <dt className="font-semibold underline">{attribute}</dt>
      <dd className="break-words">{value}</dd>
    </dl>
  )
}
