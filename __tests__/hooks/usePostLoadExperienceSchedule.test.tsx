import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  BACKGROUND_COLOR_ANIMATION_DELAY_MILLISECONDS,
  DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
  RIVE_IDLE_CALLBACK_TIMEOUT_MILLISECONDS,
  RIVE_START_DELAY_MILLISECONDS,
} from "@/constants/STARTUP_TIMING"
import usePostLoadExperienceSchedule from "@/hooks/usePostLoadExperienceSchedule"

const RIVE_IDLE_CALLBACK_ID = 17
let scheduledRiveIdleCallback: IdleRequestCallback | undefined
let scheduledRiveAnimationFrame: FrameRequestCallback | undefined
const requestIdleCallbackMock = vi.fn(
  (callback: IdleRequestCallback): number => {
    scheduledRiveIdleCallback = callback
    return RIVE_IDLE_CALLBACK_ID
  },
)
const cancelIdleCallbackMock = vi.fn()
const cancelAnimationFrameMock = vi.fn()
const requestAnimationFrameMock = vi.fn(
  (callback: FrameRequestCallback): number => {
    scheduledRiveAnimationFrame = callback
    return 23
  },
)

const completeRiveIdleCallback = () => {
  act(() =>
    scheduledRiveIdleCallback?.({
      didTimeout: false,
      timeRemaining: () => 50,
    }),
  )
}

describe("usePostLoadExperienceSchedule", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    scheduledRiveIdleCallback = undefined
    scheduledRiveAnimationFrame = undefined
    requestIdleCallbackMock.mockClear()
    cancelIdleCallbackMock.mockClear()
    requestAnimationFrameMock.mockClear()
    cancelAnimationFrameMock.mockClear()
    vi.stubGlobal("requestIdleCallback", requestIdleCallbackMock)
    vi.stubGlobal("cancelIdleCallback", cancelIdleCallbackMock)
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock)
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock)
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("stages deferred typography before idle Rive initialization", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete")

    const { result, unmount } = renderHook(() =>
      usePostLoadExperienceSchedule(true),
    )

    act(() =>
      vi.advanceTimersByTime(BACKGROUND_COLOR_ANIMATION_DELAY_MILLISECONDS - 1),
    )
    expect(result.current).toEqual({
      shouldAnimateBackgroundColor: false,
      shouldLoadDeferredTypography: false,
      shouldStartRive: false,
    })

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toEqual({
      shouldAnimateBackgroundColor: true,
      shouldLoadDeferredTypography: false,
      shouldStartRive: false,
    })

    act(() =>
      vi.advanceTimersByTime(
        DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS -
          BACKGROUND_COLOR_ANIMATION_DELAY_MILLISECONDS,
      ),
    )
    expect(result.current).toEqual({
      shouldAnimateBackgroundColor: true,
      shouldLoadDeferredTypography: true,
      shouldStartRive: false,
    })

    act(() =>
      vi.advanceTimersByTime(
        RIVE_START_DELAY_MILLISECONDS - DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
      ),
    )
    expect(requestIdleCallbackMock).toHaveBeenCalledWith(expect.any(Function), {
      timeout: RIVE_IDLE_CALLBACK_TIMEOUT_MILLISECONDS,
    })
    expect(result.current.shouldStartRive).toBe(false)

    completeRiveIdleCallback()
    expect(result.current.shouldStartRive).toBe(true)
    unmount()
  })

  it("waits for Typewriter initialization after the Rive delay elapses", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete")

    const { result, rerender, unmount } = renderHook(
      (hasTypewriterStarted) =>
        usePostLoadExperienceSchedule(hasTypewriterStarted),
      { initialProps: false },
    )

    act(() => vi.advanceTimersByTime(RIVE_START_DELAY_MILLISECONDS))
    expect(result.current.shouldAnimateBackgroundColor).toBe(true)
    expect(result.current.shouldLoadDeferredTypography).toBe(true)
    expect(requestIdleCallbackMock).not.toHaveBeenCalled()
    expect(result.current.shouldStartRive).toBe(false)

    rerender(true)
    expect(requestIdleCallbackMock).toHaveBeenCalledOnce()

    completeRiveIdleCallback()
    expect(result.current.shouldStartRive).toBe(true)
    unmount()
  })

  it("starts both post-load boundaries only after a loading document completes", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading")

    const { result, unmount } = renderHook(() =>
      usePostLoadExperienceSchedule(true),
    )

    act(() => vi.advanceTimersByTime(RIVE_START_DELAY_MILLISECONDS))
    expect(result.current.shouldAnimateBackgroundColor).toBe(false)
    expect(result.current.shouldLoadDeferredTypography).toBe(false)
    expect(requestIdleCallbackMock).not.toHaveBeenCalled()

    act(() => window.dispatchEvent(new Event("load")))
    act(() => vi.advanceTimersByTime(RIVE_START_DELAY_MILLISECONDS))
    expect(result.current.shouldAnimateBackgroundColor).toBe(true)
    expect(result.current.shouldLoadDeferredTypography).toBe(true)
    expect(requestIdleCallbackMock).toHaveBeenCalledOnce()

    completeRiveIdleCallback()
    expect(result.current.shouldStartRive).toBe(true)
    unmount()
  })

  it.each(["requestIdleCallback", "cancelIdleCallback"] as const)(
    "starts Rive at its boundary when %s is unavailable",
    (unsupportedIdleCallbackApi) => {
      vi.stubGlobal(unsupportedIdleCallbackApi, undefined)
      vi.spyOn(document, "readyState", "get").mockReturnValue("complete")

      const { result, unmount } = renderHook(() =>
        usePostLoadExperienceSchedule(true),
      )

      act(() => vi.advanceTimersByTime(RIVE_START_DELAY_MILLISECONDS))
      expect(requestAnimationFrameMock).toHaveBeenCalledOnce()
      act(() => scheduledRiveAnimationFrame?.(0))
      expect(result.current.shouldStartRive).toBe(true)
      unmount()
      expect(cancelAnimationFrameMock).toHaveBeenCalledWith(23)
    },
  )

  it("removes its load listener when the consumer unmounts before load", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener")
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading")

    const { unmount } = renderHook(() => usePostLoadExperienceSchedule(true))

    unmount()
    expect(removeEventListener).toHaveBeenCalledWith(
      "load",
      expect.any(Function),
    )
  })

  it("cancels its timers and pending idle callback on unmount", () => {
    const clearTimeout = vi.spyOn(window, "clearTimeout")
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete")
    const { unmount } = renderHook(() => usePostLoadExperienceSchedule(true))

    act(() => vi.advanceTimersByTime(RIVE_START_DELAY_MILLISECONDS))
    unmount()

    expect(clearTimeout).toHaveBeenCalledTimes(3)
    expect(cancelIdleCallbackMock).toHaveBeenCalledWith(RIVE_IDLE_CALLBACK_ID)
  })
})
