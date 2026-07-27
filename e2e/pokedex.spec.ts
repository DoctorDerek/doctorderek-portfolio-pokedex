import { expect, test, type Locator } from "@playwright/test"

const MOBILE_VIEWPORT = { width: 320, height: 800 }
const DESKTOP_VIEWPORT = { width: 1280, height: 720 }

async function getThemeArtworkTransitionDuration(themeToggle: Locator) {
  return themeToggle.evaluate((element) => {
    const sun = element.querySelector(".pokedex-theme-toggle-sun")

    if (!sun) throw new Error("The day-night artwork is unavailable.")

    return getComputedStyle(sun).transitionDuration
  })
}

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

  test("keeps the selected dossier inside its prepared local context", async ({
    page,
  }) => {
    await page.goto("/500")

    const catalog = page.getByRole("navigation", { name: "Pokémon catalog" })
    const catalogLinks = catalog.getByRole("link")

    await expect
      .poll(async () => catalogLinks.count())
      .toBeGreaterThanOrEqual(21)
    await expect(catalog.locator('a[href="/490"]')).toHaveCount(1)
    await expect(catalog.locator('a[href="/510"]')).toHaveCount(1)
    await expect(catalog.locator('a[aria-current="page"]')).toHaveAttribute(
      "href",
      "/500",
    )
  })

  test("prepares more local entries before either scroll boundary", async ({
    page,
  }) => {
    const applicationDataRequests: string[] = []

    page.on("request", (request) => {
      if (["document", "fetch", "xhr"].includes(request.resourceType()))
        applicationDataRequests.push(request.url())
    })

    await page.goto("/500")

    const catalog = page.getByRole("navigation", { name: "Pokémon catalog" })
    const applicationOrigin = new URL(page.url()).origin

    await expect(catalog.locator('a[href="/470"]')).toHaveCount(1)
    await expect(catalog.locator('a[href="/530"]')).toHaveCount(1)
    await expect(catalog.getByRole("link")).toHaveCount(61)

    applicationDataRequests.length = 0

    await catalog.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    await expect(catalog.locator('a[href="/550"]')).toHaveCount(1)
    await expect(catalog.getByRole("link")).toHaveCount(101)

    await catalog.evaluate((element) => {
      element.scrollTop = 0
    })
    await expect(catalog.locator('a[href="/430"]')).toHaveCount(1)
    await expect(catalog.getByRole("link")).toHaveCount(141)

    await catalog.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    await expect(catalog.locator('a[href="/590"]')).toHaveCount(1)
    await expect(catalog.getByRole("link")).toHaveCount(181)

    await catalog.evaluate((element) => {
      element.scrollTop = 0
    })
    await expect(catalog.locator('a[href="/390"]')).toHaveCount(1)
    await expect(catalog.getByRole("link")).toHaveCount(221)
    expect(
      applicationDataRequests.filter((requestUrl) =>
        requestUrl.startsWith(applicationOrigin),
      ),
    ).toEqual([])
  })
})

