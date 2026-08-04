"use client"

import { useEffect, useState } from "react"
import { POST_LOAD_QUIET_PERIOD_MILLISECONDS } from "@/constants/STARTUP_TIMING"
import scheduleIdleWork from "@/utils/scheduleIdleWork"

export default function usePostLoadExperienceReady() {
  const [isPostLoadExperienceReady, setIsPostLoadExperienceReady] =
    useState(false)

  useEffect(() => {
    let cancelScheduledIdleWork: (() => void) | undefined
    let quietPeriodTimeoutId: number | undefined

    const markPostLoadExperienceReady = () => setIsPostLoadExperienceReady(true)
    const schedulePostLoadExperience = () => {
      quietPeriodTimeoutId = window.setTimeout(() => {
        cancelScheduledIdleWork = scheduleIdleWork(markPostLoadExperienceReady)
      }, POST_LOAD_QUIET_PERIOD_MILLISECONDS)
    }

    if (document.readyState === "complete") schedulePostLoadExperience()
    else
      window.addEventListener("load", schedulePostLoadExperience, {
        once: true,
      })

    return () => {
      window.removeEventListener("load", schedulePostLoadExperience)
      window.clearTimeout(quietPeriodTimeoutId)
      cancelScheduledIdleWork?.()
    }
  }, [])

  return isPostLoadExperienceReady
}
