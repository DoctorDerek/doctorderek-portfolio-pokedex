import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import RootLayout, { metadata } from "@/app/layout"

vi.mock("@/app/providers", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="application-providers">{children}</div>
  ),
}))

describe("RootLayout", () => {
  it("sets the site identity and application boundary", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <p>Pokédex workspace</p>
      </RootLayout>,
    )

    expect(metadata.description).toBe(
      "An unofficial Pokédex parody and GraphQL portfolio demo with 1,025 statically generated Pokémon dossiers.",
    )
    expect(metadata.metadataBase?.toString()).toBe(
      "https://portfolio-pokedex.doctorderek.com/",
    )
    expect(metadata.title).toEqual({
      default: "Pokédex by @DoctorDerek",
      template: "%s | Pokédex by @DoctorDerek",
    })
    expect(markup).toContain('<html lang="en">')
    expect(markup).toContain('<div data-testid="application-providers">')
    expect(markup).toContain("Pokédex workspace")
  })
})
