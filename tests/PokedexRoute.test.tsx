import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import PokedexPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "@/app/pokemon/[id]/page"
import ApplicationProviders from "@/app/providers"
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

    render(<ApplicationProviders>{routeContent}</ApplicationProviders>)

    expect(
      screen.getByRole("heading", { level: 2, name: "Ivysaur #0002" }),
    ).toBeVisible()
    expect(screen.getByRole("link", { name: "0002 Ivysaur" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByRole("link", { name: "0021 Spearow" })).toBeVisible()
    expect(
      screen.queryByRole("link", { name: "1025 Pecharunt" }),
    ).not.toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()

    fetchSpy.mockRestore()
  })

  it("publishes canonical metadata for each generated dossier", async () => {
    await expect(
      generateMetadata({
        params: Promise.resolve({ id: "2" }),
      }),
    ).resolves.toEqual({
      alternates: {
        canonical: "/pokemon/2",
      },
      description:
        "Ivysaur (#0002) dossier with types, abilities, dimensions, and base stats in an unofficial Pokédex parody.",
      title: "Ivysaur #0002",
    })

    await expect(
      generateMetadata({
        params: Promise.resolve({ id: "1026" }),
      }),
    ).resolves.toEqual({})
  })
})
