"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"
import GlobalBackground from "@/components/GlobalBackground"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import CustomCursor from "@/components/ui/CustomCursor"
import scheduleIdleWork from "@/utils/scheduleIdleWork"

const RiveAnimation = dynamic(() => import("@/components/RiveAnimation"), {
  ssr: false,
})

export default function MotionAwareAmbience({
  shouldRenderDeferredMotion,
}: {
  shouldRenderDeferredMotion: boolean
}) {
  const { shouldReduceMotion } = useMotionPreference()
  const [isRiveIdleReady, setIsRiveIdleReady] = useState(false)
  const [hasRiveReady, setHasRiveReady] = useState(false)
  const [isPostRiveIdleReady, setIsPostRiveIdleReady] = useState(false)
  const handleRiveReady = useCallback(() => setHasRiveReady(true), [])

  useEffect(() => {
    if (shouldReduceMotion || !shouldRenderDeferredMotion) return

    return scheduleIdleWork(() => setIsRiveIdleReady(true))
  }, [shouldReduceMotion, shouldRenderDeferredMotion])

  useEffect(() => {
    if (shouldReduceMotion || !shouldRenderDeferredMotion || !hasRiveReady)
      return

    return scheduleIdleWork(() => setIsPostRiveIdleReady(true))
  }, [hasRiveReady, shouldReduceMotion, shouldRenderDeferredMotion])

  return (
    <>
      <GlobalBackground
        shouldRenderParticles={
          !shouldReduceMotion &&
          shouldRenderDeferredMotion &&
          isPostRiveIdleReady
        }
      />
      {!shouldReduceMotion && <CustomCursor />}
      {!shouldReduceMotion && shouldRenderDeferredMotion && isRiveIdleReady && (
        <RiveAnimation onRiveReady={handleRiveReady} />
      )}
    </>
  )
}
