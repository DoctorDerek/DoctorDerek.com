import "@/styles/globals.css"
import GlobalBackground from "@/components/GlobalBackground"
import { GlobalStateContext } from "@/machines/globalMachine"
import CustomCursor from "@/components/ui/CustomCursor"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStateContext.Provider>
        <GlobalBackground />
        <CustomCursor />
        <Component {...pageProps} />
      </GlobalStateContext.Provider>
    </>
  )
}
