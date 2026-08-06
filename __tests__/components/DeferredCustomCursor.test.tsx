import { act, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import DeferredCustomCursor from "@/components/ui/DeferredCustomCursor"
import { CUSTOM_CURSOR_IDLE_CALLBACK_TIMEOUT_MILLISECONDS } from "@/constants/STARTUP_TIMING"

const { cursorMediaQuery } = vi.hoisted(() => ({
  cursorMediaQuery: {
    listeners: new Set<() => void>(),
    matches: false,
  },
}))

let scheduledIdleCallback: IdleRequestCallback | undefined
let scheduledAnimationFrame: FrameRequestCallback | undefined

vi.mock("next/dynamic", () => ({
  default: () => () => <p>Custom cursor runtime</p>,
}))

describe("DeferredCustomCursor", () => {
  beforeEach(() => {
    cursorMediaQuery.listeners.clear()
    cursorMediaQuery.matches = false
    scheduledIdleCallback = undefined
    scheduledAnimationFrame = undefined
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: cursorMediaQuery.matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (
        _event: string,
        listener: EventListenerOrEventListenerObject,
      ) => cursorMediaQuery.listeners.add(listener as () => void),
      removeEventListener: (
        _event: string,
        listener: EventListenerOrEventListenerObject,
      ) => cursorMediaQuery.listeners.delete(listener as () => void),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("renders no cursor markup on the server or touch-only devices", () => {
    expect(renderToString(<DeferredCustomCursor shouldLoad />)).toBe("")

    render(<DeferredCustomCursor shouldLoad />)

    expect(screen.queryByText("Custom cursor runtime")).not.toBeInTheDocument()
  })

  it("loads the fine-pointer runtime only after browser idle", () => {
    cursorMediaQuery.matches = true
    const cancelIdleCallback = vi.fn()
    const requestIdleCallback = vi.fn(
      (callback: IdleRequestCallback): number => {
        scheduledIdleCallback = callback
        return 17
      },
    )
    vi.stubGlobal("requestIdleCallback", requestIdleCallback)
    vi.stubGlobal("cancelIdleCallback", cancelIdleCallback)

    const { rerender, unmount } = render(
      <DeferredCustomCursor shouldLoad={false} />,
    )
    expect(requestIdleCallback).not.toHaveBeenCalled()

    rerender(<DeferredCustomCursor shouldLoad />)
    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), {
      timeout: CUSTOM_CURSOR_IDLE_CALLBACK_TIMEOUT_MILLISECONDS,
    })
    expect(screen.queryByText("Custom cursor runtime")).not.toBeInTheDocument()

    act(() =>
      scheduledIdleCallback?.({
        didTimeout: false,
        timeRemaining: () => 50,
      }),
    )
    expect(screen.getByText("Custom cursor runtime")).toBeInTheDocument()

    unmount()
    expect(cancelIdleCallback).toHaveBeenCalledWith(17)
  })

  it("falls back to the next frame when idle callbacks are unavailable", () => {
    cursorMediaQuery.matches = true
    const cancelAnimationFrame = vi.fn()
    vi.stubGlobal("requestIdleCallback", undefined)
    vi.stubGlobal("cancelIdleCallback", undefined)
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        scheduledAnimationFrame = callback
        return 23
      }),
    )
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame)

    const { unmount } = render(<DeferredCustomCursor shouldLoad />)
    act(() => scheduledAnimationFrame?.(0))
    expect(screen.getByText("Custom cursor runtime")).toBeInTheDocument()

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(23)
  })
})
