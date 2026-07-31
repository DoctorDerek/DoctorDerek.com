"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import GlobalBackground from "@/components/GlobalBackground"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import CustomCursor from "@/components/ui/CustomCursor"
import useDeferredClientFeature from "@/hooks/useDeferredClientFeature"

const RiveAnimation = dynamic(() => import("@/components/RiveAnimation"), {
  ssr: false,
})

export default function MotionAwareAmbience() {
  const { shouldReduceMotion } = useMotionPreference()
  const isDeferredClientFeatureReady = useDeferredClientFeature()
  const [hasUserIntent, setHasUserIntent] = useState(false)

  useEffect(() => {
    if (hasUserIntent) return

    const captureUserIntent = () => setHasUserIntent(true)
    const passiveListenerOptions = { passive: true } as const

    window.addEventListener(
      "pointermove",
      captureUserIntent,
      passiveListenerOptions,
    )
    window.addEventListener(
      "pointerdown",
      captureUserIntent,
      passiveListenerOptions,
    )
    window.addEventListener("wheel", captureUserIntent, passiveListenerOptions)
    window.addEventListener("keydown", captureUserIntent)

    return () => {
      window.removeEventListener("pointermove", captureUserIntent)
      window.removeEventListener("pointerdown", captureUserIntent)
      window.removeEventListener("wheel", captureUserIntent)
      window.removeEventListener("keydown", captureUserIntent)
    }
  }, [hasUserIntent])

  return (
    <>
      <GlobalBackground
        shouldRenderParticles={
          !shouldReduceMotion && isDeferredClientFeatureReady
        }
      />
      {!shouldReduceMotion && <CustomCursor />}
      {!shouldReduceMotion && isDeferredClientFeatureReady && hasUserIntent && (
        <RiveAnimation />
      )}
    </>
  )
}
