import { act, fireEvent, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CONTACT_COMPLETION } from "@/constants/SITE_CONTENT"
import useEndOfSiteCelebration from "@/hooks/useEndOfSiteCelebration"
import type { FullPageApi, FullPageSection } from "@/types/MapacheFullPageProps"

const { toast } = vi.hoisted(() => ({ toast: vi.fn() }))

vi.mock("react-hot-toast", () => ({ toast }))

const createTouchList = (clientY: number) => {
  const touch = { clientY } as Touch
  const touches = [touch]
  return Object.assign(touches, {
    item: (index: number) => touches[index] ?? null,
  }) satisfies TouchList
}

const fireTouch = (
  target: HTMLElement,
  eventName: "touchstart" | "touchend",
  clientY: number,
) => {
  const event = new Event(eventName, { bubbles: true })
  Object.defineProperty(
    event,
    eventName === "touchstart" ? "touches" : "changedTouches",
    {
      value: createTouchList(clientY),
    },
  )
  fireEvent(target, event)
}

const createContactBoundary = () => {
  const activeSectionElement = document.createElement("section")
  const scrollContainer = document.createElement("div")
  scrollContainer.className = "fp-overflow"
  activeSectionElement.append(scrollContainer)
  document.body.append(activeSectionElement)

  Object.defineProperties(scrollContainer, {
    clientHeight: { configurable: true, value: 400 },
    scrollHeight: { configurable: true, value: 1000 },
    scrollTop: { configurable: true, value: 0, writable: true },
  })

  const activeSection: FullPageSection = {
    anchor: "contact",
    index: 8,
    isFirst: false,
    isLast: true,
    item: activeSectionElement,
  }
  const fullPageApiReference = {
    current: {
      getActiveSection: () => activeSection,
    } as FullPageApi,
  }

  return { activeSection, fullPageApiReference, scrollContainer }
}

describe("useEndOfSiteCelebration", () => {
  beforeEach(() => toast.mockClear())

  afterEach(() => document.body.replaceChildren())

  it("celebrates only deliberate downward intent at the active Contact boundary", () => {
    const { activeSection, fullPageApiReference, scrollContainer } =
      createContactBoundary()
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, false),
    )

    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).not.toHaveBeenCalled()

    act(() => result.current.beginContactVisit())
    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).not.toHaveBeenCalled()

    scrollContainer.scrollTop = 600
    fireEvent.wheel(scrollContainer, { deltaY: -120 })
    expect(toast).not.toHaveBeenCalled()

    activeSection.anchor = "blog"
    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).not.toHaveBeenCalled()

    activeSection.anchor = "contact"
    fireEvent.wheel(scrollContainer, { deltaY: 120 })

    expect(toast).toHaveBeenCalledOnce()
    expect(toast).toHaveBeenCalledWith(CONTACT_COMPLETION.message, {
      ariaProps: { "aria-live": "polite", role: "status" },
      id: "end-of-doctorderek",
    })
    expect(result.current.isConfettiActive).toBe(true)

    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).toHaveBeenCalledOnce()
  })

  it("supports keyboard intent while ignoring form controls", () => {
    const { fullPageApiReference, scrollContainer } = createContactBoundary()
    scrollContainer.scrollTop = 600
    const input = document.createElement("input")
    scrollContainer.append(input)
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, false),
    )

    act(() => result.current.beginContactVisit())
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(window, { key: "End" })
    expect(toast).not.toHaveBeenCalled()

    fireEvent.keyDown(window, { key: "PageDown" })
    expect(toast).toHaveBeenCalledOnce()
  })

  it("recognizes an upward touch gesture without reacting below its threshold", () => {
    const { fullPageApiReference, scrollContainer } = createContactBoundary()
    scrollContainer.scrollTop = 600
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, false),
    )

    act(() => result.current.beginContactVisit())
    fireTouch(scrollContainer, "touchstart", 100)
    fireTouch(scrollContainer, "touchend", 80)
    expect(toast).not.toHaveBeenCalled()

    fireTouch(scrollContainer, "touchstart", 100)
    fireTouch(scrollContainer, "touchend", 60)
    expect(toast).toHaveBeenCalledOnce()
  })

  it("rearms per Contact visit and cancels completed or abandoned confetti", () => {
    const { fullPageApiReference, scrollContainer } = createContactBoundary()
    scrollContainer.scrollTop = 600
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, false),
    )

    act(() => result.current.beginContactVisit())
    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(result.current.isConfettiActive).toBe(true)

    act(() => result.current.completeConfetti())
    expect(result.current.isConfettiActive).toBe(false)
    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).toHaveBeenCalledOnce()

    act(() => result.current.endContactVisit())
    act(() => result.current.beginContactVisit())
    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).toHaveBeenCalledTimes(2)
    expect(result.current.isConfettiActive).toBe(true)

    act(() => result.current.endContactVisit())
    expect(result.current.isConfettiActive).toBe(false)
  })

  it("keeps the accessible toast while suppressing reduced-motion confetti", () => {
    const { fullPageApiReference, scrollContainer } = createContactBoundary()
    scrollContainer.scrollTop = 600
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, true),
    )

    act(() => result.current.beginContactVisit())
    fireEvent.wheel(scrollContainer, { deltaY: 120 })

    expect(toast).toHaveBeenCalledOnce()
    expect(result.current.isConfettiActive).toBe(false)
  })
})
