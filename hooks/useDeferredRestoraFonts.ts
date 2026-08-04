"use client"

import { useEffect } from "react"
import {
  RESTORA_READY_CLASSES,
  RESTORA_TEXT_CSS_VARIABLE,
  RESTORA_TEXT_FONT_WEIGHTS,
} from "@/constants/TYPOGRAPHY"

const loadDeferredRestoraTextFonts = () => {
  const documentRoot = document.documentElement
  const restoraTextFontFamily = getComputedStyle(document.body)
    .getPropertyValue(RESTORA_TEXT_CSS_VARIABLE)
    .split(",", 1)[0]
    .trim()
  let isCancelled = false

  void Promise.all(
    Object.values(RESTORA_TEXT_FONT_WEIGHTS).map((fontWeight) =>
      document.fonts.load(`${fontWeight} 1em ${restoraTextFontFamily}`),
    ),
  )
    .then((loadedFontFaces) => {
      if (
        !isCancelled &&
        loadedFontFaces.every((fontFaces) => fontFaces.length > 0)
      )
        documentRoot.classList.add(RESTORA_READY_CLASSES.text)
    })
    .catch(() => documentRoot.classList.remove(RESTORA_READY_CLASSES.text))

  return () => {
    isCancelled = true
    documentRoot.classList.remove(RESTORA_READY_CLASSES.text)
  }
}

export default function useDeferredRestoraFonts(isPostLoadIdleReady: boolean) {
  useEffect(() => {
    if (!isPostLoadIdleReady) return

    return loadDeferredRestoraTextFonts()
  }, [isPostLoadIdleReady])
}
