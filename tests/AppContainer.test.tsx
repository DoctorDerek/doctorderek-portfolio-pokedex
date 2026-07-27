import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AppContainer from "@/components/AppContainer"

describe("AppContainer", () => {
  it("preserves the centered portfolio identity as three readable segments", () => {
    render(
      <AppContainer>
        <p>Selected Pokémon</p>
      </AppContainer>,
    )

    expect(screen.getByRole("link", { name: "Pokédex" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(screen.getByText("by", { selector: "span" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "@DoctorDerek" })).toHaveAttribute(
      "href",
      "https://www.doctorderek.com/",
    )
    expect(
      screen.getByText(
        "Unofficial National Pokédex research registry: non-commercial portfolio exploration of GraphQL, progressive catalog behavior, and accessible interaction.",
      ),
    ).toBeInTheDocument()
  })
})
