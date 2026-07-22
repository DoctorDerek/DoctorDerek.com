import { fireEvent, render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ContactSection from "@/components/ContactSection"

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
    priority: _priority,
    quality: _quality,
    ...imageProps
  }: ComponentProps<"img"> & {
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

  it("announces the end of the site and offers a return to the beginning", () => {
    render(<ContactSection />)

    expect(
      screen.getByRole("contentinfo", { name: "End of DoctorDerek.com" }),
    ).toHaveTextContent(
      "You’ve reached the end of DoctorDerek.com. Let’s build something great.",
    )
    expect(
      screen.getByRole("link", { name: "Back to the beginning ↑" }),
    ).toHaveAttribute("href", "#home")
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
