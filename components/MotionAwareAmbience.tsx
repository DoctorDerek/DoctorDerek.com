"use client"

import dynamic from "next/dynamic"
import { useCallback, useState } from "react"
import GlobalBackground from "@/components/GlobalBackground"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import DeferredCustomCursor from "@/components/ui/DeferredCustomCursor"

const RiveAnimation = dynamic(() => import("@/components/RiveAnimation"), {
  ssr: false,
})

function MotionEnabledAmbience({
  shouldStartRive,
}: {
  shouldStartRive: boolean
}) {
  const [hasRiveCompleted, setHasRiveCompleted] = useState(false)
  const [haveParticlesStarted, setHaveParticlesStarted] = useState(false)
  const handleRiveComplete = useCallback(() => setHasRiveCompleted(true), [])
  const handleParticlesReady = useCallback(
    () => setHaveParticlesStarted(true),
    [],
  )

  return (
    <>
      <GlobalBackground
        onAmbientMotionReady={handleParticlesReady}
        shouldRenderAmbientMotion={shouldStartRive && hasRiveCompleted}
      />
      <DeferredCustomCursor shouldLoad={haveParticlesStarted} />
      {shouldStartRive && <RiveAnimation onRiveComplete={handleRiveComplete} />}
    </>
  )
}

export default function MotionAwareAmbience({
  shouldStartRive,
}: {
  shouldStartRive: boolean
}) {
  const { shouldReduceMotion } = useMotionPreference()

  if (shouldReduceMotion)
    return <GlobalBackground shouldRenderAmbientMotion={false} />

  return <MotionEnabledAmbience shouldStartRive={shouldStartRive} />
}
