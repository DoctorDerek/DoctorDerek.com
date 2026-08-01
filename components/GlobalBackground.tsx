"use client"

import { AnimatePresence, motion } from "motion/react"
import dynamic from "next/dynamic"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import Background1 from "@/images/Background-1.svg?url"
import Background2 from "@/images/Background-2.svg?url"
import Background3 from "@/images/Background-3.svg?url"
import Background4 from "@/images/Background-4.svg?url"
import Background5 from "@/images/Background-5.svg?url"
import Background6 from "@/images/Background-6.svg?url"
import Background0 from "@/images/Background.svg?url"
import { GlobalStateContext } from "@/machines/globalMachine"

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
  shouldRenderParticles,
}: {
  shouldRenderParticles: boolean
}) {
  const { shouldReduceMotion } = useMotionPreference()
  const activeBackgroundIndex = GlobalStateContext.useSelector(
    (state) => state.context.bgIndex,
  )
  const activeBackgroundUsesInverse = GlobalStateContext.useSelector(
    (state) => state.context.bgUseInverse,
  )
  const bgIndex = shouldReduceMotion ? 0 : activeBackgroundIndex
  const bgUseInverse = shouldReduceMotion ? false : activeBackgroundUsesInverse

  const bgConfig = BACKGROUNDS[bgIndex]
  const useInverse = bgConfig.inverse && bgUseInverse
  const activeBackground =
    useInverse && bgConfig.inverse ? bgConfig.inverse : bgConfig.standard
  const key = `bg-${bgIndex}-${useInverse ? "inverse" : "standard"}`

  return (
    <div className="animate-rainbow-vivid pointer-events-none fixed inset-0 -z-20 h-full w-full">
      {!shouldReduceMotion && shouldRenderParticles && <ParticleCanvas />}
      <AnimatePresence initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 20,
            ease: "linear",
          }}
          className="absolute inset-0 h-full w-full mix-blend-overlay"
        >
          <motion.img
            src={activeBackground}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
