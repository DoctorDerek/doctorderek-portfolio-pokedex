import { expect, test } from "@playwright/test"
import { POKEMON_GRAPHQL_ENDPOINT } from "@/data/pokemonSearch"
import type { AdvancedPokemonSearchQueryVariables } from "@/graphql/pokemonSearch.generated"

interface GraphqlSearchRequestBody {
  variables: AdvancedPokemonSearchQueryVariables
}

const MOBILE_VIEWPORT = { width: 320, height: 800 }
const PIKACHU_GRAPHQL_RESPONSE = {
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
        body: JSON.stringify(PIKACHU_GRAPHQL_RESPONSE),
        contentType: "application/json",
        status: 200,
      })
    })
    await page.goto("/1")
    await expect(
      page
        .getByRole("navigation", { name: "Pokémon catalog" })
        .locator('a[href="/25"]'),
    ).toHaveCount(1)

    const graphqlSearchRegion = page.getByRole("region", {
      name: "GraphQL Search",
    })
    const pokemonName = page.getByRole("searchbox", { name: "Pokémon name" })
    const graphqlSearch = page.getByRole("button", { name: "GraphQL Search" })

    await pokemonName.fill("Pikachu")

    expect(requestCount).toBe(0)

    await graphqlSearch.click()

    await expect(
      graphqlSearchRegion.getByRole("link", { name: /Pikachu/ }),
    ).toHaveAttribute("href", "/25")
    expect(requestCount).toBe(1)

    await graphqlSearch.click()

    await expect(
      graphqlSearchRegion.getByRole("link", { name: /Pikachu/ }),
    ).toBeVisible()
    expect(requestCount).toBe(1)
  })
})

test.describe("mobile GraphQL Pokémon research", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test("keeps research controls and results contained and touchable", async ({
    page,
  }) => {
    await page.route(POKEMON_GRAPHQL_ENDPOINT, async (route) => {
      await route.fulfill({
        body: JSON.stringify(PIKACHU_GRAPHQL_RESPONSE),
        contentType: "application/json",
        status: 200,
      })
    })
    await page.goto("/1")
    await expect(
      page
        .getByRole("navigation", { name: "Pokémon catalog" })
        .locator('a[href="/25"]'),
    ).toHaveCount(1)
    await page
      .getByRole("navigation", { name: "Pokédex research workspace" })
      .getByRole("link", { name: "GraphQL Search" })
      .click()

    const graphqlSearchRegion = page.getByRole("region", {
      name: "GraphQL Search",
    })
    const pokemonName = graphqlSearchRegion.getByRole("searchbox", {
      name: "Pokémon name",
    })
    const searchButton = graphqlSearchRegion.getByRole("button", {
      name: "GraphQL Search",
    })
    const catalogLinks = page
      .getByRole("navigation", { name: "Pokémon catalog" })
      .getByRole("link")

    await graphqlSearchRegion.scrollIntoViewIfNeeded()
    await expect(catalogLinks).toHaveCount(1_025, { timeout: 15_000 })
    await expect(searchButton).toBeInViewport()

    for (const control of [pokemonName, searchButton]) {
      expect(
        await control.evaluate(
          (element) => element.getBoundingClientRect().height,
        ),
      ).toBeGreaterThanOrEqual(44)
    }

    await pokemonName.fill("Pikachu")
    await searchButton.click()

    const result = graphqlSearchRegion.getByRole("link", { name: /Pikachu/ })

    await expect(result).toBeVisible()
    const resultBounds = await result.evaluate((element) => {
      const rectangle = element.getBoundingClientRect()
      return { left: rectangle.left, right: rectangle.right }
    })
    const pageWidths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }))

    expect(resultBounds.left).toBeGreaterThanOrEqual(0)
    expect(resultBounds.right).toBeLessThanOrEqual(MOBILE_VIEWPORT.width)
    expect(pageWidths.document).toBeLessThanOrEqual(pageWidths.viewport)
  })
})
