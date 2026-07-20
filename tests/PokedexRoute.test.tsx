import { render, screen } from "@testing-library/react"
import { graphql, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import PokedexPage, {
  dynamicParams,
  generateStaticParams,
} from "@/app/[id]/page"
import ApplicationProviders from "@/app/providers"
import {
  BULBASAUR_FIXTURE,
  IVYSAUR_FIXTURE,
  POKEMON_CATALOG_FIXTURES,
} from "@/tests/fixtures/pokemon"
import { pokemonApiServer } from "@/tests/mocks/pokemonApiServer"
import { GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"
import {
  INITIAL_POKEMON_CATALOG_SIZE,
  MAX_POKEMON_NUMBER,
} from "@/utils/pokemonCatalog"

describe("App Router Pokédex route", () => {
  it("owns every original Pokédex number as a unique static parameter", () => {
    const staticParameters = generateStaticParams()

    expect(dynamicParams).toBe(false)
    expect(staticParameters).toHaveLength(MAX_POKEMON_NUMBER)
    expect(staticParameters.at(0)).toEqual({ id: "1" })
    expect(staticParameters.at(-1)).toEqual({
      id: String(MAX_POKEMON_NUMBER),
    })
    expect(new Set(staticParameters.map(({ id }) => id)).size).toBe(
      MAX_POKEMON_NUMBER,
    )
  })

  it("resolves async route parameters into the selected GraphQL dossier", async () => {
    pokemonApiServer.use(
      graphql
        .link(GRAPHQL_API_ENDPOINT)
        .query("PokedexPage", ({ variables }) => {
          expect(variables).toEqual({
            catalogSize: INITIAL_POKEMON_CATALOG_SIZE,
            pokemonId: "UG9rZW1vbjowMDI=",
          })

          return HttpResponse.json({
            data: {
              pokemon: IVYSAUR_FIXTURE,
              pokemons: [BULBASAUR_FIXTURE, IVYSAUR_FIXTURE],
            },
          })
        }),
      graphql.link(GRAPHQL_API_ENDPOINT).query("PokemonCatalog", () =>
        HttpResponse.json({
          data: { pokemons: POKEMON_CATALOG_FIXTURES },
        }),
      ),
    )
    const routeContent = await PokedexPage({
      params: Promise.resolve({ id: "2" }),
    })

    render(<ApplicationProviders>{routeContent}</ApplicationProviders>)

    expect(
      screen.getByRole("heading", { level: 2, name: "Ivysaur #002" }),
    ).toBeVisible()
    expect(screen.getByRole("link", { name: "002 Ivysaur" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(
      await screen.findByRole("link", { name: "004 Charmander" }),
    ).toBeVisible()
  })
})
