"use client"

import { useEffect, useState } from "react"
import scheduleIdleWork from "@/utils/scheduleIdleWork"

export default function useDeferredClientFeature() {
  const [isPostLoadIdleReady, setIsPostLoadIdleReady] = useState(false)

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

  return isPostLoadIdleReady
}
