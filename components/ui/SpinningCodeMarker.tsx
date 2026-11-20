"use client"

import cx from "classix"
import { useState, type CSSProperties } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import FlipPreview from "@/components/ui/FlipPreview"
import SpringRotation from "@/components/ui/SpringRotation"
import { CODE_MARKER_ACTIVATION_ROTATION_DEGREES } from "@/constants/INTERACTIONS"
import CodeIcon from "@/images/codeIcon.svg"

type SpinningCodeMarkerProps = {
  accessibleName: string
  animationDelay: string
  className?: string
  isInteractive?: boolean
}

const CodeMarkerGlyph = () => <CodeIcon className="h-5 w-[1.8125rem]" />

export default function SpinningCodeMarker({
  accessibleName,
  animationDelay,
  className,
  isInteractive = true,
}: SpinningCodeMarkerProps) {
  const { shouldReduceMotion } = useMotionPreference()
  const [spinCount, setSpinCount] = useState(0)

  return (
    <div
      className={cx(
        "animate-float absolute h-11 w-11 [animation-delay:var(--float-delay)]",
        className,
      )}
      style={{ "--float-delay": animationDelay } as CSSProperties}
    >
      {isInteractive && !shouldReduceMotion ? (
        <FlipPreview
          accessibleName={accessibleName}
          className="grid h-11 w-11 place-items-center"
          containerClassName="h-11 w-11"
          onActivate={() =>
            setSpinCount((currentSpinCount) => currentSpinCount + 1)
          }
        >
          <SpringRotation
            className="grid h-full w-full place-items-center"
            rotationDegrees={
              spinCount * CODE_MARKER_ACTIVATION_ROTATION_DEGREES
            }
          >
            <CodeMarkerGlyph />
          </SpringRotation>
        </FlipPreview>
      ) : (
        <div
          aria-hidden="true"
          className="grid h-full w-full place-items-center"
        >
          <CodeMarkerGlyph />
        </div>
      )}
    </div>
  )
}
