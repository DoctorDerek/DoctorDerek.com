"use client"

import { type CSSProperties, type ReactNode } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import classNames from "@/utils/classNames"

type SpringRotationProps = {
  children: ReactNode
  className?: string
  rotationDegrees: number
  style?: CSSProperties
}

export default function SpringRotation({
  children,
  className,
  rotationDegrees,
  style,
}: SpringRotationProps) {
  const { shouldReduceMotion } = useMotionPreference()

  return (
    <div
      className={classNames(
        "ease-spring-rotation transition-transform duration-[900ms] motion-reduce:transition-none",
        className,
      )}
      style={{
        ...style,
        transform: `rotateY(${rotationDegrees}deg)`,
        transition: shouldReduceMotion ? "none" : undefined,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  )
}
