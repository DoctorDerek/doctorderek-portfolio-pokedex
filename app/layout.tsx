import type { Metadata } from "next"
import type { ReactNode } from "react"
import ApplicationProviders from "@/app/providers"
import {
  CANONICAL_PRODUCTION_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/data/siteMetadata"
import "@/styles/globals.css"

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  metadataBase: new URL(CANONICAL_PRODUCTION_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ApplicationProviders>{children}</ApplicationProviders>
      </body>
    </html>
  )
}
