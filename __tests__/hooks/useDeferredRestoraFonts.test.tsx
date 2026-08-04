import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  RESTORA_DISPLAY_CSS_VARIABLE,
  RESTORA_DISPLAY_FONT_WEIGHT,
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
      RESTORA_DISPLAY_CSS_VARIABLE,
      '"restoraDisplay", "restoraDisplay Fallback", Georgia, serif',
    )
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
    document.documentElement.classList.remove(
      ...Object.values(RESTORA_READY_CLASSES),
    )
    document.body.style.removeProperty(RESTORA_DISPLAY_CSS_VARIABLE)
    document.body.style.removeProperty(RESTORA_TEXT_CSS_VARIABLE)
    if (originalDocumentFonts)
      Object.defineProperty(document, "fonts", originalDocumentFonts)
    else Reflect.deleteProperty(document, "fonts")
  })

  it("keeps all Restora faces dormant before post-load readiness", () => {
    renderHook(() => useDeferredRestoraFonts(false))

    expect(loadFontMock).not.toHaveBeenCalled()
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
  })

  it("loads all three faces in parallel before one atomic activation", async () => {
    const resolveFontLoads: Array<(fontFaces: FontFace[]) => void> = []
    loadFontMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFontLoads.push(resolve)
        }),
    )
    const { rerender, unmount } = renderHook(
      (isPostLoadExperienceReady) =>
        useDeferredRestoraFonts(isPostLoadExperienceReady),
      { initialProps: false },
    )

    rerender(true)

    await waitFor(() => expect(resolveFontLoads).toHaveLength(3))
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)

    await act(async () => {
      resolveFontLoads[0]([{} as FontFace])
      await Promise.resolve()
    })
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)

    await act(async () => {
      resolveFontLoads[1]([{} as FontFace])
      await Promise.resolve()
    })
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)

    await act(async () => {
      resolveFontLoads[2]([{} as FontFace])
      await Promise.resolve()
    })
    expect(document.documentElement).toHaveClass(RESTORA_READY_CLASSES.display)
    expect(document.documentElement).toHaveClass(RESTORA_READY_CLASSES.text)
    expect(loadFontMock).toHaveBeenCalledWith(
      `${RESTORA_DISPLAY_FONT_WEIGHT} 1em "restoraDisplay"`,
    )
    expect(loadFontMock).toHaveBeenCalledWith(
      `${RESTORA_TEXT_FONT_WEIGHTS.regular} 1em "restoraText"`,
    )
    expect(loadFontMock).toHaveBeenCalledWith(
      `${RESTORA_TEXT_FONT_WEIGHTS.medium} 1em "restoraText"`,
    )
    expect(loadFontMock).toHaveBeenCalledTimes(3)

    unmount()
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
  })

  it("preserves fallback typography when a licensed face cannot load", async () => {
    loadFontMock.mockImplementation(() =>
      Promise.reject(new Error("Font unavailable")),
    )
    document.documentElement.classList.add(
      ...Object.values(RESTORA_READY_CLASSES),
    )

    renderHook(() => useDeferredRestoraFonts(true))

    await waitFor(() => expect(loadFontMock).toHaveBeenCalledTimes(3))
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
  })

  it("does not reveal an unavailable or stale font face", async () => {
    loadFontMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{} as FontFace])
      .mockResolvedValueOnce([{} as FontFace])
    const unavailableFont = renderHook(() => useDeferredRestoraFonts(true))

    await waitFor(() => expect(loadFontMock).toHaveBeenCalledTimes(3))
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
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

    await waitFor(() => expect(resolveStaleFontLoads).toHaveLength(3))
    staleFont.unmount()
    await act(async () =>
      resolveStaleFontLoads.forEach((resolveStaleFontLoad) =>
        resolveStaleFontLoad([{} as FontFace]),
      ),
    )
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)
  })
})
