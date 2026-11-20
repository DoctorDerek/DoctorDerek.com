"use client"

import cx from "classix"
import { type CSSProperties, type ReactNode } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"

type SpringRotationProps = {
  children: ReactNode
  className?: string
  rotationDegrees: number
}

export default function SpringRotation({
  children,
  className,
  rotationDegrees,
}: SpringRotationProps) {
  const { shouldReduceMotion } = useMotionPreference()

  return (
    <div
      className={cx(
        "ease-spring-rotation transform-[rotateY(var(--rotation))] duration-900 transform-3d motion-reduce:transition-none",
        shouldReduceMotion ? "transition-none" : "transition-transform",
        className,
      )}
      style={{ "--rotation": `${rotationDegrees}deg` } as CSSProperties}
    >
      {children}
    </div>
  )
}
