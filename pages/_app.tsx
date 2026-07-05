import { useInterpret } from "@xstate/react"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"

import GlobalStateContext from "@/components/GlobalStateContext"
import "@/styles/globals.css"
import authMachine from "@/utils/authMachine"

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: AppProps) {
  const authService = useInterpret(authMachine)

  // Note that we've loaded up react-query here but aren't actually using it.
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <GlobalStateContext.Provider value={{ authService }}>
        {/* We can access React context throughout the app via Provider */}
        <Component {...pageProps} />
      </GlobalStateContext.Provider>
    </QueryClientProvider>
  )
}
