"use client"

import { useEffect } from "react"
import {
  RESTORA_DISPLAY_CSS_VARIABLE,
  RESTORA_DISPLAY_FONT_WEIGHT,
  RESTORA_READY_CLASSES,
  RESTORA_TEXT_CSS_VARIABLE,
  RESTORA_TEXT_FONT_WEIGHTS,
} from "@/constants/TYPOGRAPHY"

const getRestoraFontFamily = (cssVariable: string) =>
  getComputedStyle(document.body)
    .getPropertyValue(cssVariable)
    .split(",", 1)[0]
    .trim()

const loadDeferredRestoraFonts = () => {
  const documentRoot = document.documentElement
  const restoraDisplayFontFamily = getRestoraFontFamily(
    RESTORA_DISPLAY_CSS_VARIABLE,
  )
  const restoraTextFontFamily = getRestoraFontFamily(
    RESTORA_TEXT_CSS_VARIABLE,
  )
  const deferredFontFaces = [
    [RESTORA_DISPLAY_FONT_WEIGHT, restoraDisplayFontFamily],
    ...Object.values(RESTORA_TEXT_FONT_WEIGHTS).map((fontWeight) => [
      fontWeight,
      restoraTextFontFamily,
    ]),
  ] as const
  const readyClasses = Object.values(RESTORA_READY_CLASSES)
  let isCancelled = false

  void Promise.all(
    deferredFontFaces.map(([fontWeight, fontFamily]) =>
      document.fonts.load(`${fontWeight} 1em ${fontFamily}`),
    ),
  )
    .then((loadedFontFaces) => {
      if (
        !isCancelled &&
        loadedFontFaces.every((fontFaces) => fontFaces.length > 0)
      )
        documentRoot.classList.add(...readyClasses)
    })
    .catch(() => documentRoot.classList.remove(...readyClasses))

  return () => {
    isCancelled = true
    documentRoot.classList.remove(...readyClasses)
  }
}

export default function useDeferredRestoraFonts(
  isPostLoadExperienceReady: boolean,
) {
  useEffect(() => {
    if (!isPostLoadExperienceReady) return

    return loadDeferredRestoraFonts()
  }, [isPostLoadExperienceReady])
}
