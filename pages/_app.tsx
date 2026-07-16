import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"
import "@/styles/globals.css"

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
