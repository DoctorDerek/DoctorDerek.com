import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { POST_LOAD_QUIET_PERIOD_MILLISECONDS } from "@/constants/STARTUP_TIMING"
import usePostLoadExperienceReady from "@/hooks/usePostLoadExperienceReady"

const idleDeadline = {
  didTimeout: false,
  timeRemaining: () => 50,
}

describe("usePostLoadExperienceReady", () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("preserves a quiet period before requesting idle time", () => {
    vi.useFakeTimers()
    let idleCallback: IdleRequestCallback | undefined
    const cancelIdleCallback = vi.fn()
    const requestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
      idleCallback = callback
      return 7
    })
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete")
    vi.stubGlobal("requestIdleCallback", requestIdleCallback)
    vi.stubGlobal("cancelIdleCallback", cancelIdleCallback)

    const { result, unmount } = renderHook(() => usePostLoadExperienceReady())

    act(() => vi.advanceTimersByTime(POST_LOAD_QUIET_PERIOD_MILLISECONDS - 1))
    expect(requestIdleCallback).not.toHaveBeenCalled()
    expect(result.current).toBe(false)

    act(() => vi.advanceTimersByTime(1))
    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), {
      timeout: expect.any(Number),
    })
    expect(result.current).toBe(false)
    act(() => idleCallback?.(idleDeadline))
    expect(result.current).toBe(true)

    unmount()
    expect(cancelIdleCallback).toHaveBeenCalledWith(7)
  })

  it("uses the next paint after load when idle callbacks are unavailable", () => {
    vi.useFakeTimers()
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

    const { result, unmount } = renderHook(() => usePostLoadExperienceReady())

    expect(result.current).toBe(false)
    act(() => window.dispatchEvent(new Event("load")))
    expect(requestAnimationFrame).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(POST_LOAD_QUIET_PERIOD_MILLISECONDS))
    expect(requestAnimationFrame).toHaveBeenCalledOnce()
    act(() => animationFrameCallback?.(0))
    expect(result.current).toBe(true)

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(11)
  })

  it("removes its page-load listener when the consumer unmounts early", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener")
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading")

    const { unmount } = renderHook(() => usePostLoadExperienceReady())

    unmount()
    expect(removeEventListener).toHaveBeenCalledWith(
      "load",
      expect.any(Function),
    )
  })

  it("cancels the quiet period when the consumer unmounts after load", () => {
    vi.useFakeTimers()
    const requestIdleCallback = vi.fn()
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading")
    vi.stubGlobal("requestIdleCallback", requestIdleCallback)

    const { unmount } = renderHook(() => usePostLoadExperienceReady())

    act(() => window.dispatchEvent(new Event("load")))
    unmount()
    act(() => vi.advanceTimersByTime(POST_LOAD_QUIET_PERIOD_MILLISECONDS))

    expect(requestIdleCallback).not.toHaveBeenCalled()
  })
})
