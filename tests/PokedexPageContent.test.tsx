import { render, screen } from "@testing-library/react"
import { graphql, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import ApplicationProviders from "@/app/providers"
import PokedexPageContent from "@/components/PokedexPageContent"
import {
  BULBASAUR_FIXTURE,
  IVYSAUR_FIXTURE,
  POKEMON_CATALOG_FIXTURES,
} from "@/tests/fixtures/pokemon"
import { pokemonApiServer } from "@/tests/mocks/pokemonApiServer"
import { GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"

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
            pokemon: IVYSAUR_FIXTURE,
            pokemons: [BULBASAUR_FIXTURE],
          }}
          id="2"
        />
      </ApplicationProviders>,
    )

    expect(
      screen.getByRole("region", { name: "Ivysaur #002" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "002 Ivysaur" }),
    ).toHaveAttribute("aria-current", "page")
    expect(
      await screen.findByRole("link", { name: "004 Charmander" }),
    ).toBeInTheDocument()
  })

  it("reports a missing selected Pokémon without rendering an empty shell", () => {
    render(
      <PokedexPageContent
        data={{ pokemon: null, pokemons: [BULBASAUR_FIXTURE] }}
        id="152"
      />,
    )

    expect(screen.getByText("Sorry, Pokémon #152 not found 😔.")).toBeVisible()
    expect(
      screen.queryByRole("region", { name: "Pokémon discovery" }),
    ).not.toBeInTheDocument()
  })
})
