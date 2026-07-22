export const THEME_STORAGE_KEY = "pokedex-theme"

export const THEME_PREFERENCES = ["system", "light", "dark"] as const

export type ThemePreference = (typeof THEME_PREFERENCES)[number]
export type ResolvedThemeAppearance = Exclude<ThemePreference, "system">
