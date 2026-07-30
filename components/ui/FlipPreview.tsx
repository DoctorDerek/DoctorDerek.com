"use client"

import { motion, type Transition } from "motion/react"
import {
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import classNames from "@/utils/classNames"

const FLIP_PREVIEW_ROTATION = -12

const FLIP_PREVIEW_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 18,
  mass: 0.7,
} satisfies Transition

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
      <motion.button
        type="button"
        aria-label={accessibleName}
        aria-pressed={isPressed}
        className={classNames(
          "flip-preview-control focus-visible:ring-site-focus focus-visible:ring-offset-site-surface-strong block cursor-pointer rounded-xl bg-transparent p-0 text-left focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none",
          className,
        )}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        onPointerDownCapture={stopPointerPropagation}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={stopPreview}
        onPointerCancel={stopPreview}
        onFocus={() => setIsPreviewing(true)}
        onBlur={stopPreview}
        onClick={handleActivate}
      >
        <motion.div
          className="flip-preview-visual pointer-events-none h-full w-full"
          animate={{
            rotateY:
              shouldReduceMotion || !isPreviewing ? 0 : FLIP_PREVIEW_ROTATION,
          }}
          transition={
            shouldReduceMotion ? { duration: 0 } : FLIP_PREVIEW_TRANSITION
          }
        >
          {children}
        </motion.div>
      </motion.button>
    </div>
  )
}
