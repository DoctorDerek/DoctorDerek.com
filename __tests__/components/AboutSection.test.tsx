import { act, fireEvent, render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import AboutSection from "@/components/AboutSection"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    motionPreference: reducedMotionPreference.value ? "reduce" : "full",
    setMotionPreference: vi.fn(),
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

vi.mock("next/image", () => ({
  default: ({
    fill: _fill,
    priority: _priority,
    quality: _quality,
    ...imageProps
  }: ComponentProps<"img"> & {
    fill?: boolean
    priority?: boolean
    quality?: number
  }) => createElement("img", imageProps),
}))

describe("AboutSection", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("continues the portrait sequence without advancing merely from pointer entry", () => {
    vi.useFakeTimers()
    render(<AboutSection />)

    const portraitControl = screen.getByRole("button", {
      name: "Show next portrait of Dr. Derek Austin",
    })
    const portraitCard = portraitControl.firstElementChild as HTMLElement

    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })

    fireEvent.mouseEnter(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })

    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(360deg)" })

    fireEvent.mouseLeave(portraitControl)
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(360deg)" })
  })

  it("restarts one portrait timer and clears it on unmount", () => {
    vi.useFakeTimers()
    const { unmount } = render(<AboutSection />)
    const portraitControl = screen.getByRole("button", {
      name: "Show next portrait of Dr. Derek Austin",
    })
    const portraitCard = portraitControl.firstElementChild as HTMLElement

    fireEvent.mouseEnter(portraitControl)
    act(() => {
      vi.advanceTimersByTime(750)
    })
    fireEvent.mouseEnter(portraitControl)
    act(() => {
      vi.advanceTimersByTime(750)
    })

    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })

    act(() => {
      vi.advanceTimersByTime(750)
    })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })

    unmount()
  })

  it("leaves and unmounts cleanly before portrait rotation begins", () => {
    vi.useFakeTimers()
    const { unmount } = render(<AboutSection />)
    const portraitControl = screen.getByRole("button", {
      name: "Show next portrait of Dr. Derek Austin",
    })

    fireEvent.mouseLeave(portraitControl)
    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })

  it("keeps portrait changes user-driven and instantaneous when motion is reduced", () => {
    vi.useFakeTimers()
    reducedMotionPreference.value = true
    render(<AboutSection />)
    const portraitControl = screen.getByRole("button", {
      name: "Show next portrait of Dr. Derek Austin",
    })
    const portraitCard = portraitControl.firstElementChild as HTMLElement

    expect(portraitCard).toHaveStyle({ transition: "none" })

    fireEvent.mouseEnter(portraitControl)
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })
  })

  it("stops an active portrait loop when reduced motion is selected", () => {
    vi.useFakeTimers()
    const { rerender } = render(<AboutSection />)
    const portraitControl = screen.getByRole("button", {
      name: "Show next portrait of Dr. Derek Austin",
    })
    const portraitCard = portraitControl.firstElementChild as HTMLElement

    fireEvent.mouseEnter(portraitControl)
    act(() => {
      vi.advanceTimersByTime(750)
    })

    reducedMotionPreference.value = true
    rerender(<AboutSection />)

    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })
    expect(vi.getTimerCount()).toBe(0)
  })
})
