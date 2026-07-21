import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CountUp from "@/components/ui/CountUp"

const { animateMock, reducedMotionPreference, stopMock, useInViewMock } =
  vi.hoisted(() => ({
    animateMock: vi.fn(),
    reducedMotionPreference: { value: false },
    stopMock: vi.fn(),
    useInViewMock: vi.fn(),
  }))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    motionPreference: reducedMotionPreference.value ? "reduce" : "full",
    setMotionPreference: vi.fn(),
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

vi.mock("motion/react", () => ({
  animate: animateMock,
  motion: { span: "span" },
  useInView: useInViewMock,
  useMotionValue: (initialValue: number) => initialValue,
  useTransform: (
    motionValue: number,
    transformValue: (latestValue: number) => string,
  ) => transformValue(motionValue),
}))

describe("CountUp", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    animateMock.mockReturnValue({ stop: stopMock })
    reducedMotionPreference.value = false
    useInViewMock.mockReturnValue(true)
  })

  it("animates from the grouped default value and stops on unmount", () => {
    const { unmount } = render(<CountUp to={2000} />)

    expect(screen.getByText("0")).toHaveClass("inline-block")
    expect(animateMock).toHaveBeenCalledWith(0, 2000, {
      duration: 2,
      ease: "easeOut",
    })

    unmount()
    expect(stopMock).toHaveBeenCalledOnce()
  })

  it("renders an ungrouped starting value without animating before visibility", () => {
    useInViewMock.mockReturnValue(false)

    render(
      <CountUp
        to={2000}
        from={1234.4}
        duration={3}
        useGrouping={false}
        className="metric"
      />,
    )

    expect(screen.getByText("1234")).toHaveClass("inline-block", "metric")
    expect(animateMock).not.toHaveBeenCalled()
  })

  it("renders the final value without animating when motion is reduced", () => {
    reducedMotionPreference.value = true

    render(<CountUp to={2000} />)

    expect(screen.getByText("2,000")).toHaveClass("inline-block")
    expect(animateMock).not.toHaveBeenCalled()
  })
})
