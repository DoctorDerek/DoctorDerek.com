"use client"

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react"
import { useEffect, useRef } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import classNames from "@/utils/classNames"

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
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => {
    const val = Math.round(latest)
    return useGrouping ? val.toLocaleString("en-US") : val.toString()
  })
  const ref = useRef<HTMLSpanElement>(null)
  const formattedTarget = useGrouping
    ? to.toLocaleString("en-US")
    : to.toString()

  const inView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (inView && !shouldReduceMotion) {
      const controls = animate(count, to, { duration, ease: "easeOut" })
      return () => controls.stop()
    }
  }, [inView, count, to, duration, shouldReduceMotion])

  return (
    <motion.span ref={ref} className={classNames("inline-block", className)}>
      {shouldReduceMotion ? formattedTarget : rounded}
    </motion.span>
  )
}
