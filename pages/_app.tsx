import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { AppProps } from "next/app"
import { useState } from "react"
import "@/styles/globals.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
