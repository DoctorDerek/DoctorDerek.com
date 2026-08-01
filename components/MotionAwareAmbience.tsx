"use client"

import dynamic from "next/dynamic"
import GlobalBackground from "@/components/GlobalBackground"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import CustomCursor from "@/components/ui/CustomCursor"

const RiveAnimation = dynamic(() => import("@/components/RiveAnimation"), {
  ssr: false,
})

export default function MotionAwareAmbience({
  shouldRenderDeferredMotion,
}: {
  shouldRenderDeferredMotion: boolean
}) {
  const { shouldReduceMotion } = useMotionPreference()

  return (
    <>
      <GlobalBackground
        shouldRenderParticles={
          !shouldReduceMotion && shouldRenderDeferredMotion
        }
      />
      {!shouldReduceMotion && <CustomCursor />}
      {!shouldReduceMotion && shouldRenderDeferredMotion && <RiveAnimation />}
    </>
  )
}
