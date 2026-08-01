"use client"

import { useEffect } from "react"
import {
  RESTORA_CSS_VARIABLE,
  RESTORA_FONT_WEIGHTS,
  RESTORA_READY_CLASSES,
} from "@/constants/TYPOGRAPHY"

const loadRestoraFontWeights = (
  fontWeights: number[],
  readyClassName: string,
) => {
  const documentRoot = document.documentElement
  const primaryRestoraFontFamily = getComputedStyle(document.body)
    .getPropertyValue(RESTORA_CSS_VARIABLE)
    .split(",", 1)[0]
    .trim()
  let isCancelled = false

  void Promise.all(
    fontWeights.map((fontWeight) =>
      document.fonts.load(`${fontWeight} 1em ${primaryRestoraFontFamily}`),
    ),
  )
    .then((loadedFontFaces) => {
      if (
        !isCancelled &&
        loadedFontFaces.every((fontFaces) => fontFaces.length > 0)
      )
        documentRoot.classList.add(readyClassName)
    })
    .catch(() => documentRoot.classList.remove(readyClassName))

  return () => {
    isCancelled = true
    documentRoot.classList.remove(readyClassName)
  }
}

export default function useDeferredRestoraFonts({
  hasMeaningfulUserIntent,
  isPostLoadIdleReady,
}: {
  hasMeaningfulUserIntent: boolean
  isPostLoadIdleReady: boolean
}) {
  useEffect(() => {
    if (!isPostLoadIdleReady) return

    return loadRestoraFontWeights(
      [RESTORA_FONT_WEIGHTS.extraBold],
      RESTORA_READY_CLASSES.display,
    )
  }, [isPostLoadIdleReady])

  useEffect(() => {
    if (!isPostLoadIdleReady || !hasMeaningfulUserIntent) return

    return loadRestoraFontWeights(
      [RESTORA_FONT_WEIGHTS.regular, RESTORA_FONT_WEIGHTS.medium],
      RESTORA_READY_CLASSES.text,
    )
  }, [hasMeaningfulUserIntent, isPostLoadIdleReady])
}
