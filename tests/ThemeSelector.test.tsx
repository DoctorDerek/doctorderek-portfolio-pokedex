import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ThemeSelector from "@/components/ThemeSelector"

describe("ThemeSelector", () => {
  it("presents the selected preference and resolved appearance", () => {
    const onThemeChange = vi.fn()

    render(
      <ThemeSelector
        onThemeChange={onThemeChange}
        resolvedAppearance="dark"
        selectedPreference="system"
      />,
    )

    expect(
      screen.getByRole("group", {
        name: "Color theme · Dark appearance",
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", {
        name: "Use system theme, currently dark",
      }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByRole("button", { name: "Use light theme" }),
    ).toHaveAttribute("aria-pressed", "false")
    expect(
      screen.getByRole("button", { name: "Use dark theme" }),
    ).toHaveAttribute("aria-pressed", "false")
  })

  it("reports an explicit preference without owning theme state", () => {
    const onThemeChange = vi.fn()

    render(
      <ThemeSelector
        onThemeChange={onThemeChange}
        resolvedAppearance="light"
        selectedPreference="system"
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Use dark theme" }))

    expect(onThemeChange).toHaveBeenCalledOnce()
    expect(onThemeChange).toHaveBeenCalledWith("dark")
  })
})
