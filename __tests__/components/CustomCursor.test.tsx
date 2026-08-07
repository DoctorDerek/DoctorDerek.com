import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CustomCursor from "@/components/ui/CustomCursor"

const { animationFeaturesLoaded, motionValues } = vi.hoisted(() => ({
  animationFeaturesLoaded: vi.fn(),
  motionValues: {
    callCount: 0,
    x: { set: vi.fn() },
    y: { set: vi.fn() },
  },
}))

vi.mock("@/utils/domAnimationFeatures", () => ({
  default: "dom-animation-features",
}))

vi.mock("motion/react", () => ({
  LazyMotion: ({
    children,
    features,
  }: {
    children: React.ReactNode
    features: () => Promise<unknown>
  }) => {
    void features().then(animationFeaturesLoaded)
    return children
  },
  useMotionValue: () => {
    const motionValue =
      motionValues.callCount % 2 === 0 ? motionValues.x : motionValues.y
    motionValues.callCount += 1
    return motionValue
  },
  useSpring: (motionValue: unknown) => motionValue,
}))

vi.mock("motion/react-m", () => ({
  div: ({
    className,
    style,
  }: {
    className: string
    style: { opacity: number }
  }) => (
    <div
      className={className}
      data-opacity={style.opacity}
      data-testid="custom-cursor"
    />
  ),
}))

describe("CustomCursor", () => {
  beforeEach(() => {
    motionValues.callCount = 0
    vi.clearAllMocks()
  })

  it("loads its local animation runtime and tracks pointer movement", async () => {
    render(<CustomCursor />)

    await vi.waitFor(() =>
      expect(animationFeaturesLoaded).toHaveBeenCalledWith(
        "dom-animation-features",
      ),
    )

    expect(screen.getByTestId("custom-cursor")).toHaveAttribute(
      "data-opacity",
      "0",
    )
    fireEvent.mouseMove(window, { clientX: 50, clientY: 60 })
    expect(motionValues.x.set).toHaveBeenCalledWith(34)
    expect(motionValues.y.set).toHaveBeenCalledWith(44)
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute(
      "data-opacity",
      "0.8",
    )
    fireEvent.mouseLeave(document)
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute(
      "data-opacity",
      "0",
    )
    fireEvent.mouseEnter(document)
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute(
      "data-opacity",
      "0.8",
    )
  })
})