test.describe("mobile Pokédex", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test("offers touch-safe direct navigation among research regions", async ({
    page,
  }) => {
    await page.goto("/740")

    const workspaceNavigation = page.getByRole("navigation", {
      name: "Pokédex research workspace",
    })
    const destinations = [
      { id: "graphql-search", label: "GraphQL Search" },
      { id: "local-pokedex", label: "Local Pokédex" },
      { id: "pokemon-dossier", label: "Dossier" },
    ] as const

    for (const { id, label } of destinations) {
      const destinationLink = workspaceNavigation.getByRole("link", {
        name: label,
      })

      await expect(destinationLink).toHaveAttribute("href", `#${id}`)
      expect(
        await destinationLink.evaluate(
          (element) => element.getBoundingClientRect().height,
        ),
      ).toBeGreaterThanOrEqual(44)

      await destinationLink.click()

      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`#${id}`)).toBeFocused()
    }
  })

  test("contains long dossier content in natural document scrolling", async ({
    page,
  }) => {
    await page.goto("/740")

    const selectedPokemon = page.getByRole("region", {
      name: "Crabominable #0740",
    })
    const localPokedex = page.getByRole("region", {
      name: "Local Pokédex",
    })
    const graphqlSearch = page.getByRole("region", {
      name: "GraphQL Search",
    })
    const workspaceNavigation = page.getByRole("navigation", {
      name: "Pokédex research workspace",
    })

    await expect(
      selectedPokemon.getByText("Hyper Cutter, Iron Fist, Anger Point"),
    ).toBeVisible()

    for (const region of [
      workspaceNavigation,
      selectedPokemon,
      localPokedex,
      graphqlSearch,
    ]) {
      const bounds = await region.evaluate((element) => {
        const rectangle = element.getBoundingClientRect()
        return { left: rectangle.left, right: rectangle.right }
      })

      expect(bounds.left).toBeGreaterThanOrEqual(0)
      expect(bounds.right).toBeLessThanOrEqual(MOBILE_VIEWPORT.width)
    }

    const pageMeasurements = await page.evaluate(() => ({
      documentHeight: document.documentElement.scrollHeight,
      documentWidth: document.documentElement.scrollWidth,
      viewportHeight: document.documentElement.clientHeight,
      viewportWidth: document.documentElement.clientWidth,
    }))
    const catalogOverflow = await page
      .getByRole("navigation", { name: "Pokémon catalog" })
      .evaluate((element) => getComputedStyle(element).overflowY)

    expect(pageMeasurements.documentHeight).toBeGreaterThan(
      pageMeasurements.viewportHeight,
    )
    expect(pageMeasurements.documentWidth).toBeLessThanOrEqual(
      pageMeasurements.viewportWidth,
    )
    expect(catalogOverflow).toBe("visible")
  })

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

  test("hydrates more catalog entries when scrolling up and down repeatedly", async ({
    page,
  }) => {
    const applicationDataRequests: string[] = []

    page.on("request", (request) => {
      if (["document", "fetch", "xhr"].includes(request.resourceType()))
        applicationDataRequests.push(request.url())
    })

    await page.goto("/500")

    const catalog = page.getByRole("navigation", { name: "Pokémon catalog" })
    const applicationOrigin = new URL(page.url()).origin
    const links = catalog.getByRole("link")
    await expect(catalog.locator('a[href="/470"]')).toHaveCount(1)
    await expect(catalog.locator('a[href="/530"]')).toHaveCount(1)
    await expect(links).toHaveCount(61)
    const initialVisibleCount = await links.count()

    applicationDataRequests.length = 0

    expect(initialVisibleCount).toBeGreaterThanOrEqual(21)

    await page.mouse.wheel(0, 900)
    await expect
      .poll(async () => links.count())
      .toBeGreaterThan(initialVisibleCount)
    await expect(catalog.locator('a[href="/550"]')).toHaveCount(1)

    const downExpandedCount = await links.count()
    expect(downExpandedCount).toBeGreaterThan(initialVisibleCount)

    await page.mouse.wheel(0, -900)
    await expect
      .poll(async () => links.count())
      .toBeGreaterThan(downExpandedCount)
    await expect(catalog.locator('a[href="/450"]')).toHaveCount(1)

    expect(
      applicationDataRequests.filter((requestUrl) =>
        requestUrl.startsWith(applicationOrigin),
      ),
    ).toEqual([])
  })

  test("prioritizes the selected dossier before catalog discovery", async ({
    page,
  }) => {
    await page.goto("/1")

    const selectedPokemon = page.getByRole("region", {
      name: "Bulbasaur #0001",
    })
    const discovery = page.getByRole("region", {
      name: "Local Pokédex",
    })

    await expect(selectedPokemon).toBeVisible()
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

    const localDiscovery = page.getByRole("region", {
      name: "Local Pokédex",
      exact: true,
    })
    await expect(
      localDiscovery
        .getByRole("navigation", { name: "Pokémon catalog" })
        .locator('a[href="/25"]'),
    ).toHaveCount(1)

    const pokemonSearch = localDiscovery.getByRole("searchbox", {
      name: "Search Pokémon",
    })
    const pokemonType = localDiscovery.getByRole("combobox", { name: "Type" })
    const pokemonSort = localDiscovery.getByRole("combobox", { name: "Sort" })
    const resetFilters = localDiscovery.getByRole("button", {
      name: "Reset filters",
    })

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
      name: "Local Pokédex",
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

test.describe("Pokédex themes", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("uses an accessible day-night toggle and persists an explicit choice", async ({
    page,
  }) => {
    await page.emulateMedia({
      colorScheme: "light",
      reducedMotion: "no-preference",
    })
    await page.goto("/1")

    const themeToggle = page.getByRole("button", {
      name: "Switch to dark theme",
    })

    await expect(themeToggle).toHaveAttribute("aria-pressed", "false")
    expect(await getThemeArtworkTransitionDuration(themeToggle)).toBe("0.8s")

    await themeToggle.click()
    await expect(
      page.getByRole("button", { name: "Switch to light theme" }),
    ).toHaveAttribute("aria-pressed", "true")

    await page.reload()
    await expect(
      page.getByRole("button", { name: "Switch to light theme" }),
    ).toHaveAttribute("aria-pressed", "true")
  })
})

test.describe("reduced-motion Pokédex", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("removes nonessential dossier and catalog motion", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" })
    await page.goto("/1")

    const selectedPokemon = page.getByRole("region", {
      name: "Bulbasaur #0001",
    })
    const currentPokemonLink = page.getByRole("link", {
      name: "0001 Bulbasaur",
    })
    const themeToggle = page.getByRole("button", {
      name: "Switch to dark theme",
    })

    await expect(selectedPokemon).toBeVisible()
    await expect(currentPokemonLink).toBeVisible()
    await expect(themeToggle).toBeVisible()
    await expect(page.getByRole("button", { name: /motion/i })).toHaveCount(0)
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
    expect(await getThemeArtworkTransitionDuration(themeToggle)).toBe("0s")
  })
})
