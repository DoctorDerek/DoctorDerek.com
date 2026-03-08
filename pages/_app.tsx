import "@/styles/globals.css"
import GlobalBackground from "@/components/GlobalBackground"
import { GlobalStateContext } from "@/machines/globalMachine"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalBackground />
      <GlobalStateContext.Provider>
        <Component {...pageProps} />
      </GlobalStateContext.Provider>
    </>
  )
}
