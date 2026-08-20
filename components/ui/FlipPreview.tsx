"use client"

import {
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import { SPRING_ROTATION_PRELOAD_DEGREES } from "@/constants/INTERACTIONS"
import classNames from "@/utils/classNames"

type FlipPreviewProps = {
  accessibleName: string
  children: ReactNode
  className?: string
  containerClassName?: string
  containerStyle?: CSSProperties
  isPressed?: boolean
  onActivate: () => void
}

export default function FlipPreview({
  accessibleName,
  children,
  className,
  containerClassName,
  containerStyle,
  isPressed,
  onActivate,
}: FlipPreviewProps) {
  const { shouldReduceMotion } = useMotionPreference()
  const [isPreviewing, setIsPreviewing] = useState(false)

  const stopPreview = () => setIsPreviewing(false)

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") setIsPreviewing(true)
  }

  const stopPointerPropagation = (event: PointerEvent<HTMLButtonElement>) =>
    event.stopPropagation()

  const handleActivate = () => {
    stopPreview()
    onActivate()
  }

  return (
    <div
      className={classNames("perspective", containerClassName)}
      style={{ ...containerStyle, perspective: "1000px" }}
    >
      <button
        type="button"
        aria-label={accessibleName}
        aria-pressed={isPressed}
        className={classNames(
          "flip-preview-control focus-visible:ring-site-focus focus-visible:ring-offset-site-surface-strong ease-spring-soft block cursor-pointer rounded-xl bg-transparent p-0 text-left transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
          className,
        )}
        onPointerDownCapture={stopPointerPropagation}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={stopPreview}
        onPointerCancel={stopPreview}
        onFocus={() => setIsPreviewing(true)}
        onBlur={stopPreview}
        onClick={handleActivate}
      >
        <div
          className="flip-preview-visual ease-spring-rotation pointer-events-none h-full w-full transition-transform duration-[700ms] motion-reduce:transition-none"
          style={{
            transform: `rotateY(${
              shouldReduceMotion || !isPreviewing
                ? 0
                : SPRING_ROTATION_PRELOAD_DEGREES
            }deg)`,
          }}
        >
          {children}
        </div>
      </button>
    </div>
  )
}
