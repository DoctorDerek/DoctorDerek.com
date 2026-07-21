import { act, renderHook } from "@testing-library/react"
import { createRef } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import useHorizontalWheelNavigation from "@/hooks/useHorizontalWheelNavigation"
import type { FullPageApi } from "@/types/MapacheFullPageProps"

const createWheelEvent = ({
  ctrlKey = false,
  deltaX,
  deltaY,
  timeStamp,
}: {
  ctrlKey?: boolean
  deltaX: number
  deltaY: number
  timeStamp: number
}) => {
  const wheelEvent = new WheelEvent("wheel", {
    bubbles: true,
    cancelable: true,
    ctrlKey,
    deltaX,
    deltaY,
  })
  Object.defineProperty(wheelEvent, "ctrlKey", { value: ctrlKey })
  Object.defineProperty(wheelEvent, "timeStamp", { value: timeStamp })
  return wheelEvent
}

describe("useHorizontalWheelNavigation", () => {
  const activeSection = document.createElement("section")
  const moveSlideLeft = vi.fn()
  const moveSlideRight = vi.fn()
  const fullPageApiReference = createRef<FullPageApi | null>()

  beforeEach(() => {
    activeSection.replaceChildren(
      document.createElement("div"),
      document.createElement("div"),
    )
    for (const slide of activeSection.children) slide.className = "slide"
    moveSlideLeft.mockClear()
    moveSlideRight.mockClear()
    fullPageApiReference.current = {
      getActiveSection: () => ({ item: activeSection }),
      moveSlideLeft,
      moveSlideRight,
    } as FullPageApi
  })

  it("navigates dominant horizontal intent in each direction", () => {
    renderHook(() => useHorizontalWheelNavigation(fullPageApiReference))

    act(() => {
      window.dispatchEvent(
        createWheelEvent({ deltaX: 20, deltaY: 2, timeStamp: 1000 }),
      )
      window.dispatchEvent(
        createWheelEvent({ deltaX: -20, deltaY: 2, timeStamp: 1700 }),
      )
    })

    expect(moveSlideRight).toHaveBeenCalledOnce()
    expect(moveSlideLeft).toHaveBeenCalledOnce()
  })

  it("ignores vertical, tiny, zoom, prevented, and throttled gestures", () => {
    renderHook(() => useHorizontalWheelNavigation(fullPageApiReference))

    const preventedWheelEvent = createWheelEvent({
      deltaX: 20,
      deltaY: 0,
      timeStamp: 1800,
    })
    preventedWheelEvent.preventDefault()

    act(() => {
      window.dispatchEvent(
        createWheelEvent({ deltaX: 2, deltaY: 20, timeStamp: 1000 }),
      )
    })
    expect(moveSlideRight).not.toHaveBeenCalled()

    act(() => {
      window.dispatchEvent(
        createWheelEvent({ deltaX: 7, deltaY: 0, timeStamp: 1100 }),
      )
    })
    expect(moveSlideRight).not.toHaveBeenCalled()

    act(() => {
      window.dispatchEvent(
        createWheelEvent({
          ctrlKey: true,
          deltaX: 20,
          deltaY: 0,
          timeStamp: 1200,
        }),
      )
    })
    expect(moveSlideRight).not.toHaveBeenCalled()

    act(() => {
      window.dispatchEvent(preventedWheelEvent)
    })
    expect(moveSlideRight).not.toHaveBeenCalled()

    act(() => {
      window.dispatchEvent(
        createWheelEvent({ deltaX: 20, deltaY: 0, timeStamp: 2000 }),
      )
      window.dispatchEvent(
        createWheelEvent({ deltaX: 20, deltaY: 0, timeStamp: 2100 }),
      )
    })

    expect(moveSlideRight).toHaveBeenCalledOnce()
    expect(moveSlideLeft).not.toHaveBeenCalled()
  })

  it("ignores nested scrolling, single-slide sections, and missing APIs", () => {
    const { unmount } = renderHook(() =>
      useHorizontalWheelNavigation(fullPageApiReference),
    )
    const nestedScroller = document.createElement("div")
    nestedScroller.className = "scrollable-content"
    document.body.append(nestedScroller)

    act(() => {
      nestedScroller.dispatchEvent(
        createWheelEvent({ deltaX: 20, deltaY: 0, timeStamp: 1000 }),
      )
    })

    activeSection.lastElementChild?.remove()
    act(() => {
      window.dispatchEvent(
        createWheelEvent({ deltaX: 20, deltaY: 0, timeStamp: 1700 }),
      )
    })

    fullPageApiReference.current = null
    act(() => {
      window.dispatchEvent(
        createWheelEvent({ deltaX: 20, deltaY: 0, timeStamp: 2400 }),
      )
    })

    unmount()
    nestedScroller.remove()
    fullPageApiReference.current = {
      moveSlideRight,
    } as FullPageApi
    window.dispatchEvent(
      createWheelEvent({ deltaX: 20, deltaY: 0, timeStamp: 3100 }),
    )

    expect(moveSlideRight).not.toHaveBeenCalled()
    expect(moveSlideLeft).not.toHaveBeenCalled()
  })
})
