import { fireEvent, render, screen } from "@testing-library/react"
import { type ComponentProps } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import FlipPreview from "@/components/ui/FlipPreview"

const { animationProperties, reducedMotionPreference } = vi.hoisted(() => ({
  animationProperties: vi.fn(),
  reducedMotionPreference: { value: false },
}))

type MotionButtonProps = ComponentProps<"button"> & {
  animate: { rotateY: number }
  transition: unknown
  whileTap?: { scale: number }
}

vi.mock("motion/react", () => ({
  motion: {
    button: ({
      animate,
      transition,
      whileTap,
      ...buttonProps
    }: MotionButtonProps) => {
      animationProperties({ animate, transition, whileTap })
      return <button {...buttonProps} />
    },
  },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

const getLatestAnimationProperties = () =>
  animationProperties.mock.calls.at(-1)?.[0] as {
    animate: { rotateY: number }
    transition: {
      duration?: number
      type?: string
    }
    whileTap?: { scale: number }
  }

describe("FlipPreview", () => {
  beforeEach(() => {
    animationProperties.mockClear()
    reducedMotionPreference.value = false
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
    expect(control.parentElement).toHaveClass("perspective")
    expect(control.parentElement).toHaveStyle({ perspective: "1000px" })
    expect(getLatestAnimationProperties()).toMatchObject({
      animate: { rotateY: 0 },
      transition: { type: "spring" },
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
    expect(getLatestAnimationProperties().animate.rotateY).toBe(-12)

    fireEvent.pointerLeave(control)
    expect(getLatestAnimationProperties().animate.rotateY).toBe(0)

    fireEvent.focus(control)
    expect(getLatestAnimationProperties().animate.rotateY).toBe(-12)

    fireEvent.blur(control)
    expect(getLatestAnimationProperties().animate.rotateY).toBe(0)
  })

  it("does not synthesize a hover preview for touch input", () => {
    render(
      <FlipPreview accessibleName="Flip portrait" onActivate={vi.fn()}>
        Portrait
      </FlipPreview>,
    )

    const control = screen.getByRole("button", { name: "Flip portrait" })

    fireEvent.pointerEnter(control, { pointerType: "touch" })

    expect(getLatestAnimationProperties().animate.rotateY).toBe(0)
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
    expect(getLatestAnimationProperties().animate.rotateY).toBe(0)
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

    expect(getLatestAnimationProperties()).toMatchObject({
      animate: { rotateY: 0 },
      transition: { duration: 0 },
    })
    expect(getLatestAnimationProperties().whileTap).toBeUndefined()
  })
})
