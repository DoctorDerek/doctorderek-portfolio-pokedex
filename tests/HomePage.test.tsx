import { permanentRedirect } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import HomePage from "@/app/page"

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(),
}))

describe("HomePage", () => {
  it("redirects the root route to the first Pokédex entry", () => {
    HomePage()

    expect(permanentRedirect).toHaveBeenCalledWith("/pokemon/1")
  })
})
