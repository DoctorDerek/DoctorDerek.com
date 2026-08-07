import { act, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CountUp from "@/components/ui/CountUp"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

const observedElements: Element[] = []
const animationFrames: FrameRequestCallback[] = []
let intersectionCallback: IntersectionObserverCallback

const observe = vi.fn((element: Element) => observedElements.push(element))
const disconnect = vi.fn()
const cancelAnimationFrame = vi.fn()
const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  animationFrames.push(callback)
  return animationFrames.length
})

const reportIntersection = (isIntersecting: boolean) =>
  act(() =>
    intersectionCallback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  )

const runNextAnimationFrame = (timestamp: number) =>
  act(() => animationFrames.shift()?.(timestamp))

describe("CountUp", () => {
  beforeEach(() => {
    animationFrames.length = 0
    observedElements.length = 0
    reducedMotionPreference.value = false
    vi.clearAllMocks()
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersectionCallback = callback
        }

        observe = observe
        disconnect = disconnect
      },
    )
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame)
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame)
  })

  it("counts with grouped ease-out values after entering the viewport", () => {
    const { unmount } = render(<CountUp to={2000} />)

    expect(screen.getByText("0")).toHaveClass("inline-block")
    expect(observe).toHaveBeenCalledWith(screen.getByText("0"))

    reportIntersection(true)
    expect(disconnect).toHaveBeenCalledOnce()

    runNextAnimationFrame(1_000)
    expect(screen.getByText("0")).toBeInTheDocument()

    runNextAnimationFrame(2_000)
    expect(screen.getByText("1,750")).toBeInTheDocument()

    runNextAnimationFrame(3_000)
    expect(screen.getByText("2,000")).toBeInTheDocument()

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })

  it("keeps an ungrouped starting value static before visibility", () => {
    render(
      <CountUp
        to={2000}
        from={1234.4}
        duration={3}
        useGrouping={false}
        className="metric"
      />,
    )

    reportIntersection(false)

    expect(screen.getByText("1234")).toHaveClass("inline-block", "metric")
    expect(requestAnimationFrame).not.toHaveBeenCalled()
    expect(disconnect).not.toHaveBeenCalled()
  })

  it("renders the final value without observing when motion is reduced", () => {
    reducedMotionPreference.value = true

    render(<CountUp to={2000} />)

    expect(screen.getByText("2,000")).toHaveClass("inline-block")
    expect(observe).not.toHaveBeenCalled()
    expect(requestAnimationFrame).not.toHaveBeenCalled()
  })

  it("completes a zero-duration count on its first animation frame", () => {
    render(<CountUp to={20} duration={0} />)

    reportIntersection(true)
    runNextAnimationFrame(1_000)

    expect(screen.getByText("20")).toBeInTheDocument()
  })
})
