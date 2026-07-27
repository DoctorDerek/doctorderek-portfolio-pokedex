import type { PokemonDossier } from "@/types/pokemon"
import classNames from "@/utils/classNames"

type BaseStat = keyof PokemonDossier["baseStats"]

const BASE_STAT_LABELS: ReadonlyArray<{
  key: BaseStat
  label: string
  title: string
}> = [
  {
    key: "hp",
    label: "HP",
    title: "The base Hit Points of this Pokémon",
  },
  {
    key: "attack",
    label: "Attack",
    title: "The base Attack of this Pokémon",
  },
  {
    key: "defense",
    label: "Defense",
    title: "The base Defense of this Pokémon",
  },
  {
    key: "specialAttack",
    label: "Special Attack",
    title: "The base Special Attack of this Pokémon",
  },
  {
    key: "specialDefense",
    label: "Special Defense",
    title: "The base Special Defense of this Pokémon",
  },
  {
    key: "speed",
    label: "Speed",
    title: "The base Speed of this Pokémon",
  },
]

const MAX_BASE_STAT = 255

export default function PokemonBaseStats({
  baseStats,
}: {
  baseStats: PokemonDossier["baseStats"]
}) {
  return (
    <div className="grid gap-2">
      {BASE_STAT_LABELS.map((entry) => {
        const value = baseStats[entry.key]
        const percent = Math.max(
          0,
          Math.min((value / MAX_BASE_STAT) * 100, 100),
        )

        return (
          <dl
            key={entry.key}
            title={entry.title}
            className="rounded-md border-2 border-solid border-gray-400 p-2 text-sm"
          >
            <dt className="mb-1 flex items-center justify-between gap-2 font-semibold">
              <span>{entry.label}</span>
              <span>{value}</span>
            </dt>
            <dd>
              <div
                className="relative h-2 rounded-full bg-black/20"
                aria-hidden="true"
              >
                <span
                  role="presentation"
                  className={classNames(
                    "absolute inset-y-0 left-0 rounded-full",
                    percent < 25 ? "bg-yellow-500" : "bg-yellow-300",
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </dd>
          </dl>
        )
      })}
    </div>
  )
}
