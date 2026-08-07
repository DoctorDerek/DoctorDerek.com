"use client"

import { useEffect, useState } from "react"
import classNames from "@/utils/classNames"

export default function BackgroundPattern({ source }: { source: string }) {
  const [patternSources, setPatternSources] = useState([source])

  useEffect(() => {
    setPatternSources((currentPatternSources) => {
      const currentSource = currentPatternSources.at(-1)!
      return currentSource === source ? currentPatternSources : [currentSource, source]
    })
  }, [source])

  const finishCrossfade = () => {
    setPatternSources((currentPatternSources) =>
      currentPatternSources.length === 1
        ? currentPatternSources
        : [currentPatternSources.at(-1)!],
    )
  }

  return patternSources.map((patternSource, index) => {
    const isActivePattern = index === patternSources.length - 1
    const isEnteringPattern = isActivePattern && patternSources.length > 1

    return (
      <img
        key={patternSource}
        src={patternSource}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={classNames(
          "background-pattern-layer absolute inset-0 z-10 h-full w-full object-cover mix-blend-overlay transition-opacity ease-linear",
          isActivePattern && "background-pattern-layer-active",
          isEnteringPattern && "background-pattern-layer-entering",
        )}
        style={{ transitionDuration: "20s" }}
        onTransitionEnd={finishCrossfade}
      />
    )
  })
}
