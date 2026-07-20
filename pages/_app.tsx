import type { AppProps } from "next/app"
import ApplicationProviders from "@/app/providers"
import "@/styles/globals.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApplicationProviders>
      <Component {...pageProps} />
    </ApplicationProviders>
  )
}
