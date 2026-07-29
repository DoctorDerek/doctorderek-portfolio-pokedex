import Link from "next/link"
import { getPokemonDossierRoute } from "@/data/pokemonRoutes"
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
      <p className="border-outline text-muted rounded-lg border border-dashed p-4">
        Configure the research fields, then run GraphQL Search. Editing these
        fields does not make network requests.
      </p>
    )

  if (state.status === "loading")
    return (
      <p
        role="status"
        aria-live="polite"
        className="border-outline bg-panel text-muted rounded-lg border p-4 motion-safe:animate-pulse"
      >
        Querying the PokéAPI research index…
      </p>
    )

  if (state.status === "error")
    return (
      <div
        role="alert"
        className="border-danger bg-danger-surface rounded-lg border-2 p-4"
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
      <p
        role="status"
        className="border-outline text-muted rounded-lg border p-4"
      >
        No Pokémon matched this GraphQL research query.
      </p>
    )

  return (
    <section aria-labelledby="graphql-search-results-heading">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 id="graphql-search-results-heading" className="text-lg font-bold">
          Research results
        </h3>
        <p role="status" aria-live="polite" className="text-muted text-sm">
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
                href={getPokemonDossierRoute(pokemon.id)}
                prefetch={false}
                className="group border-outline bg-panel hover:border-brand hover:bg-panel-strong block h-full rounded-lg border-2 p-4 motion-safe:transition-[background-color,border-color,transform] motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-brand font-bold">
                      #{String(pokemon.id).padStart(4, "0")}
                    </p>
                    <h4 className="group-hover:text-brand-strong text-lg font-bold">
                      {pokemonName}
                    </h4>
                  </div>
                  <p className="text-muted text-right text-sm">
                    Base XP
                    <strong className="text-ink block text-base">
                      {pokemon.base_experience ?? "—"}
                    </strong>
                  </p>
                </div>
                <dl className="text-muted mt-3 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-ink font-bold">Type</dt>
                    <dd>{pokemonTypes.join(" · ") || "Unknown"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink font-bold">Debut</dt>
                    <dd>{generation}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink font-bold">Class</dt>
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
