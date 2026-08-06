"use client"

import { useEffect, useState } from "react"
import {
  DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
  RIVE_IDLE_CALLBACK_TIMEOUT_MILLISECONDS,
  RIVE_START_DELAY_MILLISECONDS,
} from "@/constants/STARTUP_TIMING"

export default function usePostLoadExperienceSchedule(
  hasTypewriterStarted: boolean,
) {
  const [shouldLoadDeferredTypography, setShouldLoadDeferredTypography] =
    useState(false)
  const [hasRiveStartDelayElapsed, setHasRiveStartDelayElapsed] =
    useState(false)
  const [shouldStartRive, setShouldStartRive] = useState(false)

  useEffect(() => {
    let deferredTypographyTimeoutId: number | undefined
    let riveStartTimeoutId: number | undefined

    const schedulePostLoadExperience = () => {
      deferredTypographyTimeoutId = window.setTimeout(
        () => setShouldLoadDeferredTypography(true),
        DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
      )
      riveStartTimeoutId = window.setTimeout(
        () => setHasRiveStartDelayElapsed(true),
        RIVE_START_DELAY_MILLISECONDS,
      )
    }

    if (document.readyState === "complete") schedulePostLoadExperience()
    else
      window.addEventListener("load", schedulePostLoadExperience, {
        once: true,
      })

    return () => {
      window.removeEventListener("load", schedulePostLoadExperience)
      window.clearTimeout(deferredTypographyTimeoutId)
      window.clearTimeout(riveStartTimeoutId)
    }
  }, [])

  useEffect(() => {
    if (!hasRiveStartDelayElapsed || !hasTypewriterStarted) return

    if (
      typeof window.requestIdleCallback !== "function" ||
      typeof window.cancelIdleCallback !== "function"
    ) {
      setShouldStartRive(true)
      return
    }

    const riveIdleCallbackId = window.requestIdleCallback(
      () => setShouldStartRive(true),
      { timeout: RIVE_IDLE_CALLBACK_TIMEOUT_MILLISECONDS },
    )

    return () => window.cancelIdleCallback(riveIdleCallbackId)
  }, [hasRiveStartDelayElapsed, hasTypewriterStarted])

  return { shouldLoadDeferredTypography, shouldStartRive }
}
