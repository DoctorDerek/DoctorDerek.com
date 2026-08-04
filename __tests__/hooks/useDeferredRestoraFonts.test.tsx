import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  RESTORA_READY_CLASSES,
  RESTORA_TEXT_CSS_VARIABLE,
  RESTORA_TEXT_FONT_WEIGHTS,
} from "@/constants/TYPOGRAPHY"
import useDeferredRestoraFonts from "@/hooks/useDeferredRestoraFonts"

const loadFontMock = vi.fn(() => Promise.resolve([{} as FontFace]))
const originalDocumentFonts = Object.getOwnPropertyDescriptor(document, "fonts")

describe("useDeferredRestoraFonts", () => {
  beforeEach(() => {
    loadFontMock.mockReset()
    loadFontMock.mockResolvedValue([{} as FontFace])
    document.body.style.setProperty(
      RESTORA_TEXT_CSS_VARIABLE,
      '"restoraText", "restoraText Fallback", Georgia, "Times New Roman", serif',
    )
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { load: loadFontMock },
    })
  })

  afterEach(() => {
    document.documentElement.classList.remove(RESTORA_READY_CLASSES.text)
    document.body.style.removeProperty(RESTORA_TEXT_CSS_VARIABLE)
    if (originalDocumentFonts)
      Object.defineProperty(document, "fonts", originalDocumentFonts)
    else Reflect.deleteProperty(document, "fonts")
  })

  it("keeps deferred text fonts dormant before post-load readiness", () => {
    renderHook(() => useDeferredRestoraFonts(false))

    expect(loadFontMock).not.toHaveBeenCalled()
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
  })

  it("loads Regular and Medium automatically after post-load readiness", async () => {
    const { rerender, unmount } = renderHook(
      (isPostLoadExperienceReady) =>
        useDeferredRestoraFonts(isPostLoadExperienceReady),
      { initialProps: false },
    )

    rerender(true)

    await waitFor(() =>
      expect(document.documentElement).toHaveClass(RESTORA_READY_CLASSES.text),
    )
    expect(loadFontMock).toHaveBeenCalledWith(
      `${RESTORA_TEXT_FONT_WEIGHTS.regular} 1em "restoraText"`,
    )
    expect(loadFontMock).toHaveBeenCalledWith(
      `${RESTORA_TEXT_FONT_WEIGHTS.medium} 1em "restoraText"`,
    )
    expect(loadFontMock).toHaveBeenCalledTimes(2)

    unmount()
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
  })

  it("preserves fallback typography when a licensed face cannot load", async () => {
    loadFontMock.mockImplementation(() =>
      Promise.reject(new Error("Font unavailable")),
    )
    document.documentElement.classList.add(RESTORA_READY_CLASSES.text)

    renderHook(() => useDeferredRestoraFonts(true))

    await waitFor(() => expect(loadFontMock).toHaveBeenCalledTimes(2))
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
  })

  it("does not reveal an unavailable or stale font face", async () => {
    loadFontMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{} as FontFace])
    const unavailableFont = renderHook(() => useDeferredRestoraFonts(true))

    await waitFor(() => expect(loadFontMock).toHaveBeenCalledTimes(2))
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
    unavailableFont.unmount()

    const resolveStaleFontLoads: Array<(fontFaces: FontFace[]) => void> = []
    loadFontMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveStaleFontLoads.push(resolve)
        }),
    )
    const staleFont = renderHook(() => useDeferredRestoraFonts(true))

    await waitFor(() => expect(resolveStaleFontLoads).toHaveLength(2))
    staleFont.unmount()
    await act(async () =>
      resolveStaleFontLoads.forEach((resolveStaleFontLoad) =>
        resolveStaleFontLoad([{} as FontFace]),
      ),
    )
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
  })
})
