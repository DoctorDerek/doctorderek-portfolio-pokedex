import { render, screen } from "@testing-library/react"
import { graphql, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import ApplicationProviders from "@/app/providers"
import PokedexPageContent from "@/components/PokedexPageContent"
import type {
  PokemonCatalogEntryFragment,
  PokemonDossierFragment,
} from "@/graphql/generated"
import {
  BULBASAUR_FIXTURE,
  IVYSAUR_FIXTURE,
  POKEMON_CATALOG_FIXTURES,
} from "@/tests/fixtures/pokemon"
import { pokemonApiServer } from "@/tests/mocks/pokemonApiServer"
import { GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"

const BULBASAUR_CATALOG_ENTRY: PokemonCatalogEntryFragment = {
  id: BULBASAUR_FIXTURE.id,
  image: BULBASAUR_FIXTURE.image ?? null,
  maxCP: BULBASAUR_FIXTURE.maxCP ?? null,
  name: BULBASAUR_FIXTURE.name ?? null,
  number: BULBASAUR_FIXTURE.number ?? null,
  types: BULBASAUR_FIXTURE.types ?? null,
}

const IVYSAUR_DOSSIER: PokemonDossierFragment = {
  attacks: null,
  classification: null,
  evolutionRequirements: null,
  evolutions: null,
  fleeRate: null,
  height: null,
  id: IVYSAUR_FIXTURE.id,
  image: IVYSAUR_FIXTURE.image ?? null,
  maxCP: IVYSAUR_FIXTURE.maxCP ?? null,
  maxHP: null,
  name: IVYSAUR_FIXTURE.name ?? null,
  number: IVYSAUR_FIXTURE.number ?? null,
  resistant: null,
  types: IVYSAUR_FIXTURE.types ?? null,
  weaknesses: null,
  weight: null,
}

describe("PokedexPageContent", () => {
  it("keeps the selected dossier available when it is outside the initial catalog", async () => {
    pokemonApiServer.use(
      graphql.link(GRAPHQL_API_ENDPOINT).query("PokemonCatalog", () =>
        HttpResponse.json({
          data: { pokemons: POKEMON_CATALOG_FIXTURES },
        }),
      ),
    )

    render(
      <ApplicationProviders>
        <PokedexPageContent
          data={{
            pokemon: IVYSAUR_DOSSIER,
            pokemons: [BULBASAUR_CATALOG_ENTRY],
          }}
          id="2"
        />
      </ApplicationProviders>,
    )

    expect(
      screen.getByRole("region", { name: "Ivysaur #002" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "002 Ivysaur" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(
      await screen.findByRole("link", { name: "004 Charmander" }),
    ).toBeInTheDocument()
  })

  it("reports a missing selected Pokémon without rendering an empty shell", () => {
    render(
      <PokedexPageContent
        data={{ pokemon: null, pokemons: [BULBASAUR_CATALOG_ENTRY] }}
        id="152"
      />,
    )

    expect(screen.getByText("Sorry, Pokémon #152 not found 😔.")).toBeVisible()
    expect(
      screen.queryByRole("region", { name: "Pokémon discovery" }),
    ).not.toBeInTheDocument()
  })
})
