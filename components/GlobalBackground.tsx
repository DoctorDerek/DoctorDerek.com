"use client"

import { AnimatePresence, motion } from "motion/react"
import { GlobalStateContext } from "@/machines/globalMachine"
import Background0 from "@/images/Background.svg"
import Background1 from "@/images/Background-1.svg"
import Background2 from "@/images/Background-2.svg"
import Background3 from "@/images/Background-3.svg"
import Background4 from "@/images/Background-4.svg"
import Background5 from "@/images/Background-5.svg"
import Background6 from "@/images/Background-6.svg"

const BACKGROUNDS = [
  { standard: Background0, inverse: Background1 },
  { standard: Background2 },
  { standard: Background3 },
  { standard: Background4 },
  { standard: Background5, inverse: Background6 },
]

export default function GlobalBackground() {
  const bgIndex = GlobalStateContext.useSelector(
    (state) => state.context.bgIndex,
  )
  const bgUseInverse = GlobalStateContext.useSelector(
    (state) => state.context.bgUseInverse,
  )

  const bgConfig = BACKGROUNDS[bgIndex]
  const useInverse = bgConfig.inverse && bgUseInverse
  const Component =
    useInverse && bgConfig.inverse ? bgConfig.inverse : bgConfig.standard
  const key = `bg-${bgIndex}-${useInverse ? "inverse" : "standard"}`

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 20, ease: "linear" }}
          className="absolute inset-0 h-full w-full"
        >
          <Component
            className="h-full w-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
