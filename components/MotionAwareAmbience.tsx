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
  const handleRiveComplete = useCallback(() => setHasRiveCompleted(true), [])

  return (
    <>
      <GlobalBackground
        shouldRenderAmbientMotion={shouldStartRive && hasRiveCompleted}
      />
      <DeferredCustomCursor shouldLoad={hasRiveCompleted} />
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
