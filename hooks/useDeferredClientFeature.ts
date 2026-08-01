"use client"

import { useEffect, useState } from "react"
import scheduleIdleWork from "@/utils/scheduleIdleWork"

const MEANINGFUL_USER_INTENT_EVENTS = ["pointerdown", "wheel"] as const

export default function useDeferredClientFeature() {
  const [isPostLoadIdleReady, setIsPostLoadIdleReady] = useState(false)
  const [hasMeaningfulUserIntent, setHasMeaningfulUserIntent] = useState(false)

  useEffect(() => {
    let cancelScheduledIdleWork: (() => void) | undefined

    const markPostLoadIdleReady = () => setIsPostLoadIdleReady(true)
    const scheduleDeferredClientFeature = () => {
      cancelScheduledIdleWork = scheduleIdleWork(markPostLoadIdleReady)
    }

    if (document.readyState === "complete") scheduleDeferredClientFeature()
    else
      window.addEventListener("load", scheduleDeferredClientFeature, {
        once: true,
      })

    return () => {
      window.removeEventListener("load", scheduleDeferredClientFeature)
      cancelScheduledIdleWork?.()
    }
  }, [])

  useEffect(() => {
    if (hasMeaningfulUserIntent) return

    const captureMeaningfulUserIntent = () => setHasMeaningfulUserIntent(true)

    MEANINGFUL_USER_INTENT_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, captureMeaningfulUserIntent, {
        passive: true,
      }),
    )
    window.addEventListener("keydown", captureMeaningfulUserIntent)

    return () => {
      MEANINGFUL_USER_INTENT_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, captureMeaningfulUserIntent),
      )
      window.removeEventListener("keydown", captureMeaningfulUserIntent)
    }
  }, [hasMeaningfulUserIntent])

  return { isPostLoadIdleReady, hasMeaningfulUserIntent }
}
