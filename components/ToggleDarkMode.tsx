"use client"

import { useTheme } from "next-themes"
import ThemeToggle from "@/components/ThemeToggle"

export default function ToggleDarkMode() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const effectiveTheme = resolvedTheme ?? theme
  const isDarkTheme = effectiveTheme === "dark"
  const isThemeSettled = isDarkTheme || effectiveTheme === "light"

  return isThemeSettled ? (
    <ThemeToggle
      isDarkTheme={isDarkTheme}
      onToggle={() => setTheme(isDarkTheme ? "light" : "dark")}
    />
  ) : null
}
