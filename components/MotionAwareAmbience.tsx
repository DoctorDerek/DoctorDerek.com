"use client"

import dynamic from "next/dynamic"
import { useCallback, useState } from "react"
import GlobalBackground from "@/components/GlobalBackground"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import CustomCursor from "@/components/ui/CustomCursor"

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
      <CustomCursor />
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
