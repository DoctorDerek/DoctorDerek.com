import { fireEvent, render, screen } from "@testing-library/react"
import type { CSSProperties } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import EndOfSiteCelebration from "@/components/EndOfSiteCelebration"

type ConfettiProperties = {
  "aria-hidden"?: boolean | "false" | "true"
  className?: string
  colors?: string[]
  height?: number
  numberOfPieces?: number
  onConfettiComplete?: () => void
  recycle?: boolean
  style?: CSSProperties
  width?: number
}

const { captureConfettiProperties } = vi.hoisted(() => ({
  captureConfettiProperties: vi.fn(),
}))

vi.mock("react-confetti", () => ({
  default: (properties: ConfettiProperties) => {
    captureConfettiProperties(properties)
    return (
      <button type="button" onClick={properties.onConfettiComplete}>
        Complete confetti animation
      </button>
    )
  },
}))

describe("EndOfSiteCelebration", () => {
  beforeEach(() => {
    captureConfettiProperties.mockClear()
    window.innerWidth = 1280
    window.innerHeight = 720
  })

  it("mounts finite decorative confetti only while the reward is active", () => {
    const onConfettiComplete = vi.fn()
    const { rerender } = render(
      <EndOfSiteCelebration
        isConfettiActive={false}
        onConfettiComplete={onConfettiComplete}
      />,
    )

    expect(
      screen.queryByRole("button", { name: "Complete confetti animation" }),
    ).not.toBeInTheDocument()

    rerender(
      <EndOfSiteCelebration
        isConfettiActive={true}
        onConfettiComplete={onConfettiComplete}
      />,
    )

    expect(captureConfettiProperties).toHaveBeenLastCalledWith(
      expect.objectContaining({
        "aria-hidden": "true",
        className: "end-of-site-confetti",
        height: 720,
        numberOfPieces: 240,
        recycle: false,
        width: 1280,
      }),
    )

    fireEvent.click(
      screen.getByRole("button", { name: "Complete confetti animation" }),
    )
    expect(onConfettiComplete).toHaveBeenCalledOnce()
  })

  it("resizes the active celebration with the browser viewport", () => {
    render(
      <EndOfSiteCelebration
        isConfettiActive={true}
        onConfettiComplete={vi.fn()}
      />,
    )

    window.innerWidth = 834
    window.innerHeight = 1112
    fireEvent(window, new Event("resize"))

    expect(captureConfettiProperties).toHaveBeenLastCalledWith(
      expect.objectContaining({ height: 1112, width: 834 }),
    )
  })
})
