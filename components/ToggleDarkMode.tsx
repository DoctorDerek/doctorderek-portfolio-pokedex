"use client"

import { useTheme } from "next-themes"
import ThemeSelector from "@/components/ThemeSelector"
import type { ResolvedThemeAppearance, ThemePreference } from "@/data/theme"

export default function ToggleDarkMode() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const resolvedAppearance: ResolvedThemeAppearance =
    resolvedTheme === "dark" ? "dark" : "light"
  const selectedPreference: ThemePreference =
    theme === "dark" || theme === "light" ? theme : "system"

  return (
    <ThemeSelector
      onThemeChange={setTheme}
      resolvedAppearance={resolvedAppearance}
      selectedPreference={selectedPreference}
    />
  )
}
