"use client"

import dynamic from "next/dynamic"
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

  return (
    <>
      <GlobalBackground
        shouldRenderParticles={
          !shouldReduceMotion && isDeferredClientFeatureReady
        }
      />
      {!shouldReduceMotion && <CustomCursor />}
      {!shouldReduceMotion && isDeferredClientFeatureReady && <RiveAnimation />}
    </>
  )
}
