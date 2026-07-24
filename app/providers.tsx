"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MotionConfig } from "motion/react"
import { ThemeProvider } from "next-themes"
import { useState, type ReactNode } from "react"
import { THEME_STORAGE_KEY } from "@/data/theme"

export default function ApplicationProviders({
  children,
}: {
  children: ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableColorScheme
        enableSystem
        storageKey={THEME_STORAGE_KEY}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}
