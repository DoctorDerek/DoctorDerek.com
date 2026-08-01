import { fireEvent, render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import AboutSection from "@/components/AboutSection"
import { PORTRAIT_CONTROL_ACCESSIBLE_NAMES } from "@/constants/INTERACTIONS"
import { ABOUT_PORTRAITS, PORTRAIT_IMAGE_SIZES } from "@/constants/PORTRAITS"
import { ABOUT_BIO_LONG } from "@/constants/SITE_CONTENT"

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

const getPortraitControl = () =>
  screen.getByRole("button", {
    name: PORTRAIT_CONTROL_ACCESSIBLE_NAMES.about,
  })

const expectRenderedPortraits = (
  expectedPortraits: readonly { alt: string }[],
) => {
  expect(
    screen.getAllByRole("img").map((image) => image.getAttribute("alt")),
  ).toEqual(expectedPortraits.map(({ alt }) => alt))
}

describe("AboutSection", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("advances the portrait sequence only through explicit activation", () => {
    render(<AboutSection />)

    const portraitControl = getPortraitControl()
    const portraitCard = getPortraitCard(portraitControl)

    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })
    expectRenderedPortraits([ABOUT_PORTRAITS[0], ABOUT_PORTRAITS[1]])

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })
    expectRenderedPortraits([ABOUT_PORTRAITS[2], ABOUT_PORTRAITS[1]])

    fireEvent.pointerEnter(portraitControl, { pointerType: "mouse" })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(360deg)" })
    expectRenderedPortraits([ABOUT_PORTRAITS[2], ABOUT_PORTRAITS[3]])
  })

  it("renders every canonical positioning paragraph", () => {
    render(<AboutSection />)

    for (const paragraph of ABOUT_BIO_LONG) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })

  it("describes the measured responsive width of both portrait faces", () => {
    render(<AboutSection />)

    for (const portraitImage of screen.getAllByRole("img")) {
      expect(portraitImage).toHaveAttribute("sizes", PORTRAIT_IMAGE_SIZES.about)
    }
  })

  it("does not start an automatic portrait loop on pointer entry", () => {
    const intervalSpy = vi.spyOn(window, "setInterval")
    render(<AboutSection />)
    const portraitControl = getPortraitControl()
    const portraitCard = getPortraitCard(portraitControl)

    fireEvent.pointerEnter(portraitControl, { pointerType: "mouse" })

    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })
    expect(intervalSpy).not.toHaveBeenCalled()
    intervalSpy.mockRestore()
  })

  it("keeps portrait changes user-driven and instantaneous when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<AboutSection />)
    const portraitControl = getPortraitControl()
    const portraitCard = getPortraitCard(portraitControl)

    expect(portraitCard).toHaveStyle({ transition: "none" })

    fireEvent.pointerEnter(portraitControl, { pointerType: "mouse" })
    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })
  })
})
