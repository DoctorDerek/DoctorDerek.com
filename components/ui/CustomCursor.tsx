"use client"

import { motion, useMotionValue, useSpring } from "motion/react"
import { useEffect, useState, useSyncExternalStore } from "react"

const CUSTOM_CURSOR_MEDIA_QUERY =
  "(hover: hover) and (pointer: fine) and (min-width: 48rem)"

const getCustomCursorMediaQuerySnapshot = () =>
  window.matchMedia(CUSTOM_CURSOR_MEDIA_QUERY).matches

const subscribeToCustomCursorMediaQuery = (
  onCustomCursorMediaQueryChange: () => void,
) => {
  const customCursorMediaQuery = window.matchMedia(CUSTOM_CURSOR_MEDIA_QUERY)
  customCursorMediaQuery.addEventListener(
    "change",
    onCustomCursorMediaQueryChange,
  )

  return () =>
    customCursorMediaQuery.removeEventListener(
      "change",
      onCustomCursorMediaQueryChange,
    )
}

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [isVisible, setIsVisible] = useState(false)
  const shouldUseCustomCursor = useSyncExternalStore(
    subscribeToCustomCursorMediaQuery,
    getCustomCursorMediaQuerySnapshot,
    () => false,
  )

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (!shouldUseCustomCursor) return

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
  }, [cursorX, cursorY, shouldUseCustomCursor])

  if (!shouldUseCustomCursor) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-8 w-8 rounded-full border-2 border-[#F38B57] bg-transparent"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 0.8 : 0,
      }}
    />
  )
}
