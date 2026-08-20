import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import FlipPreview from "@/components/ui/FlipPreview"
import { SPRING_ROTATION_PRELOAD_DEGREES } from "@/constants/INTERACTIONS"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

const springPreloadTransform = `rotateY(${SPRING_ROTATION_PRELOAD_DEGREES}deg)`

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

describe("FlipPreview", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("renders an accessible pressed button with a CSS spring interaction", () => {
    render(
      <FlipPreview
        accessibleName="Flip portrait"
        isPressed
        onActivate={vi.fn()}
      >
        Portrait
      </FlipPreview>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })

    expect(control).toHaveAttribute("aria-pressed", "true")
    expect(control).toHaveClass("flip-preview-control")
    expect(control.parentElement).toHaveClass("perspective")
    expect(control.parentElement).toHaveStyle({ perspective: "1000px" })
    const preview = control.querySelector(".flip-preview-visual")
    expect(preview).toHaveClass(
      "pointer-events-none",
      "transition-transform",
      "ease-spring-rotation",
      "duration-[700ms]",
    )
    expect(preview).toHaveStyle({ transform: "rotateY(0deg)" })
    expect(control).toHaveClass("active:scale-[0.97]")
  })

  it("previews for mouse and keyboard focus, then resets on exit", () => {
    render(
      <FlipPreview accessibleName="Flip portrait" onActivate={vi.fn()}>
        Portrait
      </FlipPreview>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })
    const preview = control.querySelector(".flip-preview-visual")

    fireEvent.pointerEnter(control, { pointerType: "mouse" })
    expect(preview).toHaveStyle({ transform: springPreloadTransform })

    fireEvent.pointerLeave(control)
    expect(preview).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.focus(control)
    expect(preview).toHaveStyle({ transform: springPreloadTransform })

    fireEvent.blur(control)
    expect(preview).toHaveStyle({ transform: "rotateY(0deg)" })
  })

  it("does not synthesize a hover preview for touch input", () => {
    render(
      <FlipPreview accessibleName="Flip portrait" onActivate={vi.fn()}>
        Portrait
      </FlipPreview>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })

    fireEvent.pointerEnter(control, { pointerType: "touch" })

    expect(control.querySelector(".flip-preview-visual")).toHaveStyle({
      transform: "rotateY(0deg)",
    })
  })

  it("contains pointer starts without blocking the public action", () => {
    const onActivate = vi.fn()
    const onParentPointerDown = vi.fn()

    render(
      <div onPointerDown={onParentPointerDown}>
        <FlipPreview accessibleName="Flip portrait" onActivate={onActivate}>
          Portrait
        </FlipPreview>
      </div>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })

    fireEvent.pointerDown(control)
    fireEvent.click(control)

    expect(onParentPointerDown).not.toHaveBeenCalled()
    expect(onActivate).toHaveBeenCalledOnce()
  })

  it("clears the preview before activating the public action", () => {
    const onActivate = vi.fn()
    render(
      <FlipPreview accessibleName="Flip portrait" onActivate={onActivate}>
        Portrait
      </FlipPreview>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })

    fireEvent.pointerEnter(control, { pointerType: "mouse" })
    fireEvent.pointerCancel(control)
    fireEvent.pointerEnter(control, { pointerType: "mouse" })
    fireEvent.click(control)

    expect(onActivate).toHaveBeenCalledOnce()
    expect(control.querySelector(".flip-preview-visual")).toHaveStyle({
      transform: "rotateY(0deg)",
    })
  })

  it("keeps preview and tap transforms instantaneous when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(
      <FlipPreview accessibleName="Flip portrait" onActivate={vi.fn()}>
        Portrait
      </FlipPreview>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })

    fireEvent.focus(control)

    expect(control.querySelector(".flip-preview-visual")).toHaveStyle({
      transform: "rotateY(0deg)",
    })
    expect(control).toHaveClass(
      "motion-reduce:transition-none",
      "motion-reduce:active:scale-100",
    )
  })
})
