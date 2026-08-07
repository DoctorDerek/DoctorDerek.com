"use client"

import Image from "next/image"
import { useState } from "react"
import classNames from "@/utils/classNames"

export default function BackgroundPattern({ source }: { source: string }) {
  const [patternState, setPatternState] = useState({
    activeSource: source,
    previousSource: null as string | null,
  })

  if (source !== patternState.activeSource) {
    setPatternState({
      activeSource: source,
      previousSource: patternState.activeSource,
    })
  }

  const patternSources = patternState.previousSource
    ? [patternState.previousSource, patternState.activeSource]
    : [patternState.activeSource]

  const finishCrossfade = () => {
    setPatternState((currentPatternState) => ({
      activeSource: currentPatternState.activeSource,
      previousSource: null,
    }))
  }

  return patternSources.map((patternSource, index) => {
    const isActivePattern = index === patternSources.length - 1
    const isEnteringPattern = isActivePattern && patternSources.length > 1

    return (
      <Image
        key={patternSource}
        src={patternSource}
        alt=""
        aria-hidden
        draggable={false}
        fill
        sizes="100vw"
        unoptimized
        loading="eager"
        className={classNames(
          "background-pattern-layer absolute inset-0 z-10 h-full w-full object-cover mix-blend-overlay transition-opacity ease-linear",
          isActivePattern && "background-pattern-layer-active",
          isEnteringPattern && "background-pattern-layer-entering",
        )}
        style={{ transitionDuration: "20s" }}
        onTransitionEnd={isEnteringPattern ? finishCrossfade : undefined}
      />
    )
  })
}
