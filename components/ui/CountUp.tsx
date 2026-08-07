"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import classNames from "@/utils/classNames"

const easeOut = (progress: number) => 1 - Math.pow(1 - progress, 3)

const formatCount = (value: number, useGrouping: boolean) => {
  const roundedValue = Math.round(value)
  return useGrouping
    ? roundedValue.toLocaleString("en-US")
    : roundedValue.toString()
}

export default function CountUp({
  to,
  from = 0,
  duration = 2,
  useGrouping = true,
  className,
}: {
  to: number
  from?: number
  duration?: number
  useGrouping?: boolean
  className?: string
}) {
  const { shouldReduceMotion } = useMotionPreference()
  const [displayedValue, setDisplayedValue] = useState(from)
  const elementReference = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (shouldReduceMotion) return

    const element = elementReference.current!
    let animationFrameId: number | undefined

    const intersectionObserver = new IntersectionObserver(
      ([intersectionEntry]) => {
        if (!intersectionEntry.isIntersecting) return

        intersectionObserver.disconnect()
        let animationStartTime: number | undefined
        const durationMilliseconds = duration * 1_000

        const updateCount = (timestamp: number) => {
          animationStartTime ??= timestamp
          const elapsedMilliseconds = timestamp - animationStartTime
          const progress = Math.min(
            durationMilliseconds === 0
              ? 1
              : elapsedMilliseconds / durationMilliseconds,
            1,
          )

          setDisplayedValue(from + (to - from) * easeOut(progress))

          if (progress < 1)
            animationFrameId = window.requestAnimationFrame(updateCount)
        }

        animationFrameId = window.requestAnimationFrame(updateCount)
      },
      { rootMargin: "-50px" },
    )

    intersectionObserver.observe(element)

    return () => {
      intersectionObserver.disconnect()
      if (animationFrameId !== undefined)
        window.cancelAnimationFrame(animationFrameId)
    }
  }, [duration, from, shouldReduceMotion, to])

  const visibleValue = shouldReduceMotion ? to : displayedValue

  return (
    <span
      ref={elementReference}
      className={classNames("inline-block", className)}
    >
      {formatCount(visibleValue, useGrouping)}
    </span>
  )
}
