import { fireEvent, render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ContactSection from "@/components/ContactSection"
import {
  CONTACT_COLLAGE_PORTRAITS,
  CONTACT_PORTRAIT,
  PORTRAIT_CONTROL_ACCESSIBLE_NAMES,
  PORTRAIT_IMAGE_SIZES,
} from "@/constants/PORTRAITS"
import { CONTACT_BULLETS, CONTACT_CTA } from "@/constants/SITE_CONTENT"

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

const getPortraitControl = () =>
  screen.getByRole("button", {
    name: PORTRAIT_CONTROL_ACCESSIBLE_NAMES.contact,
  })

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
    expect(screen.getByRole("link", { name: CONTACT_CTA })).toBeInTheDocument()
  })

  it("renders every canonical contact proof point", () => {
    render(<ContactSection />)

    for (const bullet of CONTACT_BULLETS) {
      expect(screen.getByText(bullet)).toBeInTheDocument()
    }
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

    const portraitControl = getPortraitControl()
    const portraitCard = portraitControl.querySelector(".wrapper")

    expect(portraitControl).toHaveAttribute("aria-pressed", "false")
    expect(portraitCard).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.click(portraitControl)

    expect(portraitControl).toHaveAttribute("aria-pressed", "true")
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })
  })

  it("keeps the reverse portrait face available at every breakpoint", () => {
    render(<ContactSection />)

    const portraitControl = getPortraitControl()
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
    const decorativePortraits = portraitMosaic?.querySelectorAll("img") ?? []
    expect(decorativePortraits).toHaveLength(CONTACT_COLLAGE_PORTRAITS.length)
    for (const decorativePortrait of decorativePortraits) {
      expect(decorativePortrait).toHaveAttribute("alt", "")
    }
  })

  it("describes the bounded responsive width of both portrait faces", () => {
    render(<ContactSection />)

    const portraitControl = getPortraitControl()
    const portraitCard = portraitControl.querySelector(".wrapper")

    expect(portraitCard).toHaveClass("aspect-square", "w-full", "max-w-[488px]")
    expect(
      screen.getByRole("img", { name: CONTACT_PORTRAIT.alt }),
    ).toHaveAttribute("sizes", PORTRAIT_IMAGE_SIZES.contactFull)

    const portraitMosaic = portraitControl.querySelector(
      ".contact-portrait-mosaic",
    )
    expect(
      Array.from(portraitMosaic?.querySelectorAll("img") ?? [], (image) =>
        image.getAttribute("sizes"),
      ),
    ).toEqual(CONTACT_COLLAGE_PORTRAITS.map(({ sizes }) => sizes))
  })

  it("flips the portrait without a spatial transition when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<ContactSection />)

    const portraitControl = getPortraitControl()
    const portraitCard = portraitControl.querySelector(".wrapper")

    expect(portraitCard).toHaveStyle({ transition: "none" })

    fireEvent.click(portraitControl)
    expect(portraitCard).toHaveStyle({ transform: "rotateY(180deg)" })
  })
})
