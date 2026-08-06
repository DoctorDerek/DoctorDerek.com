import { render, screen } from "@testing-library/react"
import { createElement, type ComponentProps, type ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import Testimonials from "@/components/Testimonials"
import { TESTIMONIALS } from "@/constants/SITE_CONTENT"

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

vi.mock("@/components/ui/SectionHeading", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}))

describe("Testimonials", () => {
  it("keeps the complete heading visible at narrow mobile widths", () => {
    render(<Testimonials />)

    expect(
      screen.getByRole("heading", { name: "What People Say" }),
    ).toHaveClass("text-2xl", "min-[375px]:text-3xl", "md:text-7xl")
  })

  it("renders every configured testimonial once and in order", () => {
    render(<Testimonials />)

    expect(
      screen.getAllByRole("img").map((image) => image.getAttribute("alt")),
    ).toEqual(TESTIMONIALS.map(({ name }) => name))
  })

  it("renders the fallback portrait when a testimonial has no image", () => {
    const firstTestimonial = TESTIMONIALS[0]!
    const configuredImage = firstTestimonial.image
    firstTestimonial.image = undefined

    try {
      render(<Testimonials />)

      expect(screen.getAllByRole("img")[0]).toHaveAttribute("src")
    } finally {
      firstTestimonial.image = configuredImage
    }
  })
})
