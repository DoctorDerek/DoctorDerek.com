import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { POST_LOAD_QUIET_PERIOD_MILLISECONDS } from "@/constants/STARTUP_TIMING"
import usePostLoadExperienceReady from "@/hooks/usePostLoadExperienceReady"

describe("usePostLoadExperienceReady", () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("becomes ready after one exact quiet period when the page is loaded", () => {
    vi.useFakeTimers()
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete")

    const { result } = renderHook(() => usePostLoadExperienceReady())

    act(() => vi.advanceTimersByTime(POST_LOAD_QUIET_PERIOD_MILLISECONDS - 1))
    expect(result.current).toBe(false)

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe(true)
  })

  it("starts its quiet period only after a loading document completes", () => {
    vi.useFakeTimers()
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading")

    const { result } = renderHook(() => usePostLoadExperienceReady())

    expect(result.current).toBe(false)
    act(() => vi.advanceTimersByTime(POST_LOAD_QUIET_PERIOD_MILLISECONDS))
    expect(result.current).toBe(false)

    act(() => window.dispatchEvent(new Event("load")))
    act(() => vi.advanceTimersByTime(POST_LOAD_QUIET_PERIOD_MILLISECONDS - 1))
    expect(result.current).toBe(false)

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe(true)
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
    const clearTimeout = vi.spyOn(window, "clearTimeout")
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading")

    const { unmount } = renderHook(() => usePostLoadExperienceReady())

    act(() => window.dispatchEvent(new Event("load")))
    unmount()
    act(() => vi.advanceTimersByTime(POST_LOAD_QUIET_PERIOD_MILLISECONDS))

    expect(clearTimeout).toHaveBeenCalledOnce()
  })
})
