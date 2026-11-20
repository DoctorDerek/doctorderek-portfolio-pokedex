import ThemeToggleArtwork from "@/components/ThemeToggleArtwork"

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
      className="group/theme flex min-h-11 min-w-11 cursor-pointer rounded-full border-0 bg-transparent p-0"
      onClick={onToggle}
    >
      <ThemeToggleArtwork />
    </button>
  )
}
