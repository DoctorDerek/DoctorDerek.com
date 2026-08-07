import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CustomCursor from "@/components/ui/CustomCursor"

const { motionValues } = vi.hoisted(() => ({
  motionValues: {
    callCount: 0,
    x: { set: vi.fn() },
    y: { set: vi.fn() },
  },
}))

vi.mock("motion/react", () => ({
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

  it("tracks pointer movement after its eligibility gate mounts", () => {
    render(<CustomCursor />)

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
