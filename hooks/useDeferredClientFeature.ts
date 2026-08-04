"use client"

import { useEffect, useState } from "react"
import { POST_LOAD_QUIET_PERIOD_MILLISECONDS } from "@/constants/STARTUP_TIMING"
import scheduleIdleWork from "@/utils/scheduleIdleWork"

export default function useDeferredClientFeature() {
  const [isPostLoadIdleReady, setIsPostLoadIdleReady] = useState(false)

  useEffect(() => {
    let cancelScheduledIdleWork: (() => void) | undefined
    let quietPeriodTimeoutId: number | undefined

    const markPostLoadIdleReady = () => setIsPostLoadIdleReady(true)
    const scheduleDeferredClientFeature = () => {
      quietPeriodTimeoutId = window.setTimeout(() => {
        cancelScheduledIdleWork = scheduleIdleWork(markPostLoadIdleReady)
      }, POST_LOAD_QUIET_PERIOD_MILLISECONDS)
    }

    if (document.readyState === "complete") scheduleDeferredClientFeature()
    else
      window.addEventListener("load", scheduleDeferredClientFeature, {
        once: true,
      })

    return () => {
      window.removeEventListener("load", scheduleDeferredClientFeature)
      window.clearTimeout(quietPeriodTimeoutId)
      cancelScheduledIdleWork?.()
    }
  }, [])

  return isPostLoadIdleReady
}
