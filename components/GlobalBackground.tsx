"use client"

import dynamic from "next/dynamic"
import BackgroundPattern from "@/components/BackgroundPattern"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import Background1 from "@/images/Background-1.svg?url"
import Background2 from "@/images/Background-2.svg?url"
import Background3 from "@/images/Background-3.svg?url"
import Background4 from "@/images/Background-4.svg?url"
import Background5 from "@/images/Background-5.svg?url"
import Background6 from "@/images/Background-6.svg?url"
import Background0 from "@/images/Background.svg?url"
import { GlobalStateContext } from "@/machines/globalMachine"
import classNames from "@/utils/classNames"

const ParticleCanvas = dynamic(() => import("@/components/ParticleCanvas"), {
  ssr: false,
})

const BACKGROUNDS = [
  { standard: Background0, inverse: Background1 },
  { standard: Background2 },
  { standard: Background3 },
  { standard: Background4 },
  { standard: Background5, inverse: Background6 },
]

export default function GlobalBackground({
  onAmbientMotionReady,
  shouldAnimateBackgroundColor,
  shouldRenderAmbientMotion,
}: {
  onAmbientMotionReady?: () => void
  shouldAnimateBackgroundColor: boolean
  shouldRenderAmbientMotion: boolean
}) {
  const { shouldReduceMotion } = useMotionPreference()
  const activeBackgroundIndex = GlobalStateContext.useSelector(
    (state) => state.context.bgIndex,
  )
  const activeBackgroundUsesInverse = GlobalStateContext.useSelector(
    (state) => state.context.bgUseInverse,
  )
  const canAnimateBackgroundColor =
    !shouldReduceMotion && shouldAnimateBackgroundColor
  const shouldRenderDeferredAmbientMotion =
    !shouldReduceMotion && shouldRenderAmbientMotion
  const bgIndex = shouldRenderDeferredAmbientMotion ? activeBackgroundIndex : 0
  const bgUseInverse = shouldRenderDeferredAmbientMotion
    ? activeBackgroundUsesInverse
    : false

  const bgConfig = BACKGROUNDS[bgIndex]
  const useInverse = bgConfig.inverse && bgUseInverse
  const activeBackground =
    useInverse && bgConfig.inverse ? bgConfig.inverse : bgConfig.standard

  return (
    <div
      data-ambient-motion={shouldRenderDeferredAmbientMotion}
      className={classNames(
        "global-background pointer-events-none fixed inset-0 -z-20 h-full w-full",
        canAnimateBackgroundColor && "animate-rainbow-vivid",
      )}
    >
      <div
        aria-hidden="true"
        className="global-background-color-overlay absolute inset-0 h-full w-full"
      />
      {shouldRenderDeferredAmbientMotion && (
        <ParticleCanvas onReady={onAmbientMotionReady} />
      )}
      <BackgroundPattern source={activeBackground.src} />
    </div>
  )
}
