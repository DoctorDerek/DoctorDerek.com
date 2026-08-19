"use client"

import { useState } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import FlipPreview from "@/components/ui/FlipPreview"
import SpringRotation from "@/components/ui/SpringRotation"
import { CODE_MARKER_ACTIVATION_ROTATION_DEGREES } from "@/constants/INTERACTIONS"
import CodeIcon from "@/images/codeIcon.svg"
import classNames from "@/utils/classNames"

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
      className={classNames("animate-float absolute h-11 w-11", className)}
      style={{ animationDelay }}
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
