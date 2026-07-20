import { render, screen } from "@testing-library/react"
import { graphql, HttpResponse } from "msw"
import type { AppProps } from "next/app"
import { describe, expect, it } from "vitest"
import { usePokemonCatalogQuery } from "@/graphql/generated"
import MyApp from "@/pages/_app"
import { BULBASAUR_FIXTURE } from "@/tests/fixtures/pokemon"
import { pokemonApiServer } from "@/tests/mocks/pokemonApiServer"
import { GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"

function PokemonQueryConsumer() {
  const { data, error, isPending } = usePokemonCatalogQuery(
    { endpoint: GRAPHQL_API_ENDPOINT },
    { first: 1 },
    { retry: false },
  )

  if (isPending) return <p>Loading Pokémon…</p>
  if (error instanceof Error) return <p role="alert">{error.message}</p>

  return <p>{data?.pokemons?.[0]?.name}</p>
}

describe("MyApp", () => {
  it("provides TanStack Query to generated Pokémon hooks", async () => {
    pokemonApiServer.use(
      graphql
        .link(GRAPHQL_API_ENDPOINT)
        .query("PokemonCatalog", ({ variables }) => {
          expect(variables).toEqual({ first: 1 })

          return HttpResponse.json({
            data: { pokemons: [BULBASAUR_FIXTURE] },
          })
        }),
    )

    render(
      <MyApp
        Component={PokemonQueryConsumer}
        pageProps={{}}
        router={{} as AppProps["router"]}
      />,
    )

    expect(screen.getByText("Loading Pokémon…")).toBeInTheDocument()
    expect(await screen.findByText("Bulbasaur")).toBeInTheDocument()
  })

  it("surfaces GraphQL failures through generated Pokémon hooks", async () => {
    pokemonApiServer.use(
      graphql.link(GRAPHQL_API_ENDPOINT).query("PokemonCatalog", () =>
        HttpResponse.json({
          errors: [{ message: "Pokémon registry unavailable." }],
        }),
      ),
    )

    render(
      <MyApp
        Component={PokemonQueryConsumer}
        pageProps={{}}
        router={{} as AppProps["router"]}
      />,
    )

    expect(screen.getByText("Loading Pokémon…")).toBeInTheDocument()
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Pokémon registry unavailable.",
    )
  })
})
