"use client"

import { useEffect, useState } from "react"
import {
  BACKGROUND_COLOR_ANIMATION_DELAY_MILLISECONDS,
  DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
  RIVE_IDLE_CALLBACK_TIMEOUT_MILLISECONDS,
  RIVE_START_DELAY_MILLISECONDS,
} from "@/constants/STARTUP_TIMING"

export default function usePostLoadExperienceSchedule(
  hasTypewriterStarted: boolean,
) {
  const [shouldAnimateBackgroundColor, setShouldAnimateBackgroundColor] =
    useState(false)
  const [shouldLoadDeferredTypography, setShouldLoadDeferredTypography] =
    useState(false)
  const [hasRiveStartDelayElapsed, setHasRiveStartDelayElapsed] =
    useState(false)
  const [shouldStartRive, setShouldStartRive] = useState(false)

  useEffect(() => {
    let backgroundColorAnimationTimeoutId: number | undefined
    let deferredTypographyTimeoutId: number | undefined
    let riveStartTimeoutId: number | undefined

    const schedulePostLoadExperience = () => {
      backgroundColorAnimationTimeoutId = window.setTimeout(
        () => setShouldAnimateBackgroundColor(true),
        BACKGROUND_COLOR_ANIMATION_DELAY_MILLISECONDS,
      )
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
      window.clearTimeout(backgroundColorAnimationTimeoutId)
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
      const riveAnimationFrameId = window.requestAnimationFrame(() =>
        setShouldStartRive(true),
      )
      return () => window.cancelAnimationFrame(riveAnimationFrameId)
    }

    const riveIdleCallbackId = window.requestIdleCallback(
      () => setShouldStartRive(true),
      { timeout: RIVE_IDLE_CALLBACK_TIMEOUT_MILLISECONDS },
    )

    return () => window.cancelIdleCallback(riveIdleCallbackId)
  }, [hasRiveStartDelayElapsed, hasTypewriterStarted])

  return {
    shouldAnimateBackgroundColor,
    shouldLoadDeferredTypography,
    shouldStartRive,
  }
}
