import { expect, test } from "@playwright/test"

const MOBILE_VIEWPORT = { width: 320, height: 800 }
const DESKTOP_VIEWPORT = { width: 1280, height: 720 }

test.describe("mobile Pokédex", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test("contains the interface while navigating between Pokémon", async ({
    page,
  }) => {
    await page.goto("/1")

    await expect(
      page.getByRole("heading", { level: 2, name: "Bulbasaur #001" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "001 Bulbasaur" }),
    ).toHaveAttribute("aria-current", "page")

    const pageWidths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }))

    expect(pageWidths.document).toBeLessThanOrEqual(pageWidths.viewport)

    await page.getByRole("link", { name: "002 Ivysaur" }).click()

    await expect(page).toHaveURL(/\/2$/)
    await expect(
      page.getByRole("heading", { level: 2, name: "Ivysaur #002" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "002 Ivysaur" }),
    ).toHaveAttribute("aria-current", "page")
  })

  test("keeps pagination controls large enough for touch input", async ({
    page,
  }) => {
    await page.goto("/1")

    const nextPageLink = page.getByRole("link", { name: "Next" })
    const secondPageLink = page.getByRole("link", { name: "2", exact: true })

    await expect(nextPageLink).toBeVisible()
    await expect(secondPageLink).toBeVisible()

    const nextPageLinkHeight = await nextPageLink.evaluate(
      (element) => element.getBoundingClientRect().height,
    )
    const secondPageLinkHeight = await secondPageLink.evaluate(
      (element) => element.getBoundingClientRect().height,
    )

    expect(nextPageLinkHeight).toBeGreaterThanOrEqual(44)
    expect(secondPageLinkHeight).toBeGreaterThanOrEqual(44)
  })
})

test.describe("desktop Pokédex", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("presents the catalog and selected Pokémon as a split layout", async ({
    page,
  }) => {
    await page.goto("/1")

    const catalog = page.getByRole("navigation", {
      name: "Pokémon catalog",
      exact: true,
    })
    const selectedPokemon = page.getByRole("region", {
      name: "Bulbasaur #001",
    })

    await expect(catalog).toBeVisible()
    await expect(selectedPokemon).toBeVisible()

    const catalogBounds = await catalog.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      return { right: bounds.right, top: bounds.top }
    })
    const selectedPokemonBounds = await selectedPokemon.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      return { left: bounds.left, top: bounds.top }
    })

    expect(selectedPokemonBounds.top).toBe(catalogBounds.top)
    expect(selectedPokemonBounds.left).toBe(catalogBounds.right)
  })
})
