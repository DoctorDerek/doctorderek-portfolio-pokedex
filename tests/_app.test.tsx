import { render, screen } from "@testing-library/react"
import type { AppProps } from "next/app"
import { afterEach, describe, expect, it, vi } from "vitest"
import { usePokemonsQuery } from "@/graphql/generated"
import MyApp from "@/pages/_app"
import { GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"

const POKEMON_QUERY_RESPONSE = {
  data: {
    pokemons: [{ name: "Bulbasaur" }],
  },
}

function PokemonQueryConsumer() {
  const { data, isPending } = usePokemonsQuery(
    { endpoint: GRAPHQL_API_ENDPOINT },
    { first: 1 },
  )

  if (isPending) return <p>Loading Pokémon…</p>

  return <p>{data?.pokemons?.[0]?.name}</p>
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("MyApp", () => {
  it("provides TanStack Query to generated Pokémon hooks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(POKEMON_QUERY_RESPONSE), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }),
        ),
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
    expect(await screen.findByText("Bulbasaur")).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(
      GRAPHQL_API_ENDPOINT,
      expect.objectContaining({ method: "POST" }),
    )
  })
})
