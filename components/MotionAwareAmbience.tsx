"use client"

import dynamic from "next/dynamic"
import GlobalBackground from "@/components/GlobalBackground"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import CustomCursor from "@/components/ui/CustomCursor"

const RiveAnimation = dynamic(() => import("@/components/RiveAnimation"), {
  ssr: false,
})

export default function MotionAwareAmbience() {
  const { shouldReduceMotion } = useMotionPreference()

  return (
    <>
      <GlobalBackground />
      {!shouldReduceMotion && <CustomCursor />}
      {!shouldReduceMotion && <RiveAnimation />}
    </>
  )
}
