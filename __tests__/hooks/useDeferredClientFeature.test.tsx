import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import useDeferredClientFeature from "@/hooks/useDeferredClientFeature"

const idleDeadline = {
  didTimeout: false,
  timeRemaining: () => 50,
}

describe("useDeferredClientFeature", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("waits for idle time after a completed page load", () => {
    let idleCallback: IdleRequestCallback | undefined
    const cancelIdleCallback = vi.fn()
    const requestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
      idleCallback = callback
      return 7
    })
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete")
    vi.stubGlobal("requestIdleCallback", requestIdleCallback)
    vi.stubGlobal("cancelIdleCallback", cancelIdleCallback)

    const { result, unmount } = renderHook(() => useDeferredClientFeature())

    expect(result.current).toEqual({
      isPostLoadIdleReady: false,
      hasMeaningfulUserIntent: false,
    })
    act(() => idleCallback?.(idleDeadline))
    expect(result.current).toEqual({
      isPostLoadIdleReady: true,
      hasMeaningfulUserIntent: false,
    })
    act(() => window.dispatchEvent(new PointerEvent("pointermove")))
    expect(result.current.hasMeaningfulUserIntent).toBe(false)
    act(() => window.dispatchEvent(new PointerEvent("pointerdown")))
    expect(result.current).toEqual({
      isPostLoadIdleReady: true,
      hasMeaningfulUserIntent: true,
    })

    unmount()
    expect(cancelIdleCallback).toHaveBeenCalledWith(7)
  })

  it("uses the next paint after load when idle callbacks are unavailable", () => {
    let animationFrameCallback: FrameRequestCallback | undefined
    const cancelAnimationFrame = vi.fn()
    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      animationFrameCallback = callback
      return 11
    })
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading")
    vi.stubGlobal("requestIdleCallback", undefined)
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame)
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame)

    const { result, unmount } = renderHook(() => useDeferredClientFeature())

    expect(result.current).toEqual({
      isPostLoadIdleReady: false,
      hasMeaningfulUserIntent: false,
    })
    act(() => window.dispatchEvent(new PointerEvent("pointerdown")))
    expect(result.current).toEqual({
      isPostLoadIdleReady: false,
      hasMeaningfulUserIntent: true,
    })
    act(() => window.dispatchEvent(new Event("load")))
    expect(requestAnimationFrame).toHaveBeenCalledOnce()
    act(() => animationFrameCallback?.(0))
    expect(result.current).toEqual({
      isPostLoadIdleReady: true,
      hasMeaningfulUserIntent: true,
    })

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(11)
  })

  it("removes its page-load listener when the consumer unmounts early", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener")
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading")

    const { unmount } = renderHook(() => useDeferredClientFeature())

    unmount()
    expect(removeEventListener).toHaveBeenCalledWith(
      "load",
      expect.any(Function),
    )
    expect(removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    )
  })
})
