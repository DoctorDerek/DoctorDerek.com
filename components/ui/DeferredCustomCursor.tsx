"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, useSyncExternalStore } from "react"
import { CUSTOM_CURSOR_IDLE_CALLBACK_TIMEOUT_MILLISECONDS } from "@/constants/STARTUP_TIMING"

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
})

const CUSTOM_CURSOR_MEDIA_QUERY = "(hover: hover) and (pointer: fine)"

const getCustomCursorMediaQuerySnapshot = () =>
  window.matchMedia(CUSTOM_CURSOR_MEDIA_QUERY).matches

const subscribeToCustomCursorMediaQuery = (
  onCustomCursorMediaQueryChange: () => void,
) => {
  const customCursorMediaQuery = window.matchMedia(CUSTOM_CURSOR_MEDIA_QUERY)
  customCursorMediaQuery.addEventListener(
    "change",
    onCustomCursorMediaQueryChange,
  )

  return () =>
    customCursorMediaQuery.removeEventListener(
      "change",
      onCustomCursorMediaQueryChange,
    )
}

export default function DeferredCustomCursor({
  shouldLoad,
}: {
  shouldLoad: boolean
}) {
  const [hasBrowserGrantedCursorLoad, setHasBrowserGrantedCursorLoad] =
    useState(false)
  const shouldUseCustomCursor = useSyncExternalStore(
    subscribeToCustomCursorMediaQuery,
    getCustomCursorMediaQuerySnapshot,
    () => false,
  )

  useEffect(() => {
    if (!shouldLoad || !shouldUseCustomCursor) return

    let animationFrameId: number | undefined
    let idleCallbackId: number | undefined
    const grantCursorLoad = () => setHasBrowserGrantedCursorLoad(true)

    if (
      typeof window.requestIdleCallback === "function" &&
      typeof window.cancelIdleCallback === "function"
    )
      idleCallbackId = window.requestIdleCallback(grantCursorLoad, {
        timeout: CUSTOM_CURSOR_IDLE_CALLBACK_TIMEOUT_MILLISECONDS,
      })
    else animationFrameId = window.requestAnimationFrame(grantCursorLoad)

    return () => {
      if (animationFrameId !== undefined)
        window.cancelAnimationFrame(animationFrameId)
      if (idleCallbackId !== undefined)
        window.cancelIdleCallback(idleCallbackId)
    }
  }, [shouldLoad, shouldUseCustomCursor])

  if (!shouldLoad || !shouldUseCustomCursor || !hasBrowserGrantedCursorLoad)
    return null

  return <CustomCursor />
}
