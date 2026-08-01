"use client"

import dynamic from "next/dynamic"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import Logo from "@/components/ui/Logo"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"
import Navbar from "./Navbar"

const IntroTypewriter = dynamic(() => import("@/components/IntroTypewriter"), {
  ssr: false,
})

const INTRODUCTION_SEGMENTS = INTRO_BIO_SHORT.split(" · ")

export default function TopSection({
  shouldRenderDeferredMotion,
}: {
  shouldRenderDeferredMotion: boolean
}) {
  const { shouldReduceMotion } = useMotionPreference()

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center">
        <Logo className="h-16 w-48 md:h-32 md:w-96" />
        <div className="restorabold text-site-foreground mt-8 min-h-[4rem] w-full max-w-5xl px-4 text-center text-xl font-bold drop-shadow-md md:mt-12 md:min-h-[5rem] md:text-3xl lg:text-4xl">
          <h1 className="sr-only">{INTRO_BIO_SHORT}</h1>
          {shouldReduceMotion ? (
            <p aria-hidden="true">{INTRO_BIO_SHORT}</p>
          ) : (
            <div aria-hidden="true">
              {shouldRenderDeferredMotion ? (
                <IntroTypewriter segments={INTRODUCTION_SEGMENTS} />
              ) : (
                <p>{INTRODUCTION_SEGMENTS[0]}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
