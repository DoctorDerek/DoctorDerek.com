"use client"

import { useEffect, useState } from "react"
import { POST_LOAD_QUIET_PERIOD_MILLISECONDS } from "@/constants/STARTUP_TIMING"

export default function usePostLoadExperienceReady() {
  const [isPostLoadExperienceReady, setIsPostLoadExperienceReady] =
    useState(false)

  useEffect(() => {
    let quietPeriodTimeoutId: number | undefined

    const schedulePostLoadExperience = () => {
      quietPeriodTimeoutId = window.setTimeout(
        () => setIsPostLoadExperienceReady(true),
        POST_LOAD_QUIET_PERIOD_MILLISECONDS,
      )
    }

    if (document.readyState === "complete") schedulePostLoadExperience()
    else
      window.addEventListener("load", schedulePostLoadExperience, {
        once: true,
      })

    return () => {
      window.removeEventListener("load", schedulePostLoadExperience)
      window.clearTimeout(quietPeriodTimeoutId)
    }
  }, [])

  return isPostLoadExperienceReady
}
