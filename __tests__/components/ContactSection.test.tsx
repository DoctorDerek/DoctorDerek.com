import { fireEvent, render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ContactSection from "@/components/ContactSection"

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

describe("ContactSection", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("safely centers the final section without hiding overflowing content", () => {
    render(<ContactSection />)

    const heading = screen.getByRole("heading", { name: "Contact" })
    const sectionContent = heading.closest("div.min-h-full")
    const contactComposition = heading.closest("div.my-auto")

    expect(sectionContent).not.toHaveClass("h-full")
    expect(sectionContent).not.toHaveClass("items-center")
    expect(contactComposition).toHaveClass("my-auto", "w-full")
    expect(screen.getByRole("link", { name: "Contact Me" })).toBeInTheDocument()
  })

  it("ends with the Contact CTA without persistent completion content", () => {
    render(<ContactSection />)

    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: "Back to the beginning ↑" }),
    ).not.toBeInTheDocument()
  })

  it("flips the portrait through its public button control", () => {
    render(<ContactSection />)

    const portraitControl = screen.getByRole("button", {
      name: "Flip portrait of Dr. Derek Austin",
    })
    const portraitCard = portraitControl.querySelector(".wrapper")

    expect(portraitControl).toHaveAttribute("aria-pressed", "false")
    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.click(portraitControl)

    expect(portraitControl).toHaveAttribute("aria-pressed", "true")
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })
  })

  it("keeps the reverse portrait face available at every breakpoint", () => {
    render(<ContactSection />)

    const portraitControl = screen.getByRole("button", {
      name: "Flip portrait of Dr. Derek Austin",
    })
    const reversePortraitFace = portraitControl.querySelector(".back")
    const portraitMosaic = portraitControl.querySelector(
      ".contact-portrait-mosaic",
    )

    expect(reversePortraitFace).not.toHaveClass("hidden")
    expect(reversePortraitFace).toHaveClass("absolute", "inset-0")
    expect(portraitMosaic).toHaveClass(
      "grid",
      "grid-cols-2",
      "grid-rows-[3fr_2fr]",
    )
    expect(portraitMosaic).toHaveAttribute("aria-hidden", "true")
    expect(portraitMosaic?.querySelectorAll("img")).toHaveLength(3)
  })

  it("describes the bounded responsive width of both portrait faces", () => {
    render(<ContactSection />)

    const portraitControl = screen.getByRole("button", {
      name: "Flip portrait of Dr. Derek Austin",
    })
    const portraitCard = portraitControl.querySelector(".wrapper")

    expect(portraitCard).toHaveClass("aspect-square", "w-full", "max-w-[488px]")
    expect(
      screen.getByAltText(
        "Dr. Derek Austin smiling by the ocean in a purple polo",
      ),
    ).toHaveAttribute("sizes", "(max-width: 767px) 43vw, 488px")

    const portraitMosaic = portraitControl.querySelector(
      ".contact-portrait-mosaic",
    )
    expect(
      Array.from(portraitMosaic?.querySelectorAll("img") ?? [], (image) =>
        image.getAttribute("sizes"),
      ),
    ).toEqual([
      "(max-width: 767px) 43vw, 488px",
      "(max-width: 767px) 22vw, 244px",
      "(max-width: 767px) 22vw, 244px",
    ])
  })

  it("flips the portrait without a spatial transition when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<ContactSection />)

    const portraitControl = screen.getByRole("button", {
      name: "Flip portrait of Dr. Derek Austin",
    })
    const portraitCard = portraitControl.querySelector(".wrapper")

    expect(portraitCard).toHaveStyle({ transition: "none" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })
  })
})
