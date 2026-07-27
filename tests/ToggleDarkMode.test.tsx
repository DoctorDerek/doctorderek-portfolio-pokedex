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

  it("presents the dark appearance and switches to light", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "dark",
      setTheme,
      theme: "system",
    } as never)

    render(<ToggleDarkMode />)

    const themeToggle = screen.getByRole("button", {
      name: "Switch to light theme",
    })

    expect(themeToggle).toHaveAttribute("aria-pressed", "true")

    fireEvent.click(themeToggle)

    expect(setTheme).toHaveBeenCalledWith("light")
  })

  it("presents the light appearance and switches to dark", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "light",
      setTheme,
      theme: "dark",
    } as never)

    render(<ToggleDarkMode />)

    const themeToggle = screen.getByRole("button", {
      name: "Switch to dark theme",
    })

    expect(themeToggle).toHaveAttribute("aria-pressed", "false")

    fireEvent.click(themeToggle)

    expect(setTheme).toHaveBeenCalledWith("dark")
  })

  it("waits for a browser-resolved system preference", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: undefined,
      setTheme,
      theme: "system",
    } as never)

    render(<ToggleDarkMode />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
