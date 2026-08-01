import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  RESTORA_CSS_VARIABLE,
  RESTORA_FONT_WEIGHTS,
  RESTORA_READY_CLASSES,
} from "@/constants/TYPOGRAPHY"
import useDeferredRestoraFonts from "@/hooks/useDeferredRestoraFonts"

const loadFontMock = vi.fn(() => Promise.resolve([{} as FontFace]))
const originalDocumentFonts = Object.getOwnPropertyDescriptor(document, "fonts")

describe("useDeferredRestoraFonts", () => {
  beforeEach(() => {
    loadFontMock.mockClear()
    document.body.style.setProperty(RESTORA_CSS_VARIABLE, '"restora"')
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { load: loadFontMock },
    })
  })

  afterEach(() => {
    document.documentElement.classList.remove(
      RESTORA_READY_CLASSES.display,
      RESTORA_READY_CLASSES.text,
    )
    document.body.style.removeProperty(RESTORA_CSS_VARIABLE)
    if (originalDocumentFonts)
      Object.defineProperty(document, "fonts", originalDocumentFonts)
    else Reflect.deleteProperty(document, "fonts")
  })

  it("keeps every licensed font dormant before post-load idle", () => {
    renderHook(() =>
      useDeferredRestoraFonts({
        hasMeaningfulUserIntent: false,
        isPostLoadIdleReady: false,
      }),
    )

    expect(loadFontMock).not.toHaveBeenCalled()
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
      RESTORA_READY_CLASSES.text,
    )
  })

  it("loads ExtraBold after idle and Regular plus Medium after intent", async () => {
    const { rerender, unmount } = renderHook(
      ({ hasMeaningfulUserIntent, isPostLoadIdleReady }) =>
        useDeferredRestoraFonts({
          hasMeaningfulUserIntent,
          isPostLoadIdleReady,
        }),
      {
        initialProps: {
          hasMeaningfulUserIntent: false,
          isPostLoadIdleReady: false,
        },
      },
    )

    rerender({
      hasMeaningfulUserIntent: false,
      isPostLoadIdleReady: true,
    })

    await waitFor(() =>
      expect(document.documentElement).toHaveClass(
        RESTORA_READY_CLASSES.display,
      ),
    )
    expect(loadFontMock).toHaveBeenCalledWith(
      `${RESTORA_FONT_WEIGHTS.extraBold} 1em "restora"`,
    )
    expect(document.documentElement).not.toHaveClass(RESTORA_READY_CLASSES.text)

    rerender({
      hasMeaningfulUserIntent: true,
      isPostLoadIdleReady: true,
    })

    await waitFor(() =>
      expect(document.documentElement).toHaveClass(RESTORA_READY_CLASSES.text),
    )
    expect(loadFontMock).toHaveBeenCalledWith(
      `${RESTORA_FONT_WEIGHTS.regular} 1em "restora"`,
    )
    expect(loadFontMock).toHaveBeenCalledWith(
      `${RESTORA_FONT_WEIGHTS.medium} 1em "restora"`,
    )

    unmount()
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
      RESTORA_READY_CLASSES.text,
    )
  })

  it("preserves fallback typography when a licensed face cannot load", async () => {
    loadFontMock.mockRejectedValueOnce(new Error("Font unavailable"))
    document.documentElement.classList.add(RESTORA_READY_CLASSES.display)

    renderHook(() =>
      useDeferredRestoraFonts({
        hasMeaningfulUserIntent: false,
        isPostLoadIdleReady: true,
      }),
    )

    await waitFor(() =>
      expect(document.documentElement).not.toHaveClass(
        RESTORA_READY_CLASSES.display,
      ),
    )
  })

  it("does not reveal an unavailable or stale font face", async () => {
    loadFontMock.mockResolvedValueOnce([])
    const unavailableFont = renderHook(() =>
      useDeferredRestoraFonts({
        hasMeaningfulUserIntent: false,
        isPostLoadIdleReady: true,
      }),
    )

    await waitFor(() => expect(loadFontMock).toHaveBeenCalledOnce())
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
    unavailableFont.unmount()

    let resolveStaleFont: ((fontFaces: FontFace[]) => void) | undefined
    loadFontMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveStaleFont = resolve
        }),
    )
    const staleFont = renderHook(() =>
      useDeferredRestoraFonts({
        hasMeaningfulUserIntent: false,
        isPostLoadIdleReady: true,
      }),
    )

    staleFont.unmount()
    await act(async () => resolveStaleFont?.([{} as FontFace]))
    expect(document.documentElement).not.toHaveClass(
      RESTORA_READY_CLASSES.display,
    )
  })
})
