import ThemeToggleArtwork from "@/components/ThemeToggleArtwork"
import classNames from "@/utils/classNames"

export default function ThemeToggle({
  isDarkTheme,
  onToggle,
}: {
  isDarkTheme: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={isDarkTheme}
      aria-label={
        isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
      }
      className={classNames(
        "inline-flex min-h-11 min-w-11 cursor-pointer rounded-full border-0 bg-transparent p-0",
        isDarkTheme
          ? "pokedex-theme-toggle--dark"
          : "pokedex-theme-toggle--light",
      )}
      onClick={onToggle}
    >
      <ThemeToggleArtwork />
    </button>
  )
}
