import { fireEvent, render, screen } from "@testing-library/react"
import { useTheme as useThemeMock } from "next-themes"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ToggleDarkMode from "@/components/ToggleDarkMode"

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}))

const mockedUseTheme = vi.mocked(useThemeMock)

describe("ToggleDarkMode", () => {
  const setTheme = vi.fn()

  beforeEach(() => {
    setTheme.mockReset()
  })

  it("reads system as the selected preference and maps dark resolution correctly", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "dark",
      setTheme,
      theme: "system",
    } as never)

    render(<ToggleDarkMode />)

    expect(
      screen.getByRole("button", { name: "Use system theme, currently dark" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Use dark theme" }),
    ).toHaveAttribute("aria-pressed", "false")
    expect(
      screen.getByRole("button", { name: "Use light theme" }),
    ).toHaveAttribute("aria-pressed", "false")
  })

  it("notifies theme mutation through the exact preference mapping", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "light",
      setTheme,
      theme: "dark",
    } as never)

    render(<ToggleDarkMode />)

    fireEvent.click(screen.getByRole("button", { name: "Use light theme" }))
    fireEvent.click(screen.getByRole("button", { name: "Use dark theme" }))

    expect(setTheme).toHaveBeenCalledTimes(2)
    expect(setTheme).toHaveBeenNthCalledWith(1, "light")
    expect(setTheme).toHaveBeenNthCalledWith(2, "dark")
  })
})
