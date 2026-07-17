import { act, fireEvent, render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import AboutSection from "@/components/AboutSection"

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
})
