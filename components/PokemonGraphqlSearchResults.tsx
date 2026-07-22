import Link from "next/link"
import type { PokemonSearchResultFragment } from "@/graphql/pokemonSearch.generated"

export type PokemonGraphqlSearchResultsState =
  | { status: "idle" }
  | { status: "loading" }
  | { message: string; status: "error" }
  | {
      pokemons: ReadonlyArray<PokemonSearchResultFragment>
      status: "success"
    }

export default function PokemonGraphqlSearchResults({
  state,
}: {
  state: PokemonGraphqlSearchResultsState
}) {
  if (state.status === "idle")
    return (
      <p className="rounded-lg border border-dashed border-gray-600 p-4 text-gray-300">
        Configure the research fields, then run GraphQL Search. Editing these
        fields does not make network requests.
      </p>
    )

  if (state.status === "loading")
    return (
      <p
        role="status"
        aria-live="polite"
        className="rounded-lg border border-gray-600 p-4 text-gray-200 motion-safe:animate-pulse"
      >
        Querying the PokéAPI research index…
      </p>
    )

  if (state.status === "error")
    return (
      <div
        role="alert"
        className="rounded-lg border-2 border-red-400 bg-red-950/40 p-4 text-red-100"
      >
        <p className="font-bold">GraphQL Search couldn’t complete.</p>
        <p className="mt-1">{state.message}</p>
        <p className="mt-2 text-sm">
          Your research fields are preserved. Submit again to retry.
        </p>
      </div>
    )

  if (state.pokemons.length === 0)
    return (
      <p role="status" className="rounded-lg border border-gray-600 p-4">
        No Pokémon matched this GraphQL research query.
      </p>
    )

  return (
    <section aria-labelledby="graphql-search-results-heading">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 id="graphql-search-results-heading" className="text-lg font-bold">
          Research results
        </h3>
        <p role="status" aria-live="polite" className="text-sm text-gray-300">
          {state.pokemons.length.toLocaleString("en-US")} found
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {state.pokemons.map((pokemon) => {
          const species = pokemon.pokemonspecy
          const pokemonName =
            species?.pokemonspeciesnames[0]?.name ??
            formatPokemonIdentifier(pokemon.name)
          const generation = species?.generation
            ? formatPokemonIdentifier(species.generation.name)
            : "Generation unknown"
          const classifications = [
            species?.is_legendary ? "Legendary" : undefined,
            species?.is_mythical ? "Mythical" : undefined,
          ].filter((classification) => classification !== undefined)
          const pokemonTypes = pokemon.pokemontypes.flatMap(({ type }) =>
            type ? [formatPokemonIdentifier(type.name)] : [],
          )

          return (
            <li key={pokemon.id}>
              <Link
                href={`/${pokemon.id}`}
                prefetch={false}
                className="group block h-full rounded-lg border-2 border-gray-600 bg-gray-800 p-4 hover:border-yellow-400 hover:bg-gray-700 motion-safe:transition-[background-color,border-color,transform] motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-yellow-400">
                      #{String(pokemon.id).padStart(4, "0")}
                    </p>
                    <h4 className="text-lg font-bold group-hover:text-yellow-300">
                      {pokemonName}
                    </h4>
                  </div>
                  <p className="text-right text-sm text-gray-300">
                    Base XP
                    <strong className="block text-base text-white">
                      {pokemon.base_experience ?? "—"}
                    </strong>
                  </p>
                </div>
                <dl className="mt-3 space-y-1 text-sm text-gray-300">
                  <div className="flex gap-2">
                    <dt className="font-bold text-gray-100">Type</dt>
                    <dd>{pokemonTypes.join(" · ") || "Unknown"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-bold text-gray-100">Debut</dt>
                    <dd>{generation}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-bold text-gray-100">Class</dt>
                    <dd>{classifications.join(" · ") || "Standard"}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function formatPokemonIdentifier(identifier: string) {
  return identifier
    .split("-")
    .map(
      (word) => `${word.charAt(0).toLocaleUpperCase("en-US")}${word.slice(1)}`,
    )
    .join(" ")
}
