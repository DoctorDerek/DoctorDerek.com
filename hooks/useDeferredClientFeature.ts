"use client"

import { useEffect, useState } from "react"

const PASSIVE_USER_INTENT_EVENTS = [
  "pointermove",
  "pointerdown",
  "wheel",
] as const

export default function useDeferredClientFeature() {
  const [isDeferredClientFeatureReady, setIsDeferredClientFeatureReady] =
    useState(false)
  const [hasUserIntent, setHasUserIntent] = useState(false)

  useEffect(() => {
    let idleCallbackId: number | undefined
    let animationFrameId: number | undefined

    const markDeferredClientFeatureReady = () =>
      setIsDeferredClientFeatureReady(true)

    const scheduleDeferredClientFeature = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleCallbackId = window.requestIdleCallback(
          markDeferredClientFeatureReady,
        )
        return
      }

      animationFrameId = window.requestAnimationFrame(
        markDeferredClientFeatureReady,
      )
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
    if (hasUserIntent) return

    const captureUserIntent = () => setHasUserIntent(true)

    PASSIVE_USER_INTENT_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, captureUserIntent, { passive: true }),
    )
    window.addEventListener("keydown", captureUserIntent)

    return () => {
      PASSIVE_USER_INTENT_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, captureUserIntent),
      )
      window.removeEventListener("keydown", captureUserIntent)
    }
  }, [hasUserIntent])

  return isDeferredClientFeatureReady && hasUserIntent
}
