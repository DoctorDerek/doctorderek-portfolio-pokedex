import {
  THEME_PREFERENCES,
  type ResolvedThemeAppearance,
  type ThemePreference,
} from "@/data/theme"

const THEME_PREFERENCE_LABELS = {
  dark: "Dark",
  light: "Light",
  system: "System",
} as const satisfies Record<ThemePreference, string>

export default function ThemeSelector({
  onThemeChange,
  resolvedAppearance,
  selectedPreference,
}: {
  onThemeChange: (preference: ThemePreference) => void
  resolvedAppearance: ResolvedThemeAppearance
  selectedPreference: ThemePreference
}) {
  return (
    <div
      role="group"
      aria-label={`Color theme · ${THEME_PREFERENCE_LABELS[resolvedAppearance]} appearance`}
      className="border-outline bg-surface-elevated shadow-panel grid h-14 w-64 grid-cols-3 gap-1 rounded-lg border p-1"
    >
      {THEME_PREFERENCES.map((preference) => {
        const isSelected = preference === selectedPreference
        const label = THEME_PREFERENCE_LABELS[preference]

        return (
          <button
            key={preference}
            type="button"
            aria-label={
              preference === "system"
                ? `Use system theme, currently ${resolvedAppearance}`
                : `Use ${preference} theme`
            }
            aria-pressed={isSelected}
            onClick={() => onThemeChange(preference)}
            className={`flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-md px-2 text-xs font-bold motion-safe:transition-[background-color,border-color,color,transform] motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-px ${
              isSelected
                ? "border-accent bg-accent-soft text-ink border"
                : "text-muted hover:bg-panel hover:text-ink border border-transparent"
            }`}
          >
            <ThemePreferenceIcon
              preference={preference}
              resolvedAppearance={resolvedAppearance}
            />
            <span className="truncate">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ThemePreferenceIcon({
  preference,
  resolvedAppearance,
}: {
  preference: ThemePreference
  resolvedAppearance: ResolvedThemeAppearance
}) {
  if (preference === "system")
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
        {resolvedAppearance === "dark" ? (
          <path d="M15.2 7.2a3.7 3.7 0 0 0 1.6 5.2 3.8 3.8 0 1 1-1.6-5.2Z" />
        ) : (
          <circle cx="12" cy="10.5" r="2.2" />
        )}
      </svg>
    )

  if (preference === "light")
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    )

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M20.4 14.5A8.6 8.6 0 0 1 9.5 3.6 8.7 8.7 0 1 0 20.4 14.5Z" />
    </svg>
  )
}
