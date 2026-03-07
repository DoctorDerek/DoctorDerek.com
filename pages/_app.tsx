import "@/styles/globals.css"
import GlobalBackground from "@/components/GlobalBackground"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalBackground />
      <Component {...pageProps} />
    </>
  )
}
