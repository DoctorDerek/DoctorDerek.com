import { act, fireEvent, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CONTACT_COMPLETION } from "@/constants/CONTACT_COMPLETION"
import useEndOfSiteCelebration from "@/hooks/useEndOfSiteCelebration"
import type { FullPageApi, FullPageSection } from "@/types/MapacheFullPageProps"

const { toast } = vi.hoisted(() => ({ toast: vi.fn() }))

vi.mock("react-hot-toast", () => ({ toast }))

const createTouchList = (clientY: number | null) => {
  const touches = clientY === null ? [] : ([{ clientY } as Touch] as Touch[])
  return Object.assign(touches, {
    item: (index: number) => touches[index] ?? null,
  }) satisfies TouchList
}

const fireTouch = (
  target: HTMLElement,
  eventName: "touchstart" | "touchend",
  clientY: number | null,
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

  it("celebrates only deliberate downward intent at the active Contact boundary", async () => {
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
    const fullPageConsumedWheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      deltaY: 120,
    })
    fullPageConsumedWheelEvent.preventDefault()
    fireEvent(scrollContainer, fullPageConsumedWheelEvent)

    await waitFor(() => expect(toast).toHaveBeenCalledOnce())
    expect(toast).toHaveBeenCalledWith(CONTACT_COMPLETION.toastMessage, {
      ariaProps: { "aria-live": "polite", role: "status" },
      id: "end-of-doctorderek",
      style: { textAlign: "center", whiteSpace: "pre-line" },
    })
    expect(result.current.isConfettiActive).toBe(true)

    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).toHaveBeenCalledOnce()
  })

  it("supports keyboard intent while ignoring form controls", async () => {
    const { fullPageApiReference, scrollContainer } = createContactBoundary()
    scrollContainer.scrollTop = 600
    const input = document.createElement("input")
    const contentEditable = document.createElement("div")
    Object.defineProperty(contentEditable, "isContentEditable", { value: true })
    scrollContainer.append(input)
    scrollContainer.append(contentEditable)
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, false),
    )

    act(() => result.current.beginContactVisit())
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(contentEditable, { key: "PageDown" })
    fireEvent.keyDown(window, { key: "End" })
    expect(toast).not.toHaveBeenCalled()

    fireEvent.keyDown(window, { key: "PageDown" })
    await waitFor(() => expect(toast).toHaveBeenCalledOnce())
  })

  it("recognizes an upward touch gesture without reacting below its threshold", async () => {
    const { fullPageApiReference, scrollContainer } = createContactBoundary()
    scrollContainer.scrollTop = 600
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, false),
    )

    act(() => result.current.beginContactVisit())
    fireTouch(scrollContainer, "touchstart", null)
    fireTouch(scrollContainer, "touchend", 60)
    expect(toast).not.toHaveBeenCalled()

    fireTouch(scrollContainer, "touchstart", 100)
    fireTouch(scrollContainer, "touchend", 80)
    expect(toast).not.toHaveBeenCalled()

    fireTouch(scrollContainer, "touchstart", 100)
    fireTouch(scrollContainer, "touchend", 60)
    await waitFor(() => expect(toast).toHaveBeenCalledOnce())
  })

  it("rearms after each completed burst and cancels abandoned confetti", async () => {
    const { fullPageApiReference, scrollContainer } = createContactBoundary()
    scrollContainer.scrollTop = 600
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, false),
    )

    act(() => result.current.beginContactVisit())
    expect(result.current.shouldRenderCelebrationRuntime).toBe(true)
    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    await waitFor(() => expect(toast).toHaveBeenCalledOnce())
    expect(result.current.isConfettiActive).toBe(true)

    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).toHaveBeenCalledOnce()

    act(() => result.current.completeConfetti())
    expect(result.current.isConfettiActive).toBe(false)
    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    await waitFor(() => expect(toast).toHaveBeenCalledTimes(2))
    expect(result.current.isConfettiActive).toBe(true)

    act(() => result.current.endContactVisit())
    act(() => result.current.beginContactVisit())
    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    await waitFor(() => expect(toast).toHaveBeenCalledTimes(3))
    expect(result.current.isConfettiActive).toBe(true)

    act(() => result.current.endContactVisit())
    expect(result.current.isConfettiActive).toBe(false)
  })

  it("keeps the accessible toast while suppressing reduced-motion confetti", async () => {
    const { fullPageApiReference, scrollContainer } = createContactBoundary()
    scrollContainer.scrollTop = 600
    const { result } = renderHook(() =>
      useEndOfSiteCelebration(fullPageApiReference, true),
    )

    act(() => result.current.beginContactVisit())
    fireEvent.wheel(scrollContainer, { deltaY: 120 })

    await waitFor(() => expect(toast).toHaveBeenCalledOnce())
    expect(result.current.isConfettiActive).toBe(false)

    fireEvent.wheel(scrollContainer, { deltaY: 120 })
    expect(toast).toHaveBeenCalledOnce()

    act(() => result.current.endContactVisit())
    act(() => result.current.beginContactVisit())
    fireEvent.wheel(scrollContainer, { deltaY: 120 })

    await waitFor(() => expect(toast).toHaveBeenCalledTimes(2))
    expect(result.current.isConfettiActive).toBe(false)
  })
})
