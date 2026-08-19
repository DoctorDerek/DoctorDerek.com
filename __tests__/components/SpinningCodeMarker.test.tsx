import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import SpinningCodeMarker from "@/components/ui/SpinningCodeMarker"
import {
  CODE_MARKER_ACTIVATION_ROTATION_DEGREES,
  getCareerCodeMarkerAccessibleName,
  SPRING_ROTATION_PRELOAD_DEGREES,
} from "@/constants/INTERACTIONS"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

vi.mock("@/images/codeIcon.svg", () => ({
  default: () => <svg data-testid="code-marker-glyph" />,
}))

const markerAccessibleName = getCareerCodeMarkerAccessibleName(
  ARCHITECT_EVOLUTION[0]!.duration,
)

describe("SpinningCodeMarker", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("preserves its floating layer and rotates forward on every activation", () => {
    render(
      <SpinningCodeMarker
        accessibleName={markerAccessibleName}
        animationDelay="0.4s"
      />,
    )

    const control = screen.getByRole("button", {
      name: markerAccessibleName,
    })
    const floatingLayer = control.closest(".animate-float")
    const rotationLayer = control.querySelector(
      ".flip-preview-visual > .ease-spring-rotation",
    )

    expect(control).toHaveClass("h-11", "w-11")
    expect(floatingLayer).toHaveClass("h-11", "w-11")
    expect(floatingLayer).toHaveStyle({ animationDelay: "0.4s" })
    expect(rotationLayer).toHaveClass("duration-[900ms]")
    expect(rotationLayer).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.pointerEnter(control, { pointerType: "mouse" })
    expect(control.querySelector(".flip-preview-visual")).toHaveStyle({
      transform: `rotateY(${SPRING_ROTATION_PRELOAD_DEGREES}deg)`,
    })

    fireEvent.pointerLeave(control)
    expect(control.querySelector(".flip-preview-visual")).toHaveStyle({
      transform: "rotateY(0deg)",
    })

    fireEvent.click(control)
    expect(rotationLayer).toHaveStyle({
      transform: `rotateY(${CODE_MARKER_ACTIVATION_ROTATION_DEGREES}deg)`,
    })

    fireEvent.click(control)
    expect(rotationLayer).toHaveStyle({
      transform: `rotateY(${CODE_MARKER_ACTIVATION_ROTATION_DEGREES * 2}deg)`,
    })
  })

  it("removes the control when its carousel slide is inactive", () => {
    render(
      <SpinningCodeMarker
        accessibleName={markerAccessibleName}
        animationDelay="0s"
        isInteractive={false}
      />,
    )

    expect(
      screen.queryByRole("button", { name: markerAccessibleName }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByTestId("code-marker-glyph").parentElement,
    ).toHaveAttribute("aria-hidden", "true")
  })

  it("becomes decorative when reduced motion is requested", () => {
    reducedMotionPreference.value = true

    render(
      <SpinningCodeMarker
        accessibleName={markerAccessibleName}
        animationDelay="0s"
      />,
    )

    expect(
      screen.queryByRole("button", { name: markerAccessibleName }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByTestId("code-marker-glyph").parentElement,
    ).toHaveAttribute("aria-hidden", "true")
  })
})
