"use client"

import { useEffect, useState } from "react"
import {
  DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
  RIVE_IDLE_CALLBACK_TIMEOUT_MILLISECONDS,
  RIVE_START_DELAY_MILLISECONDS,
} from "@/constants/STARTUP_TIMING"

export default function usePostLoadExperienceSchedule() {
  const [shouldLoadDeferredTypography, setShouldLoadDeferredTypography] =
    useState(false)
  const [shouldStartRive, setShouldStartRive] = useState(false)

  useEffect(() => {
    let deferredTypographyTimeoutId: number | undefined
    let riveStartTimeoutId: number | undefined
    let riveIdleCallbackId: number | undefined

    const startRiveWhenBrowserIsIdle = () => {
      if (
        typeof window.requestIdleCallback !== "function" ||
        typeof window.cancelIdleCallback !== "function"
      ) {
        setShouldStartRive(true)
        return
      }

      riveIdleCallbackId = window.requestIdleCallback(
        () => setShouldStartRive(true),
        { timeout: RIVE_IDLE_CALLBACK_TIMEOUT_MILLISECONDS },
      )
    }

    const schedulePostLoadExperience = () => {
      deferredTypographyTimeoutId = window.setTimeout(
        () => setShouldLoadDeferredTypography(true),
        DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
      )
      riveStartTimeoutId = window.setTimeout(
        startRiveWhenBrowserIsIdle,
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
      if (riveIdleCallbackId !== undefined)
        window.cancelIdleCallback(riveIdleCallbackId)
    }
  }, [])

  return { shouldLoadDeferredTypography, shouldStartRive }
}
