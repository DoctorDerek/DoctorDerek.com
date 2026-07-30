import { fireEvent, render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import AboutSection from "@/components/AboutSection"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
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

const getPortraitCard = (portraitControl: HTMLElement) =>
  portraitControl.querySelector(".flip-preview-visual > div") as HTMLElement

describe("AboutSection", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("advances the portrait sequence only through explicit activation", () => {
    render(<AboutSection />)

    const portraitControl = screen.getByRole("button", {
      name: "Show next portrait of Dr. Derek Austin",
    })
    const portraitCard = getPortraitCard(portraitControl)

    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })

    fireEvent.pointerEnter(portraitControl, { pointerType: "mouse" })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(360deg)" })
  })

  it("describes the measured responsive width of both portrait faces", () => {
    render(<AboutSection />)

    const responsiveSizes =
      "(max-width: 767px) 52vw, (max-width: 1023px) 45vw, 40.5vw"

    expect(screen.getByAltText("Dr Derek Austin")).toHaveAttribute(
      "sizes",
      responsiveSizes,
    )
    expect(screen.getByAltText("Dr Derek Austin Alternative")).toHaveAttribute(
      "sizes",
      responsiveSizes,
    )
  })

  it("does not start an automatic portrait loop on pointer entry", () => {
    const intervalSpy = vi.spyOn(window, "setInterval")
    render(<AboutSection />)
    const portraitControl = screen.getByRole("button", {
      name: "Show next portrait of Dr. Derek Austin",
    })
    const portraitCard = getPortraitCard(portraitControl)

    fireEvent.pointerEnter(portraitControl, { pointerType: "mouse" })

    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })
    expect(intervalSpy).not.toHaveBeenCalled()
    intervalSpy.mockRestore()
  })

  it("keeps portrait changes user-driven and instantaneous when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<AboutSection />)
    const portraitControl = screen.getByRole("button", {
      name: "Show next portrait of Dr. Derek Austin",
    })
    const portraitCard = getPortraitCard(portraitControl)

    expect(portraitCard).toHaveStyle({ transition: "none" })

    fireEvent.pointerEnter(portraitControl, { pointerType: "mouse" })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })
  })
})
