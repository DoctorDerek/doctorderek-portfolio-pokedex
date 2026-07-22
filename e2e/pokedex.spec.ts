import { expect, test } from "@playwright/test"

const MOBILE_VIEWPORT = { width: 320, height: 800 }
const DESKTOP_VIEWPORT = { width: 1280, height: 720 }

test.describe("App Router Pokédex entry points", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("redirects the root to the canonical first dossier", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page).toHaveURL(/\/1$/)
    await expect(
      page.getByRole("heading", { level: 2, name: "Bulbasaur #0001" }),
    ).toBeVisible()
  })

  test("rejects dossier numbers outside the generated static catalog", async ({
    page,
  }) => {
    const response = await page.goto("/1026")

    expect(response?.status()).toBe(404)
  })

  test("centers the default catalog around the selected dossier", async ({
    page,
  }) => {
    await page.goto("/500")

    const catalog = page.getByRole("navigation", { name: "Pokémon catalog" })
    const catalogLinks = catalog.getByRole("link")

    await expect(catalogLinks).toHaveCount(21)
    await expect(catalogLinks.first()).toHaveAttribute("href", "/490")
    await expect(catalogLinks.last()).toHaveAttribute("href", "/510")
    await expect(catalog.locator('a[aria-current="page"]')).toHaveAttribute(
      "href",
      "/500",
    )
  })
})

test.describe("mobile Pokédex", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test("contains the interface while navigating between Pokémon", async ({
    page,
  }) => {
    await page.goto("/1")

    await expect(
      page.getByRole("heading", { level: 2, name: "Bulbasaur #0001" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "0001 Bulbasaur" }),
    ).toHaveAttribute("aria-current", "page")

    const pageWidths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }))

    expect(pageWidths.document).toBeLessThanOrEqual(pageWidths.viewport)

    await page.getByRole("link", { name: "0002 Ivysaur" }).click()

    await expect(page).toHaveURL(/\/2$/)
    await expect(
      page.getByRole("heading", { level: 2, name: "Ivysaur #0002" }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "0002 Ivysaur" }),
    ).toHaveAttribute("aria-current", "page")
  })

  test("prioritizes the selected dossier before catalog discovery", async ({
    page,
  }) => {
    await page.goto("/1")

    const selectedPokemon = page.getByRole("region", {
      name: "Bulbasaur #0001",
    })
    const discovery = page.getByRole("region", {
      name: "Pokémon discovery",
    })

    await selectedPokemon.evaluate((element) =>
      Promise.all(
        element.getAnimations().map((animation) => animation.finished),
      ),
    )

    const selectedPokemonBounds = await selectedPokemon.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      return { bottom: bounds.bottom, top: bounds.top }
    })
    const discoveryBounds = await discovery.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      return { top: bounds.top }
    })

    expect(selectedPokemonBounds.top).toBeLessThan(discoveryBounds.top)
    expect(selectedPokemonBounds.bottom).toBeCloseTo(discoveryBounds.top, 3)
  })

  test("keeps discovery controls touchable and filters immediately", async ({
    page,
  }) => {
    await page.goto("/1")

    const pokemonSearch = page.getByRole("searchbox", {
      name: "Search Pokémon",
    })
    const pokemonType = page.getByRole("combobox", { name: "Type" })
    const pokemonSort = page.getByRole("combobox", { name: "Sort" })
    const resetFilters = page.getByRole("button", { name: "Reset filters" })

    for (const control of [
      pokemonSearch,
      pokemonType,
      pokemonSort,
      resetFilters,
    ]) {
      await expect(control).toBeVisible()
      expect(
        await control.evaluate(
          (element) => element.getBoundingClientRect().height,
        ),
      ).toBeGreaterThanOrEqual(44)
    }

    await pokemonSearch.fill("#0002")

    await expect(page.getByRole("link", { name: "0002 Ivysaur" })).toBeVisible()
    await expect(
      page.getByRole("link", { name: "0001 Bulbasaur" }),
    ).toBeHidden()

    await resetFilters.click()
    await expect(
      page.getByRole("link", { name: "0001 Bulbasaur" }),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "0021 Spearow" })).toBeVisible()
    await expect(
      page.getByRole("link", { name: "1025 Pecharunt" }),
    ).toBeHidden()
  })
})

test.describe("desktop Pokédex", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("presents the catalog and selected Pokémon as a split layout", async ({
    page,
  }) => {
    await page.goto("/1")

    const catalog = page.getByRole("region", {
      name: "Pokémon discovery",
      exact: true,
    })
    const selectedPokemon = page.getByRole("region", {
      name: "Bulbasaur #0001",
    })

    await expect(catalog).toBeVisible()
    await expect(selectedPokemon).toBeVisible()
    await selectedPokemon.evaluate((element) =>
      Promise.all(
        element.getAnimations().map((animation) => animation.finished),
      ),
    )

    const catalogBounds = await catalog.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      return { right: bounds.right, top: bounds.top }
    })
    const selectedPokemonBounds = await selectedPokemon.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      return { left: bounds.left, top: bounds.top }
    })

    expect(selectedPokemonBounds.top).toBeCloseTo(catalogBounds.top, 3)
    expect(selectedPokemonBounds.left).toBeCloseTo(catalogBounds.right, 3)
  })
})

test.describe("Pokédex motion feedback", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("reveals the selected dossier and animates catalog feedback", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await page.goto("/1")

    const selectedPokemon = page.getByRole("region", {
      name: "Bulbasaur #0001",
    })
    const currentPokemonLink = page.getByRole("link", {
      name: "0001 Bulbasaur",
    })

    await expect(selectedPokemon).toBeVisible()
    await expect(currentPokemonLink).toBeVisible()
    expect(
      await page.evaluate(
        () => matchMedia("(prefers-reduced-motion: no-preference)").matches,
      ),
    ).toBe(true)

    expect(
      await selectedPokemon.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
    ).toBe("dossier-reveal")
    expect(
      await currentPokemonLink.evaluate(
        (element) => getComputedStyle(element).transitionDuration,
      ),
    ).toBe("0.2s")
  })
})

test.describe("reduced-motion Pokédex", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("removes nonessential dossier and catalog motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/1")

    const selectedPokemon = page.getByRole("region", {
      name: "Bulbasaur #0001",
    })
    const currentPokemonLink = page.getByRole("link", {
      name: "0001 Bulbasaur",
    })

    await expect(selectedPokemon).toBeVisible()
    await expect(currentPokemonLink).toBeVisible()
    expect(
      await page.evaluate(
        () => matchMedia("(prefers-reduced-motion: reduce)").matches,
      ),
    ).toBe(true)

    expect(
      await selectedPokemon.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
    ).toBe("none")
    expect(
      await currentPokemonLink.evaluate(
        (element) => getComputedStyle(element).transitionDuration,
      ),
    ).toBe("0s")
  })
})
