"use client"

import { LazyMotion, useMotionValue, useSpring } from "motion/react"
import * as m from "motion/react-m"
import { useEffect, useState } from "react"

const loadDomAnimationFeatures = async () =>
  (await import("@/utils/domAnimationFeatures")).default

function AnimatedCustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [isVisible, setIsVisible] = useState(false)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", moveCursor, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [cursorX, cursorY])

  return (
    <m.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-8 w-8 rounded-full border-2 border-[#F38B57] bg-transparent"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 0.8 : 0,
      }}
    />
  )
}

export default function CustomCursor() {
  return (
    <LazyMotion features={loadDomAnimationFeatures} strict>
      <AnimatedCustomCursor />
    </LazyMotion>
  )
}
