import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import RootLayout, { metadata } from "@/app/layout"

vi.mock("@/app/providers", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="application-providers">{children}</div>
  ),
}))

describe("RootLayout", () => {
  it("sets the document language, page title, and application boundary", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <p>Pokédex workspace</p>
      </RootLayout>,
    )

    expect(metadata.title).toBe("Pokédex by @DoctorDerek")
    expect(markup).toContain('<html lang="en">')
    expect(markup).toContain('<div data-testid="application-providers">')
    expect(markup).toContain("Pokédex workspace")
  })
})
