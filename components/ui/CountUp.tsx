"use client"
import { useEffect, useRef } from "react"
import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from "motion/react"
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
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => {
    const val = Math.round(latest)
    return useGrouping ? val.toLocaleString("en-US") : val.toString()
  })
  const ref = useRef<HTMLSpanElement>(null)

  const inView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: "easeOut" })
      return () => controls.stop()
    }
  }, [inView, count, to, duration])

  return (
    <motion.span ref={ref} className={classNames("inline-block", className)}>
      {rounded}
    </motion.span>
  )
}
