"use client";

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
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
  const [bg, setBg] = useState({
    index: 0,
    key: "bg-0-standard",
    Component: BACKGROUNDS[0].standard,
  })

  useEffect(() => {
    const cycleBackground = () => {
      setBg((prev) => {
        const nextIndex = (prev.index + 1) % BACKGROUNDS.length
        const bgConfig = BACKGROUNDS[nextIndex]
        const useInverse = bgConfig.inverse && Math.random() > 0.5
        
        return {
          index: nextIndex,
          key: `bg-${nextIndex}-${useInverse ? "inverse" : "standard"}`,
          Component: useInverse && bgConfig.inverse ? bgConfig.inverse : bgConfig.standard,
        }
      })
    }

    const interval = setInterval(cycleBackground, 21000)

    return () => clearInterval(interval)
  }, [])

  const { Component } = bg

  return (
    <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none">
      <AnimatePresence initial={false}>
        <motion.div
          key={bg.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 20, ease: "linear" }}
          className="absolute inset-0 h-full w-full"
        >
          <Component className="object-cover h-full w-full" preserveAspectRatio="xMidYMid slice" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
