import { expect, test } from "@playwright/test"
import { POKEMON_GRAPHQL_ENDPOINT } from "@/data/pokemonSearch"
import type { AdvancedPokemonSearchQueryVariables } from "@/graphql/pokemonSearch.generated"

interface GraphqlSearchRequestBody {
  variables: AdvancedPokemonSearchQueryVariables
}

test.describe("GraphQL Pokémon research", () => {
  test("submits one bounded request and reuses the identical result", async ({
    page,
  }) => {
    let requestCount = 0

    await page.route(POKEMON_GRAPHQL_ENDPOINT, async (route) => {
      requestCount += 1

      const { variables } = route
        .request()
        .postDataJSON() as GraphqlSearchRequestBody

      expect(variables).toMatchObject({
        limit: 20,
        maximumPokemonId: 1_025,
        namePattern: "%pikachu%",
        orderByNumber: true,
      })

      await route.fulfill({
        body: JSON.stringify({
          data: {
            byNumber: [
              {
                base_experience: 112,
                id: 25,
                name: "pikachu",
                pokemonspecy: {
                  generation: { name: "generation-i" },
                  is_legendary: false,
                  is_mythical: false,
                  pokemonspeciesnames: [{ name: "Pikachu" }],
                },
                pokemontypes: [{ type: { name: "electric" } }],
              },
            ],
          },
        }),
        contentType: "application/json",
        status: 200,
      })
    })
    await page.goto("/1")
    const pokemonName = page.getByRole("searchbox", { name: "Pokémon name" })
    const graphqlSearch = page.getByRole("button", { name: "GraphQL Search" })

    await pokemonName.fill("Pikachu")

    expect(requestCount).toBe(0)

    await graphqlSearch.click()

    await expect(page.getByRole("link", { name: /Pikachu/ })).toHaveAttribute(
      "href",
      "/25",
    )
    expect(requestCount).toBe(1)

    await graphqlSearch.click()

    await expect(page.getByRole("link", { name: /Pikachu/ })).toBeVisible()
    expect(requestCount).toBe(1)
  })
})
