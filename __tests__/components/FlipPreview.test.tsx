import { fireEvent, render, screen } from "@testing-library/react"
import { type ComponentProps } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import FlipPreview from "@/components/ui/FlipPreview"

const {
  buttonInteractionProperties,
  reducedMotionPreference,
  visualAnimationProperties,
} = vi.hoisted(() => ({
  buttonInteractionProperties: vi.fn(),
  reducedMotionPreference: { value: false },
  visualAnimationProperties: vi.fn(),
}))

type MotionButtonProps = ComponentProps<"button"> & {
  whileTap?: { scale: number }
}

type MotionDivProps = ComponentProps<"div"> & {
  animate: { rotateY: number }
  transition: unknown
}

vi.mock("motion/react", () => ({
  motion: {
    button: ({ whileTap, ...buttonProps }: MotionButtonProps) => {
      buttonInteractionProperties({ whileTap })
      return <button {...buttonProps} />
    },
    div: ({ animate, transition, ...divProps }: MotionDivProps) => {
      visualAnimationProperties({ animate, transition })
      return <div {...divProps} />
    },
  },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

const getLatestButtonInteractionProperties = () =>
  buttonInteractionProperties.mock.calls.at(-1)?.[0] as {
    whileTap?: { scale: number }
  }

const getLatestVisualAnimationProperties = () =>
  visualAnimationProperties.mock.calls.at(-1)?.[0] as {
    animate: { rotateY: number }
    transition: {
      duration?: number
      type?: string
    }
  }

describe("FlipPreview", () => {
  beforeEach(() => {
    buttonInteractionProperties.mockClear()
    reducedMotionPreference.value = false
    visualAnimationProperties.mockClear()
  })

  it("renders an accessible pressed button with a spring interaction", () => {
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
    expect(control.querySelector(".flip-preview-visual")).toHaveClass(
      "pointer-events-none",
    )
    expect(getLatestVisualAnimationProperties()).toMatchObject({
      animate: { rotateY: 0 },
      transition: { type: "spring" },
    })
    expect(getLatestButtonInteractionProperties()).toMatchObject({
      whileTap: { scale: 0.97 },
    })
  })

  it("previews for mouse and keyboard focus, then resets on exit", () => {
    render(
      <FlipPreview accessibleName="Flip portrait" onActivate={vi.fn()}>
        Portrait
      </FlipPreview>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })

    fireEvent.pointerEnter(control, { pointerType: "mouse" })
    expect(getLatestVisualAnimationProperties().animate.rotateY).toBe(-12)

    fireEvent.pointerLeave(control)
    expect(getLatestVisualAnimationProperties().animate.rotateY).toBe(0)

    fireEvent.focus(control)
    expect(getLatestVisualAnimationProperties().animate.rotateY).toBe(-12)

    fireEvent.blur(control)
    expect(getLatestVisualAnimationProperties().animate.rotateY).toBe(0)
  })

  it("does not synthesize a hover preview for touch input", () => {
    render(
      <FlipPreview accessibleName="Flip portrait" onActivate={vi.fn()}>
        Portrait
      </FlipPreview>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })

    fireEvent.pointerEnter(control, { pointerType: "touch" })

    expect(getLatestVisualAnimationProperties().animate.rotateY).toBe(0)
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
    expect(getLatestVisualAnimationProperties().animate.rotateY).toBe(0)
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

    expect(getLatestVisualAnimationProperties()).toMatchObject({
      animate: { rotateY: 0 },
      transition: { duration: 0 },
    })
    expect(getLatestButtonInteractionProperties().whileTap).toBeUndefined()
  })
})
