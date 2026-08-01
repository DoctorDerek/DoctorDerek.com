"use client"

import { useEffect, useState } from "react"

const MEANINGFUL_USER_INTENT_EVENTS = ["pointerdown", "wheel"] as const

export default function useDeferredClientFeature() {
  const [isPostLoadIdleReady, setIsPostLoadIdleReady] = useState(false)
  const [hasMeaningfulUserIntent, setHasMeaningfulUserIntent] = useState(false)

  useEffect(() => {
    let idleCallbackId: number | undefined
    let animationFrameId: number | undefined

    const markPostLoadIdleReady = () => setIsPostLoadIdleReady(true)

    const scheduleDeferredClientFeature = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleCallbackId = window.requestIdleCallback(markPostLoadIdleReady)
        return
      }

      animationFrameId = window.requestAnimationFrame(markPostLoadIdleReady)
    }

    if (document.readyState === "complete") scheduleDeferredClientFeature()
    else
      window.addEventListener("load", scheduleDeferredClientFeature, {
        once: true,
      })

    return () => {
      window.removeEventListener("load", scheduleDeferredClientFeature)
      if (idleCallbackId !== undefined)
        window.cancelIdleCallback(idleCallbackId)
      if (animationFrameId !== undefined)
        window.cancelAnimationFrame(animationFrameId)
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
