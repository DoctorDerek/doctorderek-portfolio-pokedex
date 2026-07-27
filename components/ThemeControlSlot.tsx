"use client"

import dynamic from "next/dynamic"

const ThemeToggleControl = dynamic(
  () => import("@/components/ToggleDarkMode"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="border-outline bg-surface-elevated/60 h-[70px] w-[170px] rounded-full border"
      />
    ),
  },
)

export default function ThemeControlSlot() {
  return <ThemeToggleControl />
}
