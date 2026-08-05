"use client"

import dynamic from "next/dynamic"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import Logo from "@/components/ui/Logo"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"
import Navbar from "./Navbar"

const IntroTypewriter = dynamic(() => import("@/components/IntroTypewriter"), {
  ssr: false,
})

const [PRIMARY_INTRODUCTION, ...SUPPORTING_INTRODUCTION_SEGMENTS] =
  INTRO_BIO_SHORT.split(" · ")
const SUPPORTING_INTRODUCTION = SUPPORTING_INTRODUCTION_SEGMENTS.join(" · ")

export default function TopSection() {
  const { shouldReduceMotion } = useMotionPreference()

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center">
        <Logo className="h-16 w-48 md:h-32 md:w-96" />
        <div className="restorabold text-site-foreground mt-8 w-full max-w-5xl px-4 text-center font-bold drop-shadow-md md:mt-12">
          <h1 className="text-xl md:text-3xl lg:text-4xl">
            {PRIMARY_INTRODUCTION}
          </h1>
          {shouldReduceMotion ? (
            <p className="mt-3 text-base md:text-xl lg:text-2xl">
              {SUPPORTING_INTRODUCTION}
            </p>
          ) : (
            <>
              <p className="sr-only">{SUPPORTING_INTRODUCTION}</p>
              <div
                aria-hidden="true"
                className="mt-3 min-h-[3rem] text-base md:min-h-[4rem] md:text-xl lg:text-2xl"
              >
                <IntroTypewriter segments={SUPPORTING_INTRODUCTION_SEGMENTS} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
