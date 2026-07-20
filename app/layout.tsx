import type { Metadata } from "next"
import type { ReactNode } from "react"
import ApplicationProviders from "@/app/providers"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Pokédex by @DoctorDerek",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApplicationProviders>{children}</ApplicationProviders>
      </body>
    </html>
  )
}
