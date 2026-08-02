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
  const [hasParticleFirstFrameRendered, setHasParticleFirstFrameRendered] =
    useState(false)
  const [isPostParticleIdleReady, setIsPostParticleIdleReady] = useState(false)
  const handleParticleFirstFrameRendered = useCallback(
    () => setHasParticleFirstFrameRendered(true),
    [],
  )

  useEffect(() => {
    if (
      shouldReduceMotion ||
      !shouldRenderDeferredMotion ||
      !hasParticleFirstFrameRendered
    )
      return

    return scheduleIdleWork(() => setIsPostParticleIdleReady(true))
  }, [
    hasParticleFirstFrameRendered,
    shouldReduceMotion,
    shouldRenderDeferredMotion,
  ])

  return (
    <>
      <GlobalBackground
        onParticleFirstFrameRendered={handleParticleFirstFrameRendered}
        shouldRenderParticles={
          !shouldReduceMotion && shouldRenderDeferredMotion
        }
      />
      {!shouldReduceMotion && <CustomCursor />}
      {!shouldReduceMotion &&
        shouldRenderDeferredMotion &&
        isPostParticleIdleReady && <RiveAnimation />}
    </>
  )
}
