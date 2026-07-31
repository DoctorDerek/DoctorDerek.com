"use client"

import { useEffect, useState } from "react"

export default function useDeferredClientFeature() {
  const [isDeferredClientFeatureReady, setIsDeferredClientFeatureReady] =
    useState(false)

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

  return isDeferredClientFeatureReady
}
