import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import PokedexPage, {
  dynamicParams,
  generateStaticParams,
} from "@/app/[id]/page"
import { MAX_POKEMON_NUMBER } from "@/data/pokemonCatalog"

describe("App Router Pokédex route", () => {
  it("owns every canonical Pokédex number as a unique static parameter", () => {
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

  it("resolves route parameters from the local dossier without fetching", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
    const routeContent = await PokedexPage({
      params: Promise.resolve({ id: "2" }),
    })

    render(routeContent)

    expect(
      screen.getByRole("heading", { level: 2, name: "Ivysaur #0002" }),
    ).toBeVisible()
    expect(screen.getByRole("link", { name: "0002 Ivysaur" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByRole("link", { name: "1025 Pecharunt" })).toBeVisible()
    expect(fetchSpy).not.toHaveBeenCalled()

    fetchSpy.mockRestore()
  })
})
